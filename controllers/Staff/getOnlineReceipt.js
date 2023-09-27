const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to get a specific staff's profile
const getOnlineReceipt = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const onlineReceipt = await prisma.student_purchase_studypack.findUnique({
      where: { id: transactionId },
      select: {
        ammount: true,
        purchased_at: true,
        expire_date: true,
        id: true,
        payment_for: true,
        pack: {
          select: {
            title: true,
            price: true,
            expire_date:true,
            course:{
              select:{
                title:true,
              }
            },
            tutor:{
              select:{
                qualifications:true,
                user:{
                  select:{
                    first_name:true,
                    last_name:true,
                    phone_number:true,
                  }
                }
              }
            }
          },
        },
        student: {
          select: {
            first_name: true,
            last_name: true,
            phone_number:true,
            students: {
              select: {
                stream: true,
              },
            },
          },
        },
      },
    });

    console.log("Fetched receipt details Profile:", onlineReceipt);

    if (!onlineReceipt) {
      return res.status(404).json({ error: "Payment receipt not found" });
    }

    res.status(200).json(onlineReceipt);
  } catch (error) {
    console.error("Error fetching payment receipt:", error);
    res.status(500).json({ error: "Error fetching payment receipt" });
  }
};

module.exports = { getOnlineReceipt };
