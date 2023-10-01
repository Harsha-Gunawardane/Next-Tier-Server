// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { questions } = require("../models/sampleData");

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

module.exports = { addQuestions };
