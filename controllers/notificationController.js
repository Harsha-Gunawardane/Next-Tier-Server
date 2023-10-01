// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendNotification = async (message, sender_id, reciver_id) => {
  try {
    const newNotification = await prisma.notifications.create({
      data: {
        message: message,
        reciver_id: reciver_id,
        sender_id: sender_id,
      },
    });

    return newNotification;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendNotification };
