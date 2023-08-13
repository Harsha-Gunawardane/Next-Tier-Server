// const express = require('express');
// const router = express.Router();
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// // ... (other imports and middleware)

// // Edit complaint endpoint
// // router.put("/staff/complaints/edit/:id", 
// const editComplaint = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { action } = req.body;

//     // Fetch complaint from the database
//     const complaint = await prisma.Complaint.findById(id);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // Update the complaint with the new action
//     complaint.action = action;
//     complaint.status = "RESOLVED"; // Update status to RESOLVED

//     // Save the updated complaint
//     await complaint.save();

//     return res.json(complaint);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Ignore complaint endpoint
// //router.put("/staff/complaints/ignore/:id"
// const ignoreComplaint= async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Fetch complaint from the database
//     const complaint = await prisma.Complaint.findById(id);

//     if (!complaint) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }

//     // Update the complaint status to IGNORED
//     complaint.status = "IGNORED";

//     // Save the updated complaint
//     await complaint.save();

//     return res.json(complaint);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = {ignoreComplaint,editComplaint};
