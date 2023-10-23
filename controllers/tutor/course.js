//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

// const courseregisterFormSchema = require("../../validators/courseregisterValidator");

const getAllCourses = async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = foundUser.id;

    const courses = await prisma.courses.findMany({
      where: {
        tutor_id: tutorId,
      },
      // Include the count of courses

    });

    // Get the length of the courses array

    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



const getCourseById = async (req, res) => {
  const courseId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id; // Assuming the tutor's ID is available in req.user
  const user = req.user;
  try {

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = foundUser.id;

    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
        tutor_id: tutorId, // Add the condition to filter by tutorId
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const createCourse = async (req, res) => {

  console.log("here")
  // const { error, data } = courseregisterFormSchema.validate(req.body);

  // if (error) {
  //   console.log (error);
  //   return res.status(400).json({ error: error.details[0].message });
  // }


  const user = req.user;
  const { title, description, subject, medium, grade, thumbnail, monthly_fee, schedule, start_date } = req.body;



  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // create course
    const tutorId = foundUser.id;

    const newCourse = await prisma.courses.create({
      data: {
        tutor_id: tutorId,
        title,
        description,
        subject,
        medium,
        grade,
        thumbnail,
        start_date,
        monthly_fee,
        visibility: 'PRIVATE',
        content_ids: [
          {
            tute_id: [],
            video_id: [],
          }
        ],
        schedule: [
          schedule
        ]
      },
    });
    console.log(newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};




const removeCourse = async (req, res) => {
  const courseId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)

  try {
    // Check if the course exists before deleting


    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }


    const user = req.user;
    const tutorId = course.tutor_id;

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to remove this course' });
    }


    await prisma.courses.delete({
      where: {
        id: courseId,
      },
    });

    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};





const editCourse = async (req, res) => {
  const courseId = req.params.id;
  const user = req.user;
  const { title, description, medium, thumbnail, monthly_fee, schedule, studypack_ids, content_ids, visibility, announcements } = req.body;

  try {

    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    const tutorId = foundUser.id;

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to edit this course' });
    }


    // If everything checks out, update the course
    const updatedCourse = await prisma.courses.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        description,

        thumbnail,
        medium,
        visibility,

        schedule,
        studypack_ids,
        content_ids,
        announcements,
        monthly_fee: parseInt(monthly_fee),
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};





const editStudypack_ids = async (req, res) => {
  const courseId = req.params.id;
  const user = req.user;
  const { studypack_ids: newStudypackIds } = req.body;

  try {
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401);

    const tutorId = foundUser.id;

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to edit this course' });
    }

    // Retrieve the existing studypack_ids
    const existingStudypackIds = course.studypack_ids || [];

    // Merge the newStudypackIds with the existing ones
    const updatedStudypackIds = [...existingStudypackIds, ...newStudypackIds];

    // If everything checks out, update the course
    const updatedCourse = await prisma.courses.update({
      where: {
        id: courseId,
      },
      data: {
        studypack_ids: updatedStudypackIds,
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




// Assuming your route configuration is as follows:
// router.route("/course/:id/:studypacid").delete(verifyRoles(ROLES_LIST.Tutor), courseController.removeStudyPack);

const removeStudyPack = async (req, res) => {
  const courseId = req.params.id;
  const studypackId = req.params.studypackId;

  try {
    // Check if the course exists before proceeding
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the user is authorized to perform the action
    const user = req.user;
    const tutorId = course.tutor_id;

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to remove content from this course' });
    }

    // Remove the specified study pack ID from the course's studypack_ids array
    const updatedStudyPackIds = course.studypack_ids.filter(id => id !== studypackId);

    await prisma.courses.update({
      where: {
        id: courseId,
      },
      data: {
        studypack_ids: updatedStudyPackIds,
      },
    });

    // Delete the specified study pack from the studypack table
    await prisma.study_pack.delete({
      where: {
        id: studypackId,
      },
    });

    res.json({ message: `Study pack ID ${studypackId} removed successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



const removeIds = async (req, res) => {
  const courseId = req.params.id;
  const studypackId = req.params.studypackId;
  const contentIdToRemove = req.params.contentId;

  try {
    // Check if the study pack exists before deleting
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Study pack not found' });
    }

    const user = req.user;
    const tutorId = studypack.tutor_id;

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to remove content from this study pack' });
    }

    // Filter out the content ID to remove from the content_ids array
    const updatedContentIds = studypack.content_ids.filter(id => id !== contentIdToRemove);

    await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: {
        content_ids: updatedContentIds,
      },
    });

    res.json({ message: `Content with ID ${contentIdToRemove} removed from content_ids successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};







const addIds = async (req, res) => {
  const courseId = req.params.id;
  const studypackId = req.params.studypackId;
  const week = req.params.week;
  const contentIdToRemove = req.params.contentId;

  try {
    // Check if the study pack exists before updating
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Study pack not found' });
    }

    const user = req.user;
    const tutorId = studypack.tutor_id;

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to update content in this study pack' });
    }

    // Find the index of the specified week in the content_ids array
    const weekIndex = studypack.content_ids.findIndex((content) => content.title === week);

    if (weekIndex !== -1) {
      const weekContent = studypack.content_ids[weekIndex][week];

      // Update tute_id and video_id arrays for the specified week
      const updatedTuteIds = weekContent.tute_id.filter(id => id !== contentIdToRemove);
      const updatedVideoIds = weekContent.video_id.filter(id => id !== contentIdToRemove);

      // Add the new contentId to the appropriate array
      if (req.body.type === 'TUTE') {
        updatedTuteIds.push(contentIdToRemove);
      } else if (req.body.type === 'VIDEO') {
        updatedVideoIds.push(contentIdToRemove);
      }

      // Update the content_ids array with the modified week content
      studypack.content_ids[weekIndex] = {
        title: week, // "title" property added
        tute_id: updatedTuteIds,
        video_id: updatedVideoIds,
      };

      // Update the study pack with the modified content_ids
      await prisma.study_pack.update({
        where: {
          id: studypackId,
        },
        data: {
          content_ids: studypack.content_ids,
        },
      });

      res.json({ message: `Content with ID ${contentIdToRemove} updated successfully for week ${week}` });
    } else {
      res.status(404).json({ message: `Week ${week} not found in content_ids` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};






const removePublicIds = async (req, res) => {
  const courseId = req.params.id;
  const contentIdToRemove = req.params.contentId;

  try {
    // Check if the study pack exists before deleting
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = req.user;
    const tutorId = course.tutor_id;

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to remove content from this course' });
    }

    // Filter out the content entry with the specified video_id or tute_id
    const updatedContentIds = course.content_ids.map(content => {
      if (content.video_id.includes(contentIdToRemove) || content.tute_id.includes(contentIdToRemove)) {
        return {
          tute_id: [],
          video_id: [],
        };
      }
      return content;
    });

    await prisma.courses.update({
      where: {
        id: courseId,
      },
      data: {
        content_ids: {
          set: updatedContentIds,
        },
      },
    });

    res.json({ message: `Content with ID ${contentIdToRemove} removed from course successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};







const createPoll = async (req, res) => {
  const user = req.user;
  const { course_id, question, options } = req.body;

  try {
    // Check if the user exists (you can customize this check as needed)
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // Split options only if it's a string
    let optionsArray = options;
    if (typeof options === 'string') {
      optionsArray = options.split(',').map(option => option.trim());
    }

    // Initialize the votes object with all options set to 0
    const initialVotes = {};
    optionsArray.forEach(option => {
      initialVotes[option] = 0;
    });

    // Create a new poll
    const newPoll = await prisma.poll.create({
      data: {
        course_id,
        question,
        options: optionsArray,
        votes: initialVotes,
        // hell,
        // Initialize votes with all counts set to 0
      },
    });

    res.status(201).json(newPoll);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};







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

    const tutorId = foundUser.id;
    console.log(tutorId);


    const poll = await prisma.poll.findMany({
      where: {
        course_id: courseId,
      },
    });

    res.json(poll);
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

    const tutorId = foundUser.id;

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



const deletePoll = async (req, res) => {
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

    const tutorId = foundUser.id;

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },
    });

    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if the logged-in user is the owner of the poll
    // if (poll.ownerId !== tutorId) {
    //   return res.status(403).json({ message: 'Access denied. You are not the owner of this poll.' });
    // }

    // Delete the poll
    await prisma.poll.delete({
      where: {
        id: pollId,
      },
    });

    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const updateVoteCount = async (req, res) => {
  const user = req.user;
  const pollId = req.params.pollId;
  const option = req.params.option;

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

    // Update the poll with the new vote counts
    const updatedPoll = await prisma.poll.update({
      where: {
        id: pollId,
      },
      data: {
        votes: updatedVotes,
      },
    });

    return res.status(200).json(updatedPoll);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};





const getPapers = async (req, res) => {
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

    const tutorId = foundUser.id;
    console.log(tutorId);


    const poll = await prisma.papers.findMany({
      where: {
        course_id: courseId,
      },
    });

    res.json(poll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



const getPapersbyId = async (req, res) => {
  const user = req.user;
  const paperId = req.params.paperId;
  try {

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = foundUser.id;
    console.log(tutorId);


    const poll = await prisma.papers.findUnique({
      where: {
        paper_id: paperId,
      },
    });

    res.json(poll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createCourse,
  getAllCourses,
  removeCourse,
  editCourse,
  getCourseById,
  editStudypack_ids,
  removeStudyPack,
  removeIds,
  addIds,
  removePublicIds,
  createPoll,
  getAllPolls,
  getPoll,
  deletePoll, updateVoteCount, getPapers, getPapersbyId
}