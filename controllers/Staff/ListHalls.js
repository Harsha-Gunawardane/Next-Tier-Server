const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAllHallDetails = async (req, res) => {
  try {
    // Fetch all halls from your Prisma model
    const allHalls = await prisma.halls.findMany();

    // Format the hall details
    const hallDetails = allHalls.map((hall) => ({
      id: hall.id,
      name: hall.name,
      capacity: hall.capacity,
      hall_profile: hall.hall_profile,
      facilities: hall.facilities,
    }));

    res.status(200).json(hallDetails);
  } catch (error) {
    console.error("Error fetching hall details:", error);
    res.status(500).json({ error: "Error fetching hall details" });
  }
};

const registerHall = async (req, res) => {
  try {
    const { image, hall_no, capacity, details } = req.body;
    console.log(req.body);

    const convertedCapacity = parseInt(capacity);

    // Create a new hall
    const newHall = await prisma.halls.create({
      data: {
        name: hall_no,
        capacity: convertedCapacity,
        facilities: details,
        hall_profile: image,
      },
    });

    console.log("New hall registered:", newHall);

    // Send success response
    res.status(201).json({ success: "New hall registered" });
  } catch (error) {
    console.error("Error registering hall:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateHall = async (req, res) => {
  try {
    const {
      id,
      name,
      capacity,
      facilities,
      hall_profile,
    } = req.body;

    const user = req.user;
    const convertedCapacity = parseInt(capacity);
    // Find the user based on the username
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // Unauthorized user

    // Update user details if there are differences
    if (
      foundUser.id !== id ||
      foundUser.name !== name ||
      foundUser.capacity !== capacity ||
      foundUser.facilities !== facilities ||
      foundUser.hall_profile !== hall_profile
    ) {
      const updatedData = {
        name: name,
        capacity: convertedCapacity,
        facilities: facilities,
        hall_profile: hall_profile,
      };

      const updatedUser = await prisma.halls.update({
        where: { id: id },
        data: updatedData,
      });
    }

    // Return the updated staff info or a success message
    const updatedHallInfo = req.body;
    res.json(updatedHallInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllHallDetails, registerHall, updateHall };
