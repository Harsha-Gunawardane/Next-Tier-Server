// complaints.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fetch all complaints
const complaints = async (req, res) => {
  try {
    const complaints = await prisma.complaints.findMany({
 
    include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            profile_picture: true,
          },
        },
      },
    });
    res.json(complaints);
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {complaints};