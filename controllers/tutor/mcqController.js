const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tutorMcqFormSchema = require("../../validators/tutor/tutorMcqFormValidator");

const getAllMcqs = asyncHandler(async (req, res) => {
  try {
    // Use Prisma Client to retrieve all mcqs
    const getAllMcqs = await prisma.questions.findMany();

    if (!getAllMcqs) return res.sendStatus(401);

    res.status(201).json(getAllMcqs);
  } catch (error) {
    throw new Error("Error fetching mcqs: " + error.message);
  }
});

const createNewMcq = asyncHandler(async (req, res) => {
  try {
    // Validate input form data
    const { error, value } = tutorMcqFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Destructuring
    const {
      question,
      points,
      difficulty_level,
      subject,
      subject_areas,
      options,
      correct_answer,
      explanation,
    } = value;

    // Store new mcq
    const addedMcq = await prisma.questions.create({
      data: {
        question,
        points: parseInt(points),
        difficulty_level,
        subject,
        subject_areas: { set: subject_areas }, // Set the array of subject_areas
        options: { set: options }, // Set the array of options
        correct_answer: parseInt(correct_answer),
        explanation,
      },
    });

    console.log("Added Mcq:", addedMcq);

    res.status(201).json({ success: "New mcq added", Mcq: addedMcq });
  } catch (error) {
    console.error("Error handling new mcq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateMcq = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    // Validate input form data
    const { error, value } = tutorMcqFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    // Destructuring
    const {
      question,
      points,
      difficulty_level,
      subject,
      subject_areas,
      options,
      correct_answer,
      explanation,
    } = value;

    const updatedMcq = await prisma.questions.update({
      where: {
        id: id,
      },
      data: {
        question,
        points: parseInt(points),
        difficulty_level,
        subject,
        subject_areas: { set: subject_areas }, // Set the array of subject_areas
        options: { set: options }, // Set the array of options
        correct_answer: parseInt(correct_answer),
        explanation,
      },
    });

    console.log("Updated Mcq:", updatedMcq);

    res.status(201).json({ success: "Mcq updated", Mcq: updatedMcq });
  } catch (error) {
    console.error("Error handling update mcq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteMcq = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    // find user registered or not
    const foundMcq = await prisma.questions.findUnique({
      where: {
        id: id,
      },
    });
    if (!foundMcq) {
      return res.status(400).json({ message: `Mcq not found` });
    }

    const deleteMcq = await prisma.questions.delete({
      where: { id: id },
    });

    console.log("Delete Mcq:", deleteMcq);

    res.status(201).json({ success: "Mcq deleted", Mcq: deleteMcq });
  } catch (error) {
    console.error("Error handling delete mcq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getMcq = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const getMcq = await prisma.questions.findUnique({
      where: {
        id: id,
      },
    });

    if (!getMcq) {
      return res.status(400).json({ message: "Mcq not found" });
    }

    res.status(201).json(getMcq);
  } catch (error) {
    throw new Error("Error fetching Mcq: " + error.message);
  }
});

module.exports = {
  getAllMcqs,
  createNewMcq,
  updateMcq,
  deleteMcq,
  getMcq,
};
