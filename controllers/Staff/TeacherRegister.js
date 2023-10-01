const uuid = require("uuid").v4;
const express = require('express');
const router = express.Router();

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleNewTeacher = async (req, res) => {
  const user = req.user;

  const { image, fName, lName, phoneNo, nic, dob, address, email, subjects } = req.body;

  try {
    const pwd = uuid();
    let date = new Date();
    date = date.toISOString();

    const foundUser = await prisma.users.findUnique({
      where: {
        username: email,
      },
    });
    if (foundUser)
      return res.status(409).json({ message: "Already exist uesr." });
    // Store new user
    const addedUser = await prisma.users.create({
      data: {
        profile_picture:image,
        username: email,
        first_name: fName,
        last_name: lName,
        phone_number: phoneNo,
        NIC: nic,
        DOB: new Date(dob),
        address: address,
        roles: { User: 2001, Tutor : 1932},
        password: pwd,
        join_date: new Date(),
      },
    });

    console.log(addedUser);

    // Add teacher to DB
    const addedTutor = await prisma.tutor.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        subjects: subjects,
        email: email,
      },
    });
    //send a SMS
    console.log(addedTutor);

    res.status(201).json({ success: `New user ${fName} registered` });
  } catch (error) {
    console.error("Error handling new user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllTutorDetails = async (req, res) => {
  try {
    // Fetch all tutors from the Prisma model, including subject data
    const allTutors = await prisma.tutor.findMany({
      include: {
        user: true, // Include the related user data
      },
    });

    // Filter tutors based on roles
    const tutorDetails = allTutors
      .filter((tutor) => {
        const roles = tutor.user.roles;
        return (
          roles && roles.User === 2001 && roles.Tutor === 1932
        );
      })
      .map((tutor) => ({
        tutor_id: tutor.user.id,
        profileImage: tutor.user.profile_picture,
        active: tutor.user.status,
        fName: tutor.user.first_name,
        lName: tutor.user.last_name,
        email: tutor.user.username,
        subjects: tutor.subjects,
      }));

    res.status(200).json(tutorDetails);
  } catch (error) {
    console.error("Error fetching tutor details:", error);
    res.status(500).json({ error: "Error fetching tutor details" });
  }
};

const updateTutorStatus = async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  try {
    // Update the tutor's status in the database
    const updatedTutor = await prisma.users.update({
      where: { id: id },
      data: { status: active },
    });

    // Respond with the updated tutor object
    res.json(updatedTutor);
  } catch (error) {
    console.error('Error updating tutor status:', error);
    res.status(500).json({ error: 'Error updating tutor status. Please try again.' });
  }
};

const getTutorCount = async (req, res) => {
  try {
    // Fetch the hall count from your Prisma model named 'hall'
    const tutorCount = await prisma.tutor.count();

    res.status(200).json({ count: tutorCount });
  } catch (error) {
    console.error("Error fetching tutor count:", error);
    res.status(500).json({ error: "Error fetching tutor count" });
  }
};

module.exports = { handleNewTeacher, getAllTutorDetails, updateTutorStatus, getTutorCount };
