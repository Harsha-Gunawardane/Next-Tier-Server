const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to get course details along with enrolled students
const getPaymentDetails = async (req, res) => {
  const username = req.params.username;

  

  try {
    const payment = await prisma.users.findUnique({
      where: { username: username },
      select: {
        id:true,
        roles:true,
        first_name: true,
        last_name: true,
        phone_number: true,
        profile_picture: true,
        gender: true,
        join_date: true,
        username: true,
        address: true,
        DOB: true,
        students:{
            select:{
                student_id:true,
              grade:true,
              stream:true,
            }
        },
        student_purchase_studypack: {
          select: {
            id:true,
            payment_for:true,
            status:true,
            ammount: true,
            type: true,
            purchased_at: true,
            expire_date: true,
            pack: {
              select: {
                title: true,
                thumbnail: true,
                price: true,
                course:{
                  select:{
                   title:true,
                  }
                },
                tutor: {
                  select: {
                    qualifications: true,
                    user: {
                      select: {
                        first_name: true,
                        last_name: true,
                        profile_picture: true,
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

    if (!payment) {
        return res.status(404).json({ error: "user not found" });
      }
  
      res.status(200).json(payment);
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Error user course details" });
    }
};

module.exports = { getPaymentDetails};
