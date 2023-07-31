// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");

const formatDate = require("../../core/formatDate");

const isFirstLetterInCapital = (str) => {
  const firstLetter = str.charAt(0);
  return firstLetter === firstLetter.toUpperCase();
};

const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

function getTimeDetails(startTimeStr, endTimeStr) {
  // Parse the start and end times into Date objects
  const startTime = new Date(startTimeStr);
  const endTime = new Date(endTimeStr);

  // Get the date of the start_time
  const startDate = startTime.toDateString();

  // Calculate the time range in minutes
  const timeRangeMs = endTime.getTime() - startTime.getTime();
  const timeRangeMinutes = Math.floor(timeRangeMs / (1000 * 60));

  // Format the time range in "hh.mm - hh.mm" format
  const startHours = startTime.getHours().toString().padStart(2, "0");
  const startMinutes = startTime.getMinutes().toString().padStart(2, "0");
  const endHours = endTime.getHours().toString().padStart(2, "0");
  const endMinutes = endTime.getMinutes().toString().padStart(2, "0");
  const timeRange = `${startHours}.${startMinutes} - ${endHours}.${endMinutes}`;

  // Format the spent time in "xxmin" format
  const spentTime = `${timeRangeMinutes}min`;

  return {
    date: startDate,
    timeRange,
    spentTime,
  };
}

const generateQuiz = async (req, res) => {
  const user = req.user;
  let { subject, value } = req.body;

  // validate inputs
  if (!subject || !value || value > 50)
    return res.status(400).json({ error: "Invalid arguments" });

  // restructure subject input
  if (!isFirstLetterInCapital(subject)) {
    subject = capitalizeFirstLetter(subject);
  }

  // check the user is authenticated
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // get questions
    const questions = await prisma.questions.findMany({
      where: {
        subject: subject,
      },
      take: value,
    });

    if (!questions.length)
      return res.status(500).json({ message: "No questions" });

    // restructure data
    let mcqIds = [];
    let answers = [];
    let responseData = [];

    questions.forEach((question) => {
      mcqIds.push(question.id);
      answers.push(question.correct_answer);
      responseData.push({
        id: question.id,
        options: question.options,
        question: question.question,
      });
    });

    // create quiz name
    const leasetQuizNo = await prisma.student_generate_quiz.count({
      where: {
        subject: subject,
        username: user,
      },
    });

    let newQuizNo = leasetQuizNo + 1;
    let quizName = "";

    if (String(newQuizNo).length === 1) {
      quizName = "0" + newQuizNo + "-quiz";
    } else {
      quizName = newQuizNo + "-quiz";
    }

    let date = new Date();
    date = date.toISOString();

    // create a new quiz for student
    newQuiz = await prisma.student_generate_quiz.create({
      data: {
        id: uuidv4(),
        username: user,
        mcq_ids: mcqIds,
        correct_answers: answers,
        subject: subject,
        quiz_name: quizName,
        date: date,
      },
    });

    const response = {
      questions: responseData,
      quizName,
    };

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const doneQuiz = async (req, res) => {
  const user = req.user;
  let { subject, quizName, result, startTime, endTime } = req.body;

  // restructure subject input
  if (!isFirstLetterInCapital(subject)) {
    subject = capitalizeFirstLetter(subject);
  }

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // get student generated quiz
    const generatedQuiz = await prisma.student_generate_quiz.findFirst({
      where: {
        subject: subject,
        quiz_name: quizName,
        username: user,
      },
    });

    console.log(generatedQuiz);

    if (!generatedQuiz)
      return res.status(400).json({ message: "No such quiz" });

    const questions = await prisma.questions.findMany({
      where: {
        id: {
          in: generatedQuiz.mcq_ids,
        },
      },
    });

    let noOfCorrectAnswers = 0;

    questions.forEach((question, index) => {
      if (question.correct_answer === result[index]) noOfCorrectAnswers += 1;
    });

    const mark = Math.floor((noOfCorrectAnswers / questions.length) * 100);

    // update result array in correct format
    const resultInInt = result
      .map((value) => (value !== null ? value : -1));

    console.log(resultInInt)

    // update as quiz is done
    const updatedQuiz = await prisma.student_generate_quiz.update({
      where: {
        id: generatedQuiz.id,
      },
      data: {
        user_answers: resultInInt,
        done: true,
        start_time: startTime,
        end_time: endTime,
        mark,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getQuizMarking = async (req, res) => {
  const user = req.user;
  let { subject, quizName } = req.body;

  // restructure subject input
  if (!isFirstLetterInCapital(subject)) {
    subject = capitalizeFirstLetter(subject);
  }

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // get student generated quiz
    const generatedQuiz = await prisma.student_generate_quiz.findFirst({
      where: {
        subject: subject,
        quiz_name: quizName,
        username: user,
      },
    });

    if (!generatedQuiz)
      return res.status(400).json({ message: "No such quiz" });
    const questions = await prisma.questions.findMany({
      where: {
        id: {
          in: generatedQuiz.mcq_ids,
        },
      },
    });
    // check user is done the quiz
    if (!generatedQuiz.done)
      return res.status(402).json({ message: "Quiz is not done yet" });

    // let noOfCorrectAnswers = 0;
    let responseQuestions = [];

    questions.forEach((question, index) => {
      const responseQuestion = {
        id: question.id,
        question: question.question,
        options: question.options,
        answers: question.correct_answer,
        explain: question.explanation,
      };

      responseQuestions.push(responseQuestion);
    });

    const dateDetails = getTimeDetails(
      generatedQuiz.start_time,
      generatedQuiz.end_time
    );

    console.log(generatedQuiz);
    const response = {
      questions: responseQuestions,
      answers: generatedQuiz.user_answers,
      mark: generatedQuiz.mark,
      dateDetails,
    };
    res.json({ response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getPreviousQuizzes = async (req, res) => {
  const user = req.user;
  let { subject, quizname } = req.params;

  // restructure subject input
  if (!isFirstLetterInCapital(subject)) {
    subject = capitalizeFirstLetter(subject);
  }

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    let previousQuizzes;
    if(quizname) {
      previousQuizzes = await prisma.student_generate_quiz.findMany({
        where: {
          subject: subject,
          done: true,
          quiz_name: {
            contains: quizname
          }
        },
      });
    } else {
      previousQuizzes = await prisma.student_generate_quiz.findMany({
        where: {
          subject: subject,
          done: true,
        },
        take: 3,
      });
    }

    let responseQuizzes = [];
    previousQuizzes.forEach((quiz) => {
      const quizData = {
        subject: quiz.subject,
        quizname: quiz.quiz_name,
        value: quiz.mark,
        date: formatDate(quiz.date),
        color:
          quiz.mark > 75 ? "#15BD66" : quiz.mark > 35 ? "#FFD466" : "#D93400",
      };

      responseQuizzes.push(quizData);
    });
    res.json({ responseQuizzes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { generateQuiz, getQuizMarking, doneQuiz, getPreviousQuizzes };
