const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import register form validation schema
const registerFormSchema = require("../../validators/registerFormValidator");

/**
 * Handles the registration of a new user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Promise that resolves when the user is registered.
 */
const handleNewUser = async (req, res) => {
  try {
    // Validate input form data
    const { error, value } = registerFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { user, pwd, fName, lName, phoneNo } = value;

    // Check for duplicate username
    const existingUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (existingUser) {
      return res.sendStatus(409);
    }

    // Register new user
    const hashedPassword = await bcrypt.hash(pwd, 10); // Encrypt password
    const joinedTime = new Date();

    // Store new user
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

    // Add student to DB
    const addedStudent = await prisma.students.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        grade: "", 
        stream: "",
        emergency_contact: {},
        school: "",
      },
    });

    console.log(addedStudent);

    res.status(201).json({ success: `New user ${user} registered` });
  } catch (error) {
    console.error("Error handling new user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleNewUser };
