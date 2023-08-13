// complaints.js
const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Fetch all complaints
const complaints = async (req, res) => {
  try {
    const complaints = await prisma.complaints.findMany({
    //   include: {
    //     user: true,
    //   },
    // });
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

const editComplaint = async (req, res) => {
    try {
      const { id } = req.params;
      const { action } = req.body;
  
      // Fetch complaint from the database
      const complaint = await prisma.complaints.findUnique({
        where: { id },
      });
  
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
  
      // Update the complaint with the new action
      complaint.action = action;
      complaint.status = "RESOLVED"; // Update status to RESOLVED
  
      // Save the updated complaint
      await prisma.complaints.update({
        where: { id },
        data: complaint,
      });
  
      return res.json(complaint);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
};

// Ignore complaint endpoint
const ignoreComplaint= async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch complaint from the database
      const complaint = await prisma.complaints.findUnique({
        where: { id },
      });
  
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
  
      // Update the complaint status to IGNORED
      complaint.status = "IGNORED";
  
      // Save the updated complaint
      await prisma.complaints.update({
        where: { id },
        data: complaint,
      });
  
      return res.json(complaint);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {complaints,editComplaint,ignoreComplaint};
