//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const getAllStudyPacks = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = user.id;

    const studypack = await prisma.study_pack.findMany({
      where: {
        tutor_id: tutorId,
      },
    });

    console.log(studypack);
    res.json(studypack);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


const createStudyPack = async (req, res) => {
  const user = req.user;
  const {course_id,title, description, subject, price,thumbnail,subject_areas,access_period,type} = req.body;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // create course
    const tutorId = foundUser.id;

    const newStudypack = await prisma.study_pack.create({
      data: {
        tutor_id: tutorId,
        course_id,
        title,
        description,
        subject,
        price:parseInt(price),
        thumbnail,
        subject_areas,
        type,
        access_period,
        
        
      },
    });

    res.json(newStudypack);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
};



const getStudypackById = async (req, res) => {
  const studypackId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id; // Assuming the tutor's ID is available in req.user

  try {
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
        tutorId: tutorId, // Add the condition to filter by tutorId
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(studypack);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};





const editStudypack = async (req, res) => {
  const studypackId = req.params.id; 
  const user = req.user; 
  const { title, description, subject, price,thumbnail,course_id,content_ids } = req.body;

  try {
  
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Study pack not found' });
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
    const updatedStudyPack = await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: {
        title,
        description,
        subject,
        thumbnail,
        course_id,
        content_ids,
        price: parseInt(price),
      },
    });

    res.json(updatedStudyPack);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};






const removeStudypack = async (req, res) => {
  const studypackId = req.params.id; 

  try {
    // Check if the course exists before deleting
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const user = req.user;
    const tutorId = studypack.tutor_id; // Use `studypack` instead of `course`

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser || foundUser.id !== tutorId) {
      return res.status(401).json({ message: 'Unauthorized to remove this course' });
    }

    await prisma.study_pack.delete({
      where: {
        id: studypackId,
      },
    });

    res.json({ message: 'Course removed successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const getCourses = async (req, res) => {
  const studypackId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id; // Assuming the tutor's ID is available in req.user

  try {
    const courses = await prisma.course.findMany({
      where: {
        tutorId: tutorId, // Filter the courses by tutorId (i.e., the currently logged-in user)
      },
      select: {
        id: true, // Select the 'id' field of the courses
        title: true, // Select the 'title' field of the courses
      },
    });

    if (!courses || courses.length === 0) {
      return res.status(404).json({ message: 'No courses found' });
    }

    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};






const editContent_ids = async (req, res) => {
  const courseId = req.params.id;
  const user = req.user;
  const { studypack_ids: newStudypackIds, name } = req.body;

  try {
    const course = await prisma.study_pack.findUnique({
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

    // Retrieve the existing content_ids
    const existingContentIds = course.content_ids || [];

    // Construct the new week object
    const newWeek = {
      [name]: {
        tute_id: [], // Add tute_ids if any
        video_id: [], // Add video_ids if any
      },
    };

    // Merge the newWeek with the existing content_ids
    const updatedContentIds = [...existingContentIds, newWeek];

    // If everything checks out, update the course
    const updatedCourse = await prisma.study_pack.update({
      where: {
        id: courseId,
      },
      data: {
        content_ids: updatedContentIds,
      },
    });

    res.json(updatedCourse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};







const removeContent = async (req, res) => {
  const studypackId = req.params.id;
  const weekToDelete = req.params.week;

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

    // Remove the specified week from content_ids
    const contentIdsWithoutDeletedWeek = studypack.content_ids.filter(item => !item[weekToDelete]);

    await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: {
        content_ids: contentIdsWithoutDeletedWeek,
      },
    });

    res.json({ message: `Content for ${weekToDelete} removed successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};






const removeIds = async (req, res) => {
  const studypackId = req.params.id;
  const partToDelete = req.params.part;
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

    // Create a new array with the updated content_ids
    const updatedContentIds = studypack.content_ids.map((content) => {
      const key = Object.keys(content)[0];

      if (key === partToDelete) {
        const updatedTuteIds = content[key].tute_id.filter(id => id !== contentIdToRemove);
        const updatedVideoIds = content[key].video_id.filter(id => id !== contentIdToRemove);
        const updatedQuizIds = content[key].quiz_id.filter(id => id !== contentIdToRemove);

        return {
          [key]: {
            tute_id: updatedTuteIds,
            video_id: updatedVideoIds,
            quiz_id: updatedQuizIds,
          },
        };
      }

      return content;
    });

    await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: {
        content_ids: updatedContentIds,
      },
    });

    res.json({ message: `Content with ID ${contentIdToRemove} removed from ${partToDelete} successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};














module.exports = { 
  createStudyPack,
  getAllStudyPacks,
getStudypackById,
editStudypack,
removeStudypack,
getCourses,
editContent_ids,
removeContent,
removeIds }