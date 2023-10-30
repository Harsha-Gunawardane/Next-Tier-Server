const uuid = require("uuid").v4;
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 3600 });

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const writeOnTute = async (req, res) => {
  const { id, content } = req.body;

  // console.log(content);

  let date = new Date();
  date = date.toISOString();

  try {
    const updatedTute = await prisma.tutes.update({
      where: {
        id: id,
      },
      data: {
        content: content,
        recent_activity: date,
      },
    });

    res.status(201).json({ message: "Successfully updated tute" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const initializeTute = async (req, res) => {
  const user = req.user;
  const { id, name, description, folderName } = req.body;

  // console.log(description)

  try {
    const foundTute = await prisma.tutes.findFirst({
      where: {
        user_name: user,
        name: name,
      },
    });

    if (foundTute)
      return res.status(409).json({ message: "Tutename is already exist" });

    let date = new Date();
    date = date.toISOString();

    if (folderName) {
      const tempF = await prisma.folders.findFirst({
        where: {
          user_name: user,
          name: folderName,
        },
      });
      const updatedFolder = await prisma.folders.update({
        where: {
          id: tempF.id,
        },
        data: {
          tute_ids: {
            push: id,
          },
        },
      });

      // console.log(updatedFolder);
      if (!updatedFolder)
        return res.status(400).jso({ message: "No such folder" });

      const newTute = await prisma.tutes.create({
        data: {
          id,
          name,
          description,
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
          description,
          created_at: date,
          user: {
            connect: { username: user },
          },
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
          // console.log(tuteData);
          if (tuteData) {
            folderData.pages.push(tuteData);
          }
        });
      }

      folders.push(folderData);
    });

    // console.log("pages", pages);
    // console.log("folder", folders);
    // console.log("Temp tutes", tempPages);

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
    const activityTime = new Date();

    const tute = await prisma.tutes.update({
      where: { id },
      data: {
        recent_activity: activityTime,
      },
      select: {
        name: true,
        content: true,
        description: true,
        recent_activity: true,
        starred: true,
        archived: true,
      },
    });

    res.status(200).json({ tute });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTute = async (req, res) => {
  const user = req.user;
  const { id } = req.query;

  try {
    const tute = await prisma.tutes.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
      },
    });
    if (!tute) res.status(400).json({ error: "Not Found" });

    const deletedTute = await prisma.tutes.delete({
      where: { id },
    });
    res.status(200).json({ message: "Tute deleted successfully" });
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

    // console.log(cache);
    const cachedData = cache.get(id);
    if (cachedData) {
      // Serve the cached PDF data

      const response = {
        name: tute.name,
        file: cachedData,
      };

      // console.log(response);

      return res.send({ response });
    } else {
      // console.log(tute);
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
        // console.log(response);

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
  const { message, days } = req.body;

  const wDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  try {
    const userData = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
      },
    });

    let existSchedule = await prisma.reading_schedule.findFirst({
      where: {
        user_id: userData.id,
      },
      select: {
        schedule: true,
        id: true,
      },
    });

    // console.log(existSchedule);
    let schedule = existSchedule?.schedule;

    if (!existSchedule) {
      const newSchedule = await prisma.reading_schedule.create({
        data: {
          user_id: userData.id,
        },
      });

      existSchedule = newSchedule;
      // console.log(newSchedule);
      schedule = {
        Sun: null,
        Mon: null,
        Tue: null,
        Wed: null,
        Thu: null,
        Fri: null,
        Sat: null,
      };
    }
    days.map((day) => {
      schedule[day] = message;
    });

    const updatedSchedule = await prisma.reading_schedule.update({
      where: {
        user_id: userData.id,
        id: existSchedule.id,
      },
      data: {
        schedule: schedule,
      },
    });

    res.send({
      message: "Successfully created",
      data: updatedSchedule.schedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getReminders = async (req, res) => {
  const user = req.user;

  try {
    const userData = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
      },
    });
    const schedules = await prisma.reading_schedule.findFirst({
      where: {
        user_id: userData.id,
      },
      select: {
        schedule: true,
      },
    });

    res.send(schedules);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  writeOnTute,
  initializeTute,
  getTutesAndFolders,
  getTuteContent,
  viewPdf,
  createFolder,
  setReminder,
  getReminders,
  deleteTute,
};
