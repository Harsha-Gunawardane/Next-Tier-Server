// const uuid = require("uuid").v4;

const bcrypt = require("bcrypt");

const generateRandomPassword = () => {
  const length = Math.floor(Math.random() * (15 - 8 + 1)) + 8; // Random length between 8 and 15
  const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const allowedCharacters = uppercaseLetters + lowercaseLetters + digits;
  // Ensure at least one lowercase letter, one uppercase letter, and one digit
  let password = '';
  password += lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length));
  password += uppercaseLetters.charAt(Math.floor(Math.random() * uppercaseLetters.length));
  password += digits.charAt(Math.floor(Math.random() * digits.length));

  const remainingCharacters = allowedCharacters.length;

  for (let i = 0; i < length - 3; i++) {
    const randomIndex = Math.floor(Math.random() * remainingCharacters);
    password += allowedCharacters.charAt(randomIndex);
  }

  return password;
};


// import Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Handles the registration of a new institute staff.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - Promise that resolves when the user is registered.
 */
const registerStaff = async (req, res) => {
  try {
    const { firstName, lastName, username, phoneNumber} = req.body;
    console.log(req.body);

    // Check for duplicate username
    const existingUser = await prisma.users.findUnique({
      where: {
        username: username,
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // const pwd = uuid();
    // Generate a random password
    const generatedPassword = generateRandomPassword();
    console.log('Generated Password:', generatedPassword);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const joinedTime = new Date();

    // Create a new user with role as Staff
    const newStaffMember = await prisma.users.create({
      data: {
        username: username,
        first_name: firstName,
        last_name: lastName,
        phone_number:phoneNumber ,
        password: hashedPassword,
        roles: { User: 2001,  Staff : 1984 },
        join_date: joinedTime,
      },
    });

    console.log('New staff member registered:', newStaffMember);

    // Send success response
    res.status(201).json({ success: 'New staff member registered' });
  } catch (error) {
    console.error('Error registering staff:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { registerStaff };
