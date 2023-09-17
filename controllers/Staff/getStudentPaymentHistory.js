const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to get course details along with enrolled students
const getStudentPaymentHistory = async (req, res) => {
  // const studentId = req.params.id;
  const studentId = req.params.id;
 

  try {
    const studentPayment = await prisma.users.findUnique({
      where: { id:studentId},

      select: {
      student_purchase_studypack:{
        select:{
          ammount:true,
          purchased_at:true,
          pack:{
            select:{
              title:true,
              tutor:{
                select:{
                  user:{
                    select:{
                      first_name:true,
                      last_name:true,
                      profile_picture:true,
                    }
                  }
                }
              }
              
              
            }
          }
        }
      }
    },
  });

    if (!studentPayment) {
      return res.status(404).json({ error: "Payment history not found" });
    }

    res.status(200).json(studentPayment);
  } catch (error) {
    console.error("Error fetching apyment history details:", error);
    res.status(500).json({ error: "Error fetching payment history details" });
  }
};

module.exports = { getStudentPaymentHistory };
