const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllStaffDetails = async (req, res) => {
  try {
    // Fetch all users from your Prisma model
    const allUsers = await prisma.users.findMany();

    // Filter users based on roles
    const staffDetails = allUsers.filter(user => {
      const roles = user.roles;
      return roles && roles.User === 2001 && roles.Staff === 1984;
    }).map(user => ({
      id: user.id,
      first_name: user.first_name, 
      last_name: user.last_name,  
      join_date: user.join_date,
      profile_picture: user.profile_picture,
    }));

    res.status(200).json(staffDetails);
  } catch (error) {
    console.error("Error fetching staff details:", error);
    res.status(500).json({ error: "Error fetching staff details" });
  }
};

  
module.exports = { getAllStaffDetails };
