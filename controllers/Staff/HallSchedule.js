const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { v4: uuidv4 } = require("uuid");

const getAllHallSchedule = async (req, res) => {
    try {
      // Fetch all hall schedules from your Prisma model
      const allEvents = await prisma.hall_schedule.findMany({
        include: {
          hall: true,    
          course: true,  
        },
      });
  
        // Generate unique IDs for events that don't have them
        const eventsSchedule = allEvents.map((event) => ({
          ...event,
          id: event.id || uuidv4(), // Use existing ID or generate a new one
      }));

      // Format the hall schedule details
      const eventDetails = eventsSchedule.map((event) => ({
        id: event.id,
        hall_id: event.hall_id,
        day: event.day,
        date: event.date,
        start_time: event.start_time,
        end_time: event.end_time,
        // type: event.type,
        // course_id: event.course_id,
        hall: event.hall.name,     
        title: event.course.title, 
      }));
  
      res.status(200).json(eventDetails);
    } catch (error) {
      console.error("Error fetching schedule details:", error);
      res.status(500).json({ error: "Error fetching schedule details" });
    }
};

module.exports = { getAllHallSchedule };
