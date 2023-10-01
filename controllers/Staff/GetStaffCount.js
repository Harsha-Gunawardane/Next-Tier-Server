const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStaffCount = async (req, res) => {
  try {
    // Fetch the staff count
    const staffCount = await prisma.instStaff.count();

    res.status(200).json({ count: staffCount });
  } catch (error) {
    console.error("Error fetching staff count:", error);
    res.status(500).json({ error: "Error fetching staff count" });
  }
};

module.exports = { getStaffCount };
