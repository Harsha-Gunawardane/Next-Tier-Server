// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { sendNotification } = require("../notificationController");

const getAllFeedbacks = async (req, res) => {
  try {
    const allFeedbacks = await prisma.complaints.findMany({
      where: {
        type: "OTHER",
      },
    });

    const updatedFeedbacks = await Promise.all(
      allFeedbacks.map(async (feedback) => {
        const user = await prisma.users.findUnique({
          where: {
            id: feedback.user_id,
          },
          select: {
            roles: true,
            first_name: true,
            last_name: true,
          },
        });

        feedback = {
          ...feedback,
          name: `${user.first_name} ${user.last_name}`,
        };

        if ("Student" in user.roles) {
          feedback = { ...feedback, role: "Student" };
        } else if ("Tutor" in user.roles) {
          feedback = { ...feedback, role: "Tutor" };
        } else if ("Staff" in user.roles) {
          feedback = { ...feedback, role: "Staff" };
        } else if ("Admin" in user.roles) {
          feedback = { ...feedback, role: "Admin" };
        }

        return feedback;
      })
    );

    res.status(201).json(updatedFeedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFeedback = async (req, res) => {
  const { id, owner_id } = req.query;
  const user = req.user;

  try {
    const authorizedUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        roles: true,
        id: true,
      },
    });

    if (
      authorizedUser &&
      (authorizedUser.id === owner_id || "Admin" in authorizedUser.roles)
    ) {
      const deletedFeedback = await prisma.complaints.delete({
        where: { id: id },
      });

      res.sendStatus(204);
    } else {
      return res.status(401).json({
        message: "You do not have permission",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActionOnFeedback = async (req, res) => {
  const { id } = req.query;
  const user = req.user;

  try {
    const authorizedUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        roles: true,
      },
    });

    if (authorizedUser && "Admin" in authorizedUser.roles) {
      const updatedFeedback = await prisma.complaints.update({
        where: { id: id },
        data: {
          status: "IN_ACTION",
        },
      });

      res.sendStatus(204);
    } else {
      return res.status(401).json({
        message: "You do not have permission",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fixedIssue = async (req, res) => {
  const { id, owner_id, message } = req.body;
  const user = req.user;

  try {
    if (!id || !owner_id || !message) {
      return res.status(400).json({ message: "Missing required data." });
    }

    const userData = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
      },
    });

    const isSent = await sendNotification(message, userData.id, owner_id);

    if (isSent) {
      console.log(isSent);
    } else {
      console.log("not sent notification")
    }
    const deletedFeedback = await prisma.complaints.delete({
      where: { id: id },
    });

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFeedbacks,
  removeFeedback,
  getActionOnFeedback,
  fixedIssue,
};
