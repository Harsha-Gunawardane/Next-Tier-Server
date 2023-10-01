//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createContent = async (req, res) => {
  const user = req.user;
  const { title, description, subject, thumbnail, type, subject_areas, status } = req.body;

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

        title: "Thermodynamics 2.0",
        description: "The study of the relationships between heat, work, temperature, and energy transfer",
        type: "VIDEO",
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


const getVideoByTutorId = async (req, res) => {
  const user = req.user;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    const tutorId = foundUser.id;

    const videos = await prisma.content.findMany({
      where: {
        AND: {
          type: "VIDEO",
          user_id: tutorId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture: true,
            tutor: true
          }
        },
        _count: {
          select: {
            content_views: true,
            comments: true,
            content_reactions: {
              where: {
                islike: true
              }
            }
          }
        },
        content_reactions: {
          where: {
            islike: false
          }
        }


      },

    });


    //add dislike count by length of content_reactions array to _count
    videos.forEach((video) => {
      let dislikes = 0;
      dislikes = video.content_reactions.length;
      video._count.dislikes = dislikes;
    });


    res.json(videos);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createContent,
  getAllContents,
  getContentById,
  getVideoByTutorId
}