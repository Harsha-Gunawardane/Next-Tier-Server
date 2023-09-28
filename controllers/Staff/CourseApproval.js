// const uuid = require("uuid").v4;
const express = require("express");
const router = express.Router();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleNewCourse = async (req, res) => {
  const {
    title,
    details,
    subject,
    grade,
    price,
    date,
    hallId,
    tutor_id,
    schedule,
    medium,
  } = req.body;

  try {
    // Verify if the tutor exists
    const existingTutor = await prisma.tutor.findUnique({
      where: {
        tutor_id: tutor_id,
      },
    });
    if (!existingTutor) {
      return res.status(400).json({ message: "Tutor not found." });
    }

    // Parse the date directly
    const startDate = new Date(`${date}T00:00:00Z`);

    // Convert the monthly fee to an integer
    const monthly_fee = parseInt(price, 10);

    // Create a new course
    const newCourse = await prisma.courses.create({
      data: {
        tutor: {
          connect: { tutor_id }, // Use provided tutor_id
        },
        title,
        description: details,
        subject,
        medium: medium,
        grade,
        start_date: startDate,
        monthly_fee,
        hall: {
          connect: { id: hallId },
        },
        schedule: [schedule],
      },
    });

    // Log the new course and send a response
    console.log(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

// Fetch all class requests
const handleRequests = async (req, res) => {
  try {
    const courseRequests = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        subject: true,
        status: true,
        tutor: {
          select: {
            email: true,
            user: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    res.json(courseRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch requests from the database
    const request = await prisma.courses.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "APPROVED"; // Update status to APPROVED

    // Save the updated request
    await prisma.courses.update({
      where: { id },
      data: request,
    });

    return res.json(request);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Reject request endpoint
const rejectRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch requests from the database
    const request = await prisma.courses.findUnique({
      where: { id },
    });

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Update the request status to REJECTED
    request.status = "REJECTED";

    // Save the updated request
    await prisma.courses.update({
      where: { id },
      data: request,
    });

    return res.json(request);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getClassCount = async (req, res) => {
  try {
    // Fetch the hall count from your Prisma model named 'hall'
    const classCount = await prisma.courses.count();

    res.status(200).json({ count: classCount });
  } catch (error) {
    console.error("Error fetching hall count:", error);
    res.status(500).json({ error: "Error fetching hall count" });
  }
};

const getClassDetails = async (req, res) => {
  try {
    const currentDate = new Date(); // Get the current date 
    currentDate.setHours(0, 0, 0, 0); // Set the time to midnight (00:00:00.000)
    const courseRequests = await prisma.courses.findMany({
      include: {
        tutor: {
          include: {
            user: true,
          },
        },
        hall_schedule: true,
        hall: true,
      },
    });

    const mappedCourseDetails = courseRequests
      .map((course) => {
        const matchingSchedules = course.hall_schedule.filter(
          (hallSchedule) => {
            const scheduleDate = new Date(hallSchedule.date);
            scheduleDate.setHours(0, 0, 0, 0);
            return (
              scheduleDate.toISOString().split("T")[0] ===
              currentDate.toISOString().split("T")[0]
            );
          }
        );

        if (matchingSchedules.length === 0) {
        
          return null;
        }

        return {
          id: course.id,
          title: course.title,
          subject: course.subject,
          description: course.description,
          hall: {
            name: course.hall.name,
          },
          tutor: {
            email: course.tutor.email,
            medium: course.tutor.medium,
            user: {
              first_name: course.tutor.user.first_name,
              last_name: course.tutor.user.last_name,
              profile_picture: course.tutor.user.profile_picture,
            },
          },
          hall_schedule: matchingSchedules.map((hallSchedule) => {
            const datePart = hallSchedule.date.toISOString().split("T")[0];
            return {
              date: datePart,
              start_time: hallSchedule.start_time,
              end_time: hallSchedule.end_time,
            };
          }),
        };
      })
      .filter((course) => course !== null); 

    res.status(200).json(mappedCourseDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  handleNewCourse,
  handleRequests,
  approveRequest,
  rejectRequest,
  getClassCount,
  getClassDetails,
};
