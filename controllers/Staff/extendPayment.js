const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Route to update a payment to PAID and type to PHYSICAL
const extendPyament = async (req, res) => {
  const transactionId = req.params.id;

  try {
    const updatedPayment = await prisma.student_purchase_studypack.update({
      where: { id:transactionId },
      data: {
        status: "PAID",
        type: "PHYSICAL",
      },
    });

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ error: "Error updating payment" });
  }
};

module.exports = {extendPyament };
