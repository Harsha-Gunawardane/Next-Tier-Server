const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to get a specific staff's profile
const tutorProfile= async (req, res) => {
  const tutorId = req.params.id;

  try {
    const staffProfile = await prisma.users.findUnique({
      where: { id: tutorId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        profile_picture: true,
        join_date:true,
        address:true,
        DOB:true,
        NIC:true,
        phone_number:true,
        username:true,
        tutor: {
          select: {
            qualifications: true,
            medium:true,
            school:true,
            courses:{
              select:{
                id:true,
                title:true,
                description:true,
                medium:true,
                subject:true,
                start_date:true,
                monthly_fee:true,
                thumbnail:true,
              }
            }
          },
        },
      },
    });

    console.log("Fetched Staff Profile:", staffProfile);

    if (!staffProfile) {
      return res.status(404).json({ error: "Staff profile not found" });
    }

    res.status(200).json(staffProfile);
  } catch (error) {
    console.error("Error fetching staff profile:", error);
    res.status(500).json({ error: "Error fetching staff profile" });
  }
};



module.exports = {tutorProfile};
