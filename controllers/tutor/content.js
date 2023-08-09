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

    // create content


    const newContent = await prisma.content.create({
      data: {

        title: "Teminology",
        description: "A comprehensive study of electricity and magnetism.",
        type: "VIDEO",
        subject: "Physics",
        subject_areas: ["Electricity", "Magnetism"],
        status: "PUBLIC",
        thumbnail: "https://th.bing.com/th/id/OIP.zdFVJGSqbP-KSSS7AtxOugHaEK?pid=ImgDet&rs=1",
  
      },
    });

    res.json(newContent);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};





const getAllContents = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = user.id;

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


module.exports = { createContent,getAllContents,getContentById }