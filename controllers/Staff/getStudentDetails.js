const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Route to get course details along with enrolled students
const getStudentDetails = async (req, res) => {
    const studentId = req.params.id;
  
    try {
      const course = await prisma.users.findUnique({
        where: { id: studentId },
        select: {
           first_name:true,
           last_name:true,
           phone_number:true,
           profile_picture:true,
           gender:true,
           join_date:true,
           username:true,
           address:true,
           DOB:true,
           students:{
            select:{
                student_id:true,
                stream:true,
                school:true,
                grade:true,
                medium:true,
                subjects:true,
                emergency_contact:true,
            }
           },
           student_enrolled_course: {
             select: {
              enrolled_at:true,
               course: {
                 select: {
                  id:true,
                   title: true,
                   subject: true,
                   description: true,
                   monthly_fee: true,
                   thumbnail: true,
                   start_date: true,
                 }
               }
             }
           }
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

  module.exports = {getStudentDetails};