const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllPapers = asyncHandler(async (req, res) => {
  const courseId = req.params.courseId;

  try {
    // Use Prisma Client to retrieve all papers
    const allPapers = await prisma.papers.findMany({
      where: {
        course_id: courseId,
      },
    });

    if (!allPapers) return res.sendStatus(401);

    res.status(201).json(allPapers);
  } catch (error) {
    throw new Error("Error fetching papers: " + error.message);
  }
});

const addNewPaper = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);

    // Destructuring
    const { course_id, title, type, date, subject, subject_areas } = req.body;

    // Store new paper
    const addedPaper = await prisma.papers.create({
      data: {
        course_id,
        title,
        type,
        date,
        subject,
        subject_areas: { set: subject_areas }, // Set the array of subject_areas
      },
    });

    console.log("Added paper:", addedPaper);

    res.status(201).json(addedPaper);
  } catch (error) {
    console.error("Error handling new paper:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updatePaper = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    // find paper available or not before update
    const foundPaper = await prisma.papers.findFirst({
      where: {
        paper_id: id,
      },
    });

    if (!foundPaper) {
      return res.status(400).json({
        message: `Paper not found`,
      });
    }

    const updatedPaper = await prisma.papers.update({
      where: {
        paper_id: id,
      },
      data: req.body,
    });

    console.log("Updated paper:", updatedPaper);

    res.status(201).json(updatedPaper);
  } catch (error) {
    console.error("Error handling update paper:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deletePaper = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const foundPaper = await prisma.papers.findUnique({
      where: {
        paper_id: id,
      },
    });
    if (!foundPaper) {
      return res.status(400).json({ message: `Paper not found` });
    }

    const deletePaper = await prisma.papers.delete({
      where: { paper_id: id },
    });

    console.log("Delete paper:", deletePaper);

    res.status(201).json({ success: "Paper deleted", paper: deletePaper });
  } catch (error) {
    console.error("Error handling delete paper:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getPaper = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const getPaper = await prisma.papers.findUnique({
      where: {
        paper_id: id,
      },
    });

    if (!getPaper) {
      return res.status(400).json({ message: "Paper not found" });
    }

    res.status(201).json(getPaper);
  } catch (error) {
    throw new Error("Error fetching paper: " + error.message);
  }
});

module.exports = {
  getAllPapers,
  addNewPaper,
  updatePaper,
  deletePaper,
  getPaper,
};
