const bcrypt = require("bcrypt");
const { format } = require("date-fns");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import register form validation schema
const registerFormSchema = require("../../validators/registerFormValidator");

/**
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} Promise that resolves when user is registered
 */

const handleNewUser = async (req, res) => {
  // validate input form data
  const { error, data } = registerFormSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // const { user, pwd, fName, lName, phoneNo } = req.body;
  const { user, pwd, fName, lName, phoneNo } = req.body;

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

    // get joined time of new user
    const joinedTime = new Date();;

    // store new user
    const addedUser = await prisma.users.create({
      data: {
        username: user,
        first_name: fName,
        last_name: lName,
        phone_number: phoneNo,
        roles: { User: 2001, Student: 1942 },
        password: hashedPassword,
        join_date: joinedTime,
      },
    });

    console.log(addedUser);

    res.status(201).json({ success: `New user ${user} registered` });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    throw error;
  }
};

module.exports = { handleNewUser };
