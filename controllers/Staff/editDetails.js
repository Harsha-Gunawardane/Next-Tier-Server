const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const moment = require("moment"); // Import Moment.js library

// PUT /staff/profile
const editDetails = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      phone_number,
      NIC,
    //   DOB,
      address,
    } = req.body;

    const user = req.user; 

    // Parse DOB using Moment.js
    // const parseDOB = DOB ? moment(DOB, "YYYY-MM-DD").toDate() : null;

    // Find the user based on the username
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // Unauthorized user

    // Update user details if there are differences
    if (
      foundUser.first_name !== first_name ||
      foundUser.last_name !== last_name ||
    //   foundUser.DOB !== parseDOB ||
      foundUser.address !== address ||
      foundUser.phone_number !== phone_number ||
      foundUser.NIC !== NIC
    ) {
      const updatedData = {
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number,
        // DOB: parseDOB,
        address: address,
        NIC: NIC,
      };

      const updatedUser = await prisma.users.update({
        where: { username: user },
        data: updatedData,
      });
    }

    // Return the updated staff info or a success message
    const updatedStaffInfo = req.body;
    res.json(updatedStaffInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { editDetails };
