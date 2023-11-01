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

const checkQuizAvailability = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        end_time: true,
        schedule_time: true,
      },
    });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const now = Date.now();
    const endTime = new Date(quiz.end_time).getTime();
    const scheduledTime = new Date(quiz.schedule_time).getTime();

    if (now > endTime) {
      return res.status(400).json({ message: "Quiz has already ended" });
    }

    if (now < scheduledTime) {
      return res.status(400).json({ message: "Quiz is not published yet!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const attempQuiz = async (req, res) => {
  const { quizId } = req.query;
  console.log(quizId);

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        end_time: true,
        schedule_time: true,
        question_ids: true,
        title: true,
        subject: true,
      },
    });

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const now = Date.now();
    const endTime = new Date(quiz.end_time).getTime();
    const scheduledTime = new Date(quiz.schedule_time).getTime();

    if (now > endTime) {
      return res.status(400).json({ message: "Quiz has already ended" });
    }

    if (now < scheduledTime) {
      return res.status(400).json({ message: "Quiz is not published yet!" });
    }

    const data = {
      noOfQuestions: quiz.question_ids.length,
      subject: quiz.subject,
      mcqName: quiz.title,
    };

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getQuestionsByIds = async (ids) => {
  const questionsWithoutOrder = await prisma.questions.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  const questionsMap = new Map();
  questionsWithoutOrder.forEach((question) => {
    questionsMap.set(question.id, question);
  });

  // Arrange the questions in the order of mcq_ids
  const questions = ids.map((id) => questionsMap.get(id));
  return questions;
};

const getCourseRelatedQuestions = async (req, res) => {
  const user = req.user;
  const { quizId } = req.body;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    const alreadyAttemptedQuiz = await prisma.student_attempt_quiz.findFirst({
      where: {
        student_id: foundUser.id,
        quiz_id: quizId,
      },
      select: {
        score: true,
      },
    });

    if (alreadyAttemptedQuiz)
      return res.status(400).json({ message: "You are already attempted" });

    const data = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        question_ids: true,
        title: true,
        subject: true,
      },
    });

    if (!data.question_ids.length)
      return res.status(500).json({ message: "No questions" });

    // restructure data
    let mcqIds = [];
    let answers = [];
    let responseData = [];

    const questions = await getQuestionsByIds(data.question_ids);

    questions.forEach((question) => {
      mcqIds.push(question.id);
      answers.push(question.correct_answer);

      responseData.push({
        id: question.id,
        options: question.options,
        question: question.question,
      });
    });

    let date = new Date();
    date = date.toISOString();

    // create a new quiz for student
    newQuiz = await prisma.student_generate_quiz.create({
      data: {
        id: uuidv4(),
        username: user,
        mcq_ids: mcqIds,
        correct_answers: answers,
        subject: data.subject,
        quiz_name: data.title,
        date: date,
      },
    });

    const attemptedQuiz = await prisma.student_attempt_quiz.create({
      data: {
        student_id: foundUser.id,
        quiz_id: quizId,
      },
    });

    const response = {
      questions: responseData,
      quizName: data.title,
    };

    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRelatedQuestions = async (weakAreas, numberOfQuestions, subject) => {
  const questions = await prisma.questions.findMany({
    where: {
      subject: subject,
      subject_areas: {
        hasSome: weakAreas,
      },
    },
    take: numberOfQuestions,
  });

  return questions;
};

const getRandomQuestions = async (
  noOfQuestions,
  excludedQuestionIDs,
  subject
) => {
  const questions = await prisma.questions.findMany({
    where: {
      id: {
        notIn: excludedQuestionIDs,
      },
      subject: subject,
    },
    take: noOfQuestions,
  });

  return questions;
};

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Generate a random index

    // Swap elements at i and j
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const generateQuiz = async (req, res) => {
  const user = req.user;
  let { subject, value } = req.body;

  // validate inputs
  if (!subject) {
    return res.status(400).json({ error: "Already done quiz!" });
  } else if (!value) {
    return res.status(400).json({ error: "No of questions is required" });
  } else if (value > 50) {
    return res
      .status(400)
      .json({ error: "No of questions must not be more than 50" });
  } else if (value < 0) {
    return res
      .status(400)
      .json({ error: "No of questions must not be less than zero" });
  }

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

    let questions;

    // get weak areas
    const weakAreasOfStudent = await prisma.students.findUnique({
      where: {
        student_id: foundUser.id,
      },
      select: {
        weak_areas: true,
      },
    });

    const weakAreas = weakAreasOfStudent.weak_areas[subject];

    if (weakAreas) {
      const noOfRelatedQuestions = Math.floor(value * 0.6);
      const noOfRandomQuestions = value - noOfRelatedQuestions;

      const relatedQuestions = await getRelatedQuestions(
        weakAreas,
        noOfRelatedQuestions,
        subject
      );

      let relatedQuestionIds = [];
      relatedQuestions.forEach((question) => {
        relatedQuestionIds.push(question.id);
      });

      const randomQuestions = await getRandomQuestions(
        noOfRandomQuestions,
        relatedQuestionIds,
        subject
      );
      const mergedQuestions = relatedQuestions.concat(randomQuestions);

      questions = shuffleArray(mergedQuestions);
    } else {
      questions = await prisma.questions.findMany({
        where: {
          subject: subject,
        },
        take: value,
      });
    }

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

function findDuplicates(arr, duplicateValue = 1) {
  let duplicates = [];
  let uniqueItems = {};

  arr.forEach(function (item) {
    if (uniqueItems[item]) {
      if (uniqueItems[item] === duplicateValue) {
        duplicates.push(item);
      }
      uniqueItems[item]++;
    } else {
      uniqueItems[item] = 1;
    }
  });

  return duplicates;
}

const identifyWeakAreas = (questions, answers) => {
  let weakAreas = [];

  questions.forEach((question, index) => {
    if (question.correct_answer != answers[index]) {
      if (question.subject_areas.length) {
        question.subject_areas.forEach((area) => {
          weakAreas.push(area);
        });
      }
    }
  });

  return findDuplicates(weakAreas);
};

const identifyRecoveredAreas = (questions, answers) => {
  let recoveredAreas = [];

  questions.forEach((question, index) => {
    if (question.correct_answer === answers[index]) {
      if (question.subject_areas.length) {
        question.subject_areas.forEach((area) => {
          recoveredAreas.push(area);
        });
      }
    }
  });

  return findDuplicates(recoveredAreas, 2);
};

const updateWeakAreas = async (
  weakAreas,
  subject,
  studentId,
  recoveredAreas = null
) => {
  const student = prisma.students.findUnique({
    where: {
      student_id: studentId,
    },
    select: {
      weak_areas: true,
    },
  });

  if (!student) return false;

  const newWeakAreas = { ...(student.weak_areas || {}) }; // Clone the existing weak areas or initialize as empty object

  if (!newWeakAreas[subject]) {
    newWeakAreas[subject] = []; // Initialize if the subject doesn't exist
  }

  // Remove duplicates and update weak areas for the given subject
  newWeakAreas[subject] = [
    ...new Set([...newWeakAreas[subject], ...weakAreas]),
  ];

  if (recoveredAreas) {
    newWeakAreas[subject] = newWeakAreas[subject].filter(
      (area) => !recoveredAreas.includes(area)
    );
  }

  await prisma.students.update({
    where: {
      student_id: studentId,
    },
    data: {
      weak_areas: newWeakAreas,
    },
  });

  return true;
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

    if (!generatedQuiz)
      return res.status(400).json({ message: "No such quiz" });

    const questions = await getQuestionsByIds(generatedQuiz.mcq_ids);
    let noOfCorrectAnswers = 0;

    questions.forEach((question, index) => {
      // console.log(question)
      if (question.correct_answer === result[index]) noOfCorrectAnswers += 1;
    });

    const mark = Math.floor((noOfCorrectAnswers / questions.length) * 100);

    // update result array in correct format
    const resultInInt = result.map((value) => (value !== null ? value : -1));

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
    const weakAreas = identifyWeakAreas(questions, result);
    const recoveredAreas = identifyRecoveredAreas(questions, result);

    updateWeakAreas(weakAreas, subject, foundUser.id, recoveredAreas);

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

    console.log(generatedQuiz);

    if (!generatedQuiz)
      return res.status(400).json({ message: "No such quiz" });

    // check user is done the quiz
    if (!generatedQuiz.done)
      return res.status(402).json({ message: "Quiz is not done yet" });

    const questions = await getQuestionsByIds(generatedQuiz.mcq_ids);

    // let noOfCorrectAnswers = 0;
    let responseQuestions = [];

    questions.forEach((question) => {
      console.log(question);
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

// const getPreviousQuizzes = async (req, res) => {
//   const user = req.user;
//   let { subject, quizname } = req.params;

//   // restructure subject input
//   if (!isFirstLetterInCapital(subject)) {
//     subject = capitalizeFirstLetter(subject);
//   }

//   try {
//     const foundUser = await prisma.users.findUnique({
//       where: {
//         username: user,
//       },
//     });
//     if (!foundUser) return res.sendStatus(401);

//     let previousQuizzes;
//     if(quizname) {
//       previousQuizzes = await prisma.student_generate_quiz.findMany({
//         where: {
//           subject: subject,
//           done: true,
//           quiz_name: {
//             contains: quizname
//           }
//         },
//       });
//     } else {
//       previousQuizzes = await prisma.student_generate_quiz.findMany({
//         where: {
//           subject: subject,
//           done: true,
//         },
//         take: 3,
//       });
//     }

//     let responseQuizzes = [];
//     previousQuizzes.forEach((quiz) => {
//       const quizData = {
//         subject: quiz.subject,
//         quizname: quiz.quiz_name,
//         value: quiz.mark,
//         date: formatDate(quiz.date),
//         color:
//           quiz.mark > 75 ? "#15BD66" : quiz.mark > 35 ? "#FFD466" : "#D93400",
//       };

//       responseQuizzes.push(quizData);
//     });
//     res.json({ responseQuizzes });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };

const getPreviousQuizzes = async (req, res) => {
  const user = req.user;
  let { subject, isAll } = req.query;

  console.log(req.query);

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
    if (isAll === "f") {
      previousQuizzes = await prisma.student_generate_quiz.findMany({
        where: {
          subject: subject,
          done: true,
        },
        take: 3,
      });
      console.log("previousQuizzes 1");
    } else if (isAll === "t") {
      previousQuizzes = await prisma.student_generate_quiz.findMany({
        where: {
          subject: subject,
          done: true,
        },
      });
      console.log("previousQuizzes 2");
    }

    let responseQuizzes = [];
    if (previousQuizzes) {
      previousQuizzes.forEach((quiz) => {
        const quizData = {
          subject: quiz.subject,
          quizname: quiz.quiz_name,
          value: quiz.mark,
          date: formatDate(quiz.date),
          id: quiz.id,
          color:
            quiz.mark > 75 ? "#15BD66" : quiz.mark > 35 ? "#FFD466" : "#D93400",
        };

        responseQuizzes.push(quizData);
      });
    }
    res.json({ responseQuizzes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const getMetaData = async (req, res) => {
  const { subject } = req.query;
  const user = req.user;

  try {
    const result = await prisma.student_generate_quiz.aggregate({
      where: {
        subject: subject,
        username: user,
        done: true,
      },
      _avg: {
        mark: true,
      },
      _count: true,
    });

    const response = {
      averageMark: result._avg,
      count: result._count,
    };

    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateQuiz,
  getQuizMarking,
  doneQuiz,
  getPreviousQuizzes,
  attempQuiz,
  getCourseRelatedQuestions,
  checkQuizAvailability,
  getMetaData
};
