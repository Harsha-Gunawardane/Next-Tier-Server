const bcrypt = require("bcrypt");

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
    console.log (error);
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
        roles: { User: 2001, Tutor : 1932  },
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




const getTutor = async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = foundUser.id;

    // Extract the tutor ID from the logged-in user's data
 
    console.log(tutorId);

    const details = await prisma.tutor.findUnique({
      where: {
        tutor_id: tutorId,
      },
      include: {
        user: true, // Include user details
        courses: true, // Include courses related to the tutor
      },
    });

    // Close the Prisma client connection
    await prisma.$disconnect();

    // Return the retrieved data
    res.json(details);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Don't forget to export the function
const getStaffDetails = async (req, res) => {
  try {
   const user=req.user
   console.log(user);

    // Fetch staff details from the database based on the staff ID
    const staffDetails = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        first_name: true,
        last_name: true,
        phone_number: true,
        join_date:true,
        profile_picture:true,
        DOB:true,
        email:true,
        address:true,
        NIC:true,
        username:true,
        tutor: {
          select: {
            qualifications: true,
          
            description:true,
          },
        },
        // Add other relevant fields you want to retrieve
      },
    });
 console.log(staffDetails);
    if (!staffDetails) {
      return res.status(400).json({ error: 'Staff not found' });
    }

    res.status(200).json(staffDetails);
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const editDetails = async (req, res) => {
  const { first_name, last_name, phone_number, qualifications, description } = req.body;
  const user = req.user; // Assuming you have the user information in req.user

  try {
    // Start a Prisma transaction
    await prisma.$transaction(async (prisma) => {
      // Update the user table
      await prisma.users.update({
        where: { username: user },
        data: {
          first_name: first_name,
          last_name: last_name,
          phone_number: phone_number,
        },
      });

      // Check if the user has a related tutor record
      const tutor = await prisma.tutor.findUnique({
        where: { user_username: user },
      });

      if (tutor) {
        // Update the tutor table if a related record exists
        await prisma.tutor.update({
          where: { user_username: user },
          data: {
            qualifications: qualifications,
            description: description,
          },
        });
      }
    });

    // Return success
    res.json({ message: 'Details updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while updating details' });
  } finally {
    await prisma.$disconnect(); // Disconnect from the Prisma client
  }
};




module.exports = { handleNewUser,getTutor,getStaffDetails,editDetails };
