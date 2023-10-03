const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getStudentCount = async (req, res) => {
  try {
    // Fetch the count of users with the role "Student"
    const studentCount = await prisma.users.count({
      where: {
        roles: {
          path: ["Student"],
          equals: 1942,
        },
      },
    });

    res.status(200).json({ count: studentCount });
  } catch (error) {
    console.error("Error fetching student count:", error);
    res.status(500).json({ error: "Error fetching student count" });
  }
};

module.exports = { getStudentCount };