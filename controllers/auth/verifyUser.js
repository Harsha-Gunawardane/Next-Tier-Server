const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
require("dotenv").config();
const { Vonage } = require("@vonage/server-sdk");
const moment = require("moment-timezone");

const verifyOTP = async (req, res) => {
  try {
    const { otp, user } = req.body;
    console.log(otp);

    // Find user who has the OTP
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.sendStatus(401); // User not found
    }

    if (foundUser.verified) {
      return res.sendStatus(411); // User already verified
    }

    if (!foundUser.otp || !foundUser.otp_expire_at) {
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

    console.log(matchedOtp);

    // Verify user
    const updatedUser = await prisma.users.update({
      where: { username: foundUser.username },
      data: { otp: null, otp_expire_at: null, verified: true },
    });

    res.status(200).json({ message: "User is verified" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (req, res) => {
  const { user } = req.body;

  try {
    // find user who has the otp
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401);

    // handle already verified users
    if (foundUser.verified) {
      return res.sendStatus(411);
    }

    const otp = `${Math.floor(Math.random() * 10000 - 1)}`;

    const zerosToAdd = 4 - otp.length;
    const filledOTP = "0".repeat(zerosToAdd) + otp;

    console.log(filledOTP);
    // const hashedOTP = await bcrypt.hash(filledOTP, 10);
    const hashedOTP = filledOTP;

    const otpExpirationTime = moment()
      .add(2, "minutes")
      .tz("Asia/Colombo")
      .toDate();

    // send SMS to user
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

    // update DB
    const updatedUser = await prisma.users.update({
      where: { username: foundUser.username },
      data: { otp: hashedOTP, otp_expire_at: otpExpirationTime },
    });

    const userPhoneNo = updatedUser.phone_number;

    res.json({ userPhoneNo });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

module.exports = { verifyOTP, sendOTP };
