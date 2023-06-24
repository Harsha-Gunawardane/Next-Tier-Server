const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} Promise that resolves when user is registered
 */

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  // check if required data is present
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    // check duplicates username
    const duplicate = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (duplicate) return res.sendStatus(409);

    // register new user
    const hashedPassword = await bcrypt.hash(pwd, 10); // encrypt password

    // store new user
    const addedUser = await prisma.users.create({
      data: {
        username: user,
        roles: JSON.stringify({ User: 2001}),
        password: hashedPassword,
      },
    });

    console.log(addedUser);

    res.status(201).json({ success: `New user ${user} registered` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
