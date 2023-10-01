const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tutorMcqFormSchema = require("../../validators/tutor/tutorMcqFormValidator");

const getAllMcqCategories = asyncHandler(async (req, res) => {
  try {
    // Use Prisma Client to retrieve all mcqzes
    const AllMcqCategories = await prisma.mcq_category.findMany();

    if (!AllMcqCategories) return res.sendStatus(401);

    res.status(201).json(AllMcqCategories);
  } catch (error) {
    throw new Error("Error fetching mcqzes: " + error.message);
  }
});

const createNewMcqCategory = asyncHandler(async (req, res) => {
  try {
    
    // Store new category
    const addedMcqCategory = await prisma.mcq_category.create({
      data: req.body,
    });

    console.log("Added mcq category:", addedMcqCategory);

    res.status(201).json(addedMcqCategory);

  } catch (error) {
    console.error("Error handling new category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


const updateMcqCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    // find mcq category available or not before update
    const foundCategory = await prisma.mcq_category.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundCategory) {
      return res.status(400).json({
        message: `Mcq Category not found`,
      });
    }

    const updatedCategory = await prisma.mcq_category.update({
      where: {
        id: id,
      },
      data: req.body,
    });

    console.log("Updated category:", updatedCategory);

    res.status(201).json(updatedCategory);
  } catch (error) {
    console.error("Error handling update mcq:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const deleteMcqCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    // find user registered or not
    const foundCategory = await prisma.mcq_category.findUnique({
      where: {
        id: id,
      },
    });
    if (!foundCategory) {
      return res.status(400).json({ message: `Mcq category not found` });
    }

    const deleteMcqCategory = await prisma.mcq_category.delete({
      where: { id: id },
    });

    console.log("Delete mcq category:", deleteMcqCategory);

    res.status(201).json({ success: "mcq ategory deleted", mcq: deleteMcqCategory });
  } catch (error) {
    console.error("Error handling delete mcq category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getMcqCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const getMcqCategory = await prisma.mcq_category.findUnique({
      where: {
        id: id,
      },
    });

    if (!getMcqCategory) {
      return res.status(400).json({ message: "Mcq category not found" });
    }

    res.status(201).json(getMcqCategory);
  } catch (error) {
    throw new Error("Error fetching mcq category: " + error.message);
  }
});

//Special feature

const mcqAddToCategory = asyncHandler(async (req, res) => {
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
    
    // Extract the ID of the added MCQ
    const addedMcqId = addedMcq.id;
  
    // find category available or not before update
    const found = await prisma.mcq_category.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundMcqCategory) {
      return res.status(400).json({
        message: `Mcq category not found`,
      });
    }

    // Update the mcq's question_ids array and number_of_questions based on the added MCQ
    const updatedMcqCategory = await prisma.mcq_category.update({
      where: {
        id: id,
      },
      data: {
        question_ids: {
          set: [...foundMcqCategory.question_ids, addedMcqId], // Add the new MCQ ID to the existing array
        },
        number_of_questions: foundMcqCategory.question_ids.length + 1, // Update the number based on the new length
      },
    });

    console.log("Added mcq to the category:", updatedMcqCategory);

    res.status(201).json(addedMcq);

  } catch (error) {
    console.error("Error handling added mcq to the category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getMcqsFromCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;

  try {
    // Use Prisma Client to retrieve the quiz by its ID
    const category = await prisma.mcq_category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      return res.sendStatus(404); // Return a 404 response if the quiz is not found
    }

    // Filter out non-existing question IDs
    const existingQuestionIds = [];
    for (const questionId of category.question_ids) {
      const question = await prisma.questions.findUnique({
        where: {
          id: questionId,
        },
      });
      if (question) {
        existingQuestionIds.push(questionId);
      } else {
        // Delete the non-existing question ID from the category's question_ids array
        await prisma.category.update({
          where: {
            id: category.id,
          },
          data: {
            question_ids: {
              set: category.question_ids.filter((id) => id !== questionId),
            },
          },
        });
      }
    }

    // Retrieve questions based on existing question IDs
    const questions = await prisma.questions.findMany({
      where: {
        id: {
          in: existingQuestionIds,
        },
      },
    });

    res.status(200).json(questions);
  } catch (error) {
    throw new Error("Error fetching questions: " + error.message);
  }
});

const mcqDeleteFromCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.categoryId;
  const mcqId = req.params.mcqId;

  try {
    // find quiz available or not before update
    const foundCategory = await prisma.mcq_category.findFirst({
      where: {
        id: categoryId,
      },
    });

    if (!foundCategory) {
      return res.status(400).json({
        message: `Category not found`,
      });
    }

    const updatedCategory = await prisma.mcq_category.update({
      where: {
        id: categoryId,
      },
      data: {
        question_ids: {
          set: foundCategory.question_ids.filter(
            (questionId) => questionId !== mcqId
          ), // Remove the specified mcqId
        },
        number_of_questions: foundCategory.question_ids.length - 1, // Update the number based on the new length
      },
    });

    //Delete mcq from the db
    const foundMcq = await prisma.questions.findUnique({
      where: {
        id: id,
      },
    });
    if (!foundMcq) {
      return res.status(400).json({ message: `Mcq not found` });
    }

    const deleteMcq = await prisma.questions.delete({
      where: { id: mcqId },
    });

    console.log("Delete Mcq:", deleteMcq);

    console.log("Delete mcq from the category:", updatedCategory);

    res.status(201).json(updatedCategory);
  } catch (error) {
    console.error("Error handling delete mcq from the category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = {
  getAllMcqCategories,
  createNewMcqCategory,
  updateMcqCategory,
  deleteMcqCategory,
  getMcqCategory,
  mcqAddToCategory,
  getMcqsFromCategory,
  mcqDeleteFromCategory,
};
