//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createContent = async (req, res) => {
  const user = req.user;
  const {title, description, subject, thumbnail,type,subject_areas,status} = req.body;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);
    const tutorId = foundUser.id;

    // create content


    const newContent = await prisma.content.create({
      data: {

        title: "Thermodynamics 1.0",
        user_id:tutorId,
        description: "The study of the relationships between heat, work, temperature, and energy transfer",
        type: "TUTE",
        subject: "Physics",
        subject_areas: ["Electricity", "Magnetism"],
        status: "PUBLIC",
        thumbnail: "https://www.heatgeek.com/wp-content/uploads/2020/08/Thermal-Dynamics.png",
  
      },
    });

    res.json(newContent);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};





const getAllContents = async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);
    const tutorId = foundUser.id;


    const content = await prisma.content.findMany({
    
    });

    console.log(content);
    res.json(content);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



const getContentById = async (req, res) => {
  const user = req.user;
  const contentId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id; // Assuming the tutor's ID is available in req.user

  try {
    const content = await prisma.content.findUnique({
      where: {
        id: contentId,
        tutorId: tutorId, // Add the condition to filter by tutorId
      },
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};






const getAll = async (req, res) => {
  const contentId = req.params.id;
  const user = req.user;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);
    const tutorId = foundUser.id;

    const content = await prisma.content.findMany({
      where: {
        id: contentId,
     // Add the condition to filter by tutorId
      },
      // Your existing query parameters for content retrieval
    });

    const quizzes = await prisma.quiz.findMany({
      where: {
        id: contentId,
      // Add the condition to filter by tutorId
      },
      // Add any necessary query parameters for quiz retrieval
    });

    console.log(content);
    console.log(quizzes);

   
    const responseData = [...content, ...quizzes];

    res.json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createContent,getAllContents,getContentById,getAll }