const fs = require("fs");
const path = require("path");
const htmlToPdf = require("html-pdf");
const { Storage } = require("@google-cloud/storage");
const uuid = require("uuid").v4;
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storage = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFile.json"),
  projectId: "eastern-button-394702",
});
const MAX_FILE_SIZE_MB = 20;

const {
  fileBucket,
  googleCloud,
} = require("../../middleware/fileUpload/fileUpload");

const generatePdf = async (req, res) => {
  const user = req.user;
  const { id, content } = req.body;

  console.log(id);

  let date = new Date();
  date = date.toISOString();

  try {
    const foundTute = await prisma.tutes.findUnique({
      where: {
        id,
      },
    });
    if (!foundTute) return res.status(400).json({ message: "No such tute" });

    const styledContent = `<html>
        <head>
          <style>
            body { font-size: 20px; margin-top: 100px}
            .appName {
              position: absolute;
              top: 0;
              right: 0;
              width: fit-content
            }
          </style>
        </head>
        <body>
          <h4 class="appName">Next-Tier</h4>
          ${content}
        </body>
      </html>
    `;

    const localFilePath = `./public/tutes/${user}_${foundTute.name.replace(
      / /g,
      "_"
    )}.pdf`;
    const pdfOptions = {
      format: "A4",
      border: {
        top: "0.5in",
        right: "1in",
        bottom: "1in",
        left: "1in",
      },
    };
    htmlToPdf
      .create(styledContent, pdfOptions)
      .toFile(localFilePath, async (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "Error generating PDF" });
        }

        // Check the size of the PDF file
        const stats = fs.statSync(localFilePath);
        const fileSizeInBytes = stats.size;
        const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert to MB

        if (fileSizeInMB > MAX_FILE_SIZE_MB) {
          console.log("PDF size exceeds the limit");
          // Delete the local file before sending the error response
          fs.unlinkSync(localFilePath);
          return res
            .status(400)
            .json({ message: "PDF size exceeds the limit (20MB)" });
        }

        const newPdfFileName = `${date}-${uuid()}-${foundTute.name.replace(
          / /g,
          "_"
        )}.pdf`;

        // Upload the PDF file to GCS
        const bucketName = "next_tier_file_bucket";
        const remoteFileName = newPdfFileName;

        try {
          await storage.bucket(bucketName).upload(localFilePath, {
            destination: remoteFileName,
          });
        } catch (error) {
          console.error(error);

          const updatedTute = await prisma.tutes.update({
            where: {
              id,
            },
            data: {
              content,
              local_url: localFilePath,
            },
          });

          return res
            .status(201)
            .json({ message: "Successfully generated pdf but upload later" });
        }

        const authenticatedUrl = await storage
          .bucket(bucketName)
          .file(newPdfFileName)
          .getSignedUrl({
            action: "read",
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          });

        console.log("Authenticated URL " + authenticatedUrl[0]);

        // update the GCS as well
        if (foundTute.gcs_name) {
          console.log("delete");
          const bucket = storage.bucket(bucketName);
          const file = bucket.file(foundTute.gcs_name);

          try {
            await file.delete();
          } catch (error) {
            console.log(error);
          }
        }

        if (authenticatedUrl) {
          console.log("Authenticated");
        }
        const updatedTute = await prisma.tutes.update({
          where: {
            id,
          },
          data: {
            content,
            url: authenticatedUrl[0],
            isUpload: true,
            gcs_name: newPdfFileName,
          },
        });

        if (fs.existsSync(localFilePath)) {
          try {
            fs.unlinkSync(localFilePath);
          } catch (error) {
            console.log(error);
          }
        }

        console.log(
          `PDF uploaded to GCS bucket: ${bucketName}/${remoteFileName}`
        );
        res
          .status(201)
          .json({ message: "Successfully generated and uploaded PDF" });
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const initializeTute = async (req, res) => {
  const user = req.user;
  const { id, name, folderName } = req.body;
  const file = req.file;

  try {
    const foundTute = await prisma.tutes.findUnique({
      where: {
        id,
      },
    });
    if (foundTute)
      return res.status(409).json({ message: "Tutename is already exist" });

    let date = new Date();
    date = date.toISOString();

    if (file) {
      const newPdfFileName = `${date}_${uuid()}_${file.originalname.replace(
        / /g,
        "_"
      )}`;
      console.log(newPdfFileName);

      const blob = fileBucket.file(newPdfFileName);
      const blobStream = blob.createWriteStream();

      blobStream.on("finish", () => {
        console.log("success");
      });
      blobStream.end(file.buffer);
    }

    if (folderName) {
      const tempF = await prisma.folders.findFirst({
        where: {
          user_name: user,
          name: folderName,
        }
      })
      const updatedFolder = await prisma.folders.update({
        where: {
          id: tempF.id
        },
        data: {
          tute_ids: {
            push: id,
          },
        },
      });

      console.log(updatedFolder);
      if (!updatedFolder)
        return res.status(400).jso({ message: "No such folder" });

      const newTute = await prisma.tutes.create({
        data: {
          id,
          name,
          created_at: date,
          user_name: user,
          folder_id: updatedFolder.id,
        },
      });
    } else {
      const newTute = await prisma.tutes.create({
        data: {
          id,
          name,
          created_at: date,
          user_name: user,
        },
      });
    }

    res.status(201).json({ message: `${name} is created` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTutesAndFolders = async (req, res) => {
  const user = req.user;

  try {
    const tutes = await prisma.tutes.findMany({
      where: {
        user_name: user,
      },
      select: {
        id: true,
        name: true,
        folder_id: true,
      },
    });

    let pages = [];
    let folders = [];

    let tempPages = {};

    tutes.forEach((tute) => {
      if (!tute.folder_id) {
        pages.push(tute);
      } else {
        tempPages[tute.id] = tute;
      }
    });

    const foldersData = await prisma.folders.findMany({
      where: {
        user_name: user,
      },
      select: {
        id: true,
        name: true,
        tute_ids: true,
      },
    });

    foldersData.forEach((folder) => {
      let folderData = {
        name: folder.name,
        pages: [],
      };

      if (folder.tute_ids) {
        folder.tute_ids.forEach((tuteId) => {
          const tuteData = tempPages[tuteId];
          console.log(tuteData);
          if (tuteData) {
            folderData.pages.push(tuteData);
          }
        });
      }

      folders.push(folderData);
    });

    console.log("pages", pages);
    console.log("folder", folders);
    console.log("Temp tutes", tempPages);

    res.status(200).json({ data: { pages, folders } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTuteContent = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  try {
    const tute = await prisma.tutes.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        content: true,
      },
    });

    res.status(200).json({ tute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewPdf = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  try {
    const tute = await prisma.tutes.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        gcs_name: true,
      },
    });

    console.log(cache);
    const cachedData = cache.get(id);
    if (cachedData) {
      // Serve the cached PDF data

      const response = {
        name: tute.name,
        file: cachedData,
      };

      console.log(response);

      return res.send({ response });
    } else {
      console.log(tute);
      try {
        const bucketName = "next_tier_file_bucket";
        const [file] = await storage
          .bucket(bucketName)
          .file(tute.gcs_name)
          .download();

        const zlib = require("zlib");
        const compressedData = zlib.gzipSync(file);

        const response = {
          name: tute.name,
          file: compressedData,
        };

        const keys = cache.keys();
        // If cache has reached the limit, remove the oldest item
        if (keys.length >= 3) {
          const oldestKey = keys[0];
          cache.del(oldestKey);
        }

        // Cache the PDF data for future requests
        cache.set(id, compressedData);
        console.log(response);

        res.send({ response });
      } catch (error) {
        console.log(error);
        res.status(404).json({ message: "PDF not found" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const createFolder = async (req, res) => {
  const user = req.user;
  const { name } = req.body;

  if (!name && length(name) < 3)
    return res.status(400).json({ message: "Invalid name" });
  try {
    const existingFolder = await prisma.folders.findFirst({
      where: {
        name: name,
        user_name: user,
      },
    });
    if (existingFolder)
      return res.status(409).json({ message: "Folder already exists" });

    const newFolder = await prisma.folders.create({
      data: {
        id: uuid(),
        user_name: user,
        name: name,
      },
    });

    res.status(201).json({ message: "Successfully created folder" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const setReminder = async (req, res) => {
  const user = req.user;
  const {message, time, days} = req.body;

  
}

module.exports = {
  generatePdf,
  initializeTute,
  getTutesAndFolders,
  getTuteContent,
  viewPdf,
  createFolder,
};
