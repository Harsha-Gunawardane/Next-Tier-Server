const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to get course details along with enrolled students
const getCourseDetails = async (req, res) => {
    const courseId = req.params.id;
  
    try {
      const course = await prisma.courses.findUnique({
        where: { id: courseId },
        select: {
            title:true,
            subject:true,
            description:true,
            monthly_fee:true,
          student_enrolled_course: {
            select: {
              student:{
                select:{
                    id:true,
                  first_name:true,
                  last_name:true,
                  join_date:true,
                 profile_picture:true,
                }
              }
            },
          },
        },
      });
  
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }
  
      res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course details:", error);
      res.status(500).json({ error: "Error fetching course details" });
    }
  };

  module.exports = {getCourseDetails};