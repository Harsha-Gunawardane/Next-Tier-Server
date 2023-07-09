// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const asyncHandler = require("express-async-handler");

const getUser = asyncHandler(async (req, res) => {
  const username = req.params.username;
  console.log(username);

  try {
    const user = await prisma.users.findFirst({
      where: {
        username: username,
      },
    });
    if (!user) {
      return res.status(400).json({ message: `${username} not found` });
    }
    res.json(user);
  } catch (error) {
    throw error;
  }
});

module.exports = {
  getUser,
};
