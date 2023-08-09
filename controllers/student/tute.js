const fs = require("fs");
const path = require("path");
const htmlToPdf = require("html-pdf");
const { Storage } = require("@google-cloud/storage");
const uuid = require("uuid").v4;

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const storage = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFile.json"),
  projectId: "eastern-button-394702",
});
const MAX_FILE_SIZE_MB = 20;

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
  const { id, name } = req.body;

  console.log(id);

  const foundUser = await prisma.users.findUnique({
    where: {
      username: user,
    },
  });

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

    const newTute = await prisma.tutes.create({
      data: {
        id,
        name,
        created_at: date,
        user_id: foundUser.id,
      },
    });

    res.status(201).json({ message: `${name} is created` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getTutesAndFolders = async (req, res) => {
  const user = req.user;

  try {
    const userData = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true
      }
    });

    const tutes = await prisma.tutes.findMany({
      where: {
        user_id: userData.id,
      },
      select: {
        id: true,
        name: true,
        folder_id: true,
      },
    });

    let pages = []
    tutes.forEach((tute) => {
      if(!tute.folder_id) {
        pages.push(tute)
      }
    })

    const folders = await prisma.folders.findMany({
      where: {
        user_id: userData.id,
      },
      select: {
        id: true,
        name: true,
        tute_ids: true,
      },
    });

    let foldersDic = {}
    folders.forEach((folder) => {
      foldersDic[folder.id] = folder
    })

    res.status(200).json({ data: { pages, tutes, folders: foldersDic } });
  } catch (error) {
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
      }
    })

    res.status(200).json({ tute })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { generatePdf, initializeTute, getTutesAndFolders, getTuteContent };
