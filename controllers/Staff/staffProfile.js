const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to get a specific staff's profile
const staffProfile= async (req, res) => {
  const staffId = req.params.id;

  try {
    const staffProfile = await prisma.users.findUnique({
      where: { id: staffId },
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
        instStaff: {
          select: {
            qualifications: true,
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

module.exports = {staffProfile};
