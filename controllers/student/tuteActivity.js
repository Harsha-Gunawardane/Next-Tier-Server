// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getRecentTutes = async (req, res) => {
  try {
    const tutes = await prisma.tutes.findMany({
      take: 6,
      select: {
        id: true,
        name: true,
        description: true,
        recent_activity: true,
        starred: true,
      },
      orderBy: {
        recent_activity: "desc",
      },
    });

    res.send(tutes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const starredTute = async (req, res) => {
  const { id, starred } = req.body;

  try {
    const tutes = await prisma.tutes.update({
      where: { id },
      data: {
        starred,
      },
    });

    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const archivedTute = async (req, res) => {
  const { id, archived } = req.body;

  try {
    const tutes = await prisma.tutes.update({
      where: { id },
      data: {
        archived,
      },
    });

    res.status(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getArchivedTutes = async (req, res) => {
  console.log("Hello")

  try {
    const archivedTutes = await prisma.tutes.findMany({
      where: {
        archived: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        archived: true,
        recent_activity: true,
      },
    });

    res.send(archivedTutes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getStarredTutes = async (req, res) => {
  try {
    const starredTutes = await prisma.tutes.findMany({
      where: {
        starred: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        starred: true,
        recent_activity: true,
      },
    });

    console.log(starredTutes)
    res.send(starredTutes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getRecentTutes,
  starredTute,
  archivedTute,
  getArchivedTutes,
  getStarredTutes,
};
