const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Controller function to fetch staff details by ID(My Profile)
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
        address:true,
        NIC:true,
        username:true,
        instStaff: {
          select: {
            qualifications: true,
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


module.exports = {getStaffDetails}



