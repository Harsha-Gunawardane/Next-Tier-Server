// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { questions, quizzes, categories } = require("../models/sampleData");

const addQuestions = async (req, res) => {
  console.log(questions);
  try {
    for (const question of questions) {
        await prisma.questions.create({
            data: question
        })
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addQuizzes = async (req, res) => {
  try {
    for (const quiz of quizzes) {
      await prisma.quiz.create({
        data: quiz,
      });
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const addCategories = async (req, res) => {
  try {
    for (const category of categories) {
      await prisma.mcq_category.create({
        data: category,
      });
    }

    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addQuestions, addQuizzes, addCategories };
