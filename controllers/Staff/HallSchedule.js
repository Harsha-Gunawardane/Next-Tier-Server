const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { v4: uuidv4 } = require("uuid");

const getAllHallSchedule = async (req, res) => {
  try {
    const allEvents = await prisma.hall_schedule.findMany({
      include: {
        hall: true,
        course: true,
      },
    });

    const eventDetails = allEvents.map((event) => {
      const datePart = event.date.toISOString().split("T")[0];
      const startDateTime = new Date(datePart + "T" + event.start_time);
      const endDateTime = new Date(datePart + "T" + event.end_time);

      return {
        id: event.id || uuidv4(),
        date: datePart,
        start: startDateTime,
        end: endDateTime,
        type: event.type,
        title: event.course.title,
        medium: event.course.medium,
        subject: event.course.subject,
        hall: event.hall.name,
      };
    });

    res.status(200).json(eventDetails);
  } catch (error) {
    console.error("Error fetching schedule details:", error);
    res.status(500).json({ error: "Error fetching schedule details" });
  }
};

// Controller function to create a hall schedule
const createSchedule = async (req, res) => {
  const user = req.user;
  const { hallId, day, startTime, date, endTime, type, courseId, } = req.body;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // Convert date to the format "YYYY-MM-DDTHH:mm:ssZ"
    const formattedDate = new Date(`${date}T00:00:00Z`).toISOString();

    // Check if a schedule with the same hall_id, day, start_time, and end_time already exists
    const existingSchedule = await prisma.hall_schedule.findFirst({
      where: {
        hall_id: hallId,
        day,
        start_time: startTime,
        end_time: endTime,
      },
    });

    if (existingSchedule) {
      // Schedule already exists
      return res
        .status(400)
        .json({ error: "Schedule already exist at the moment" });
    }

    const schedule = await prisma.hall_schedule.create({
      data: {
        hall_id: hallId,
        day,
        date: formattedDate,
        start_time: startTime,
        end_time: endTime,
        type: type,
        course_id: courseId,
      },
    });

    res
      .status(201)
      .json({ message: "Schedule created successfully", schedule });
  } catch (error) {
    console.error("Error creating schedule:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the schedule" });
  }
};

const updateHallSchedule = async (req, res) => {
  try {
    const { hall_id, day, start_time, end_time } = req.params; 
    const { newDate, newDay } = req.body; 

    // Check if the schedule with the given parameters exists
    const existingSchedule = await prisma.hall_schedule.findUnique({
      where: {
        hall_id_day_start_time_end_time: {
          hall_id,
          day,
          start_time,
          end_time,
        },
      },
    });

    if (!existingSchedule) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // Update the date of the schedule
    const updatedSchedule = await prisma.hall_schedule.update({
      where: {
        hall_id_day_start_time_end_time: {
          hall_id,
          day,
          start_time,
          end_time,
        },
      },
      data: {
         date: newDate,
         day: newDay 
        },
    });

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error Updating Schedule Details:", error);
    res.status(500).json({ error: "Error Updating Schedule Details" });
  }
};


module.exports = { getAllHallSchedule, createSchedule, updateHallSchedule };
