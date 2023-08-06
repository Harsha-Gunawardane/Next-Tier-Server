const resetPasswordSchema = require("../../validators/resetPasswordValidator");
const bcrypt = require("bcrypt");
const moment = require("moment-timezone");
require("dotenv").config();
const { Vonage } = require("@vonage/server-sdk");

// Import ORM to handle the database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const resetPassword = async (req, res) => {
  try {
    const { user, pwd, confirmPwd } = req.body;
    const { error, data } = resetPasswordSchema.validate({
      user,
      pwd,
      confirmPwd,
    });

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    const foundUser = await prisma.users.findUnique({
        where: { username: user }
    })

    if(!foundUser) return res.sendStatus(401);
    
    // Check if the OTP is expired or not
    const verifyData = await prisma.reset_password.findUnique({
      where: { username: user },
    });

    if (!verifyData || !verifyData.otp_verified) {
      return res.sendStatus(402); // Custom error code for not verified
    }

    // Delete reset password verification
    await prisma.reset_password.delete({
      where: { username: user },
    });

    // Update password
    const hashedPassword = await bcrypt.hash(pwd, 10); // Hashed password
    const updatedUser = await prisma.users.update({
      where: { username: user },
      data: { password: hashedPassword },
    });

    res.status(201).json({ message: "Reset password successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (req, res) => {
  const { user } = req.body;

  try {
    // Find user who has the OTP
    const foundUser = await prisma.users.findUnique({
      where: { username: user },
    });

    if (!foundUser) {
      return res.sendStatus(401);
    }

    const otp = `${Math.floor(Math.random() * 10000)}`;

    const filledOTP = otp.padStart(4, "0");

    console.log(filledOTP);
    // const hashedOTP = await bcrypt.hash(filledOTP, 10);
    const hashedOTP = filledOTP;

    // Send SMS to user
    const vonage = new Vonage({
      apiKey: process.env.VONAGE_API_KEY,
      apiSecret: process.env.VONAGE_API_SECRET,
    });

    const from = "Next-Tier";
    const to = foundUser.phone_number;
    const text = `Verification code: ${filledOTP}`;

    async function sendSMS() {
      await vonage.sms
        .send({ to, from, text })
        .then((resp) => {
          console.log("Message sent successfully");
          console.log(resp);
        })
        .catch((err) => {
          console.log("There was an error sending the messages.");
          console.log(err);
        });
    }

    // sendSMS();

    // Update database
    const created_at = moment().tz("Asia/Colombo").toDate();
    const otpExpirationTime = moment()
      .add(2, "minutes")
      .tz("Asia/Colombo")
      .toDate();

    await prisma.reset_password.create({
      data: {
        username: user,
        otp_verified: false,
        created_at,
      },
    });

    const updatedUser = await prisma.users.update({
      where: { username: foundUser.username },
      data: { otp: hashedOTP, otp_expire_at: otpExpirationTime },
    });

    const userPhoneNo = updatedUser.phone_number;

    res.json({ userPhoneNo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { otp, user } = req.body;
    console.log(otp);

    // Find user who has the OTP
    const foundUser = await prisma.users.findUnique({
      where: { username: user },
    });

    if (!foundUser) {
      return res.sendStatus(401); // User not found
    }

    const verifiedData = await prisma.reset_password.findUnique({
      where: { username: user },
    });

    if (!foundUser.otp || !foundUser.otp_expire_at || !verifiedData) {
      return res.sendStatus(402); // OTP not found or expired
    }

    const currentDateTime = moment();
    const otpExpirationTime = moment(foundUser.otp_expire_at);

    if (currentDateTime.isAfter(otpExpirationTime)) {
      return res.sendStatus(406); // OTP expired
    }

    const matchedOtp = otp === foundUser.otp;
    // const matchedOtp = await bcrypt.compare(otp, foundUser.otp)

    if (!matchedOtp) {
      return res.sendStatus(420); // Invalid OTP
    }

    // Verify user
    await prisma.users.update({
      where: { username: foundUser.username },
      data: { otp: null, otp_expire_at: null },
    });

    await prisma.reset_password.update({
      where: { username: user },
      data: { otp_verified: true },
    });

    res.status(200).json({ message: "User is verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { resetPassword, sendOTP, verifyOTP };
