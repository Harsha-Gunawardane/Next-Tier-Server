// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const giveFeedback = async (req, res) => {
  const user = req.user;
  const { message } = req.body;

  if (!message) return res.status(400).json({ message: "Invalid message" });

  try {
    const userData = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
      },
    });

    const newFeedback = await prisma.complaints.create({
      data: {
        message: message,
        user_id: userData.id,
        type: "OTHER",
      },
    });

    res.send({ message: "Feedback sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { giveFeedback };
