const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tutorMcqFormSchema = require("../../validators/tutor/tutorMcqFormValidator");

const getAllMcqCategories = asyncHandler(async (req, res) => {
  try {
    // Use Prisma Client to retrieve all quizzes
    const AllMcqCategories = await prisma.mcq_category.findMany();

    if (!AllMcqCategories) return res.sendStatus(401);

    res.status(201).json(AllMcqCategories);
  } catch (error) {
    throw new Error("Error fetching quizzes: " + error.message);
  }
});

const createNewMcqCategory = asyncHandler(async (req, res) => {
  try {
    // Validate input form data
    // const { error, value } = tutorQuizFormSchema.validate(req.body);

    // if (error) {
    //   console.log(error);
    //   return res.status(400).json({ error: error.details[0].message });
    // }

    // Destructuring
    // const { title, subject, subject_areas, number_of_questions, question_ids } =
    //   value;

    // Store new quiz
    const addedMcqCategory = await prisma.mcq_category.create({
      data: req.body,
    });

    console.log("Added quiz:", addedMcqCategory);

    res.status(201).json(addedMcqCategory);

  } catch (error) {
    console.error("Error handling new category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// const updateQuiz = asyncHandler(async (req, res) => {
//   const id = req.params.id;

//   try {
//     // Validate input form data
//     const { error, value } = tutorQuizFormSchema.validate(req.body);

//     if (error) {
//       console.log(error);
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     // find quiz available or not before update
//     const foundQuiz = await prisma.quiz.findFirst({
//       where: {
//         id:id
//       },
//     });

//     if (!foundQuiz) {
//       return res.status(400).json({
//         message: `Quiz not found`,
//       });
//     }

//     //Destructuring
//     const { title, subject, subject_areas, number_of_questions, question_ids } =
//       value;

//     const updatedQuiz = await prisma.quiz.update({
//       where: {
//         id: id,
//       },
//       data: value,
//     });

//     console.log("Updated quiz:", updatedQuiz);

//     res.status(201).json({ success: "Quiz updated", quiz: updatedQuiz });
//   } catch (error) {
//     console.error("Error handling update quiz:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// const deleteQuiz = asyncHandler(async (req, res) => {
//   const id = req.params.id;

//   try {
//     // find user registered or not
//     const foundQuiz = await prisma.quiz.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     if (!foundQuiz) {
//       return res.status(400).json({ message: `Quiz not found` });
//     }

//     const deleteQuiz = await prisma.quiz.delete({
//       where: { id: id },
//     });

//     console.log("Delete quiz:", deleteQuiz);

//     res.status(201).json({ success: "Quiz deleted", quiz: deleteQuiz });
//   } catch (error) {
//     console.error("Error handling delete quiz:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

const getMcqCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const getMcqCategory = await prisma.quiz.findUnique({
      where: {
        id: id,
      },
    });

    if (!getMcqCategory) {
      return res.status(400).json({ message: "Mcq category not found" });
    }

    res.status(201).json(getQuiz);
  } catch (error) {
    throw new Error("Error fetching quiz: " + error.message);
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
  
    // find quiz available or not before update
    const found = await prisma.quiz.findFirst({
      where: {
        id: id,
      },
    });

    if (!foundQuiz) {
      return res.status(400).json({
        message: `Quiz not found`,
      });
    }

    // Update the quiz's question_ids array and number_of_questions based on the added MCQ
    const updatedQuiz = await prisma.quiz.update({
      where: {
        id: id,
      },
      data: {
        question_ids: {
          set: [...foundQuiz.question_ids, addedMcqId], // Add the new MCQ ID to the existing array
        },
        number_of_questions: foundQuiz.question_ids.length + 1, // Update the number based on the new length
      },
    });

    console.log("Added mcq to the quiz:", updatedQuiz);

    res.status(201).json(addedMcq);

  } catch (error) {
    console.error("Error handling added mcq to the quiz:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  getAllMcqCategories,
  createNewMcqCategory,
  // updateQuiz,
  // deleteQuiz,
  getMcqCategory,
  mcqAddToCategory,
};
