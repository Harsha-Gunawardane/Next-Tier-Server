const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to get course details along with enrolled students
const getCourseDetails = async (req, res) => {
  const courseId = req.params.id;

  try {
    const course = await prisma.courses.findUnique({
      where: { id: courseId },
      select: {
        title: true,
        subject: true,
        description: true,
        monthly_fee: true,
        thumbnail: true,
        start_date: true,
        student_enrolled_course: {
          select: {
            enrolled_at:true,
            student: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                join_date: true,
                profile_picture: true,
                gender: true,
                students: {
                  select: {
                    stream: true,
                  },
                },
              },
            },
          },
        },
      study_pack: {
        select: {
          id: true,
          title: true,
          student_purchase_studypack: {
            select: {
              student_id: true,
              reciept_location: true,
              ammount: true,
              type: true,
              purchased_at: true,
              status:true,
              payment_for:true,
              expire_date: true,
              student: {
                select: {
                  id: true,
                  first_name: true,
                  last_name: true,
                  join_date: true,
                  profile_picture: true,
                  gender: true,
                  students: {
                    select: {
                      stream: true,
                    },
                  },
                },
              },
            },
          },
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

module.exports = { getCourseDetails };
