
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");


const getAllPolls = async (req, res) => {
  const user = req.user;
  const courseId = req.params.courseId;
  try {

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const userId = foundUser.id;



    const poll = await prisma.poll.findMany({
      // select:{user_id:true},
      where: {
        course_id: courseId,
      },
    });

    res.json({ userId: userId, poll });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const getPoll = async (req, res) => {
  const user = req.user;
  const pollId = req.params.pollId; // Assuming you pass the poll ID as a route parameter

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }


    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    res.json(poll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};







const updateVoteCount = async (req, res) => {
  const user = req.user;
  const pollId = req.params.pollId;
  const option = req.params.option;
  const userId = req.user.id;

  try {
    // Check if the user exists (you can customize this check as needed)
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const userId = foundUser.id;
    // Fetch the poll by pollId
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if the provided option exists in the poll's options
    if (!poll.options.includes(option)) {
      return res.status(400).json({ message: 'Option not found in the poll' });
    }

    // Update the vote count for the specified option
    const updatedVotes = { ...poll.votes };
    updatedVotes[option] += 1;

    // Append the user ID to the user_id array
    const updatedUserIds = [...poll.user_id, userId];

    // Update the poll with the new vote counts and the updated user_id array
    const updatedPoll = await prisma.poll.update({
      where: {
        id: pollId,
      },
      data: {
        votes: updatedVotes,
        user_id: updatedUserIds,
      },
    });

    return res.status(200).json(updatedPoll);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {

  getAllPolls,
  getPoll,
updateVoteCount
}