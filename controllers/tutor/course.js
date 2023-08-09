//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");

const courseregisterFormSchema = require("../../validators/courseregisterValidator");


const getAllCourses = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Not logged in' });
    }

    const tutorId = user.id;

    const courses = await prisma.courses.findMany({
      where: {
        tutor_id: tutorId,
      },
    });

    console.log(courses);
    res.json(courses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const getCourseById = async (req, res) => {
  const courseId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id; // Assuming the tutor's ID is available in req.user

  try {
    const course = await prisma.courses.findUnique({
      where: {
        id: courseId,
        tutorId: tutorId, // Add the condition to filter by tutorId
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


  // const { error, data } = courseregisterFormSchema.validate(req.body);

  // if (error) {
  //   console.log (error);
  //   return res.status(400).json({ error: error.details[0].message });
  // }


  const user = req.user;
  const {title, description, subject, medium, grade,thumbnail, monthly_fee,schedule,start_date } = req.body;
  
console.log(req.body);
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
        monthly_fee: parseInt(monthly_fee),
        schedule,
    
      },
    });

    res.json(newCourse);
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
  const { title, description, subject, medium, grade,thumbnail, monthly_fee,schedule,studypack_ids } = req.body;

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
        subject,
        thumbnail,
        medium,
        grade,
        schedule,
        studypack_ids,
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





const removeStudyPack = async (req, res) => {
  const courseId = req.params.id;
  const weekToDelete = req.params.week;

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
      return res.status(401).json({ message: 'Unauthorized to remove content from this study pack' });
    }

    // Remove the specified week from content_ids
    const contentIdsWithoutDeletedWeek = course.studypack_ids.filter(item => !item[weekToDelete]);

    await prisma.courses.update({
      where: {
        id: courseId,
      },
      data: {
        studypack_ids: contentIdsWithoutDeletedWeek,
      },
    });

    res.json({ message: `Content for ${weekToDelete} removed successfully` });
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
removeStudyPack }