const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import register form validation schema
const registerFormSchema = require('../../validators/registerFormValidator');

/**
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} Promise that resolves when user is registered
 */

const handleNewUser = async (req, res) => {

  // validate input form data
  const { error, data } = registerFormSchema.validate(req.body);

  if(error) {
    return res
      .status(400)
      .json({ error: error.details[0].message });
  }
  
  const { user, pwd } = req.body;

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
