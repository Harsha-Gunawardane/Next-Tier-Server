//import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();



const getAllStudyPacks = async (req, res) => {
  const user = req.user;
  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // create course
    const tutorId = foundUser.id;
   

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
  const {
    course_id,
    title,
    description,
    subject,
    price,
    thumbnail,
    subject_areas,
    access_period,
    type,
  } = req.body;

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // Calculate the expiration date based on the access_period if it's provided and valid
    let expirationDate;

    if (access_period && access_period.days) {
      const currentDate = new Date();
      expirationDate = new Date(currentDate);
      expirationDate.setDate(currentDate.getDate() + access_period.days);
    } else {
      // Set a default expiration of 30 days if access_period is not provided or invalid
      const currentDate = new Date();
      expirationDate = new Date(currentDate);
      expirationDate.setMonth(expirationDate.getMonth() + 1);
      expirationDate.setDate(0); // Set to the last day of the current month
    }

    // Calculate the end of the month for the expiration date
  

    // create course
    const tutorId = foundUser.id;

    const newStudypack = await prisma.study_pack.create({
      data: {
        tutor_id: tutorId,
        course_id,
        title,
        description,
        subject,
        price: parseInt(price),
        thumbnail,
        subject_areas,
        type,
        access_period,
        // start_date: null, // No start_date provided
        expire_date: expirationDate, // Set the expire_date in DateTime format
      },
    });

    res.json(newStudypack);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};











const getStudypackById = async (req, res) => {
  const studypackId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const tutorId = req.user.id;
  const user = req.user;  // Assuming the tutor's ID is available in req.user

  try {

    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // create course
    const tutorId = foundUser.id;

    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
        tutor_id: tutorId, // Add the condition to filter by tutorId
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











const transformData = (originalData) => {
  const transformedData = { ...originalData };

  // Transform subject_areas to an array if it's not already
  if (!Array.isArray(transformedData.subject_areas)) {
    transformedData.subject_areas = [transformedData.subject_areas];
  }

  // Transform access_period to the desired structure
  // transformedData.access_period = {
  //   days: transformedData.access_period.days - 2, // Subtract 2 from days
  //   years: transformedData.access_period.years,
  //   months: transformedData.access_period.months,
  // };

  // Transform content_ids to the desired structure
  transformedData.content_ids = transformedData.content_ids.map((content) => {
    const { title, ...contentData } = content;
    return {
      [title]: {
        ...contentData,
        quiz_id: contentData.quiz_id.length > 0 ? contentData.quiz_id : [' '],
        tute_id: contentData.tute_id.length > 0 ? contentData.tute_id : [' '],
        video_id: contentData.video_id.length > 0 ? contentData.video_id : [' '],
         // Ensure at least one space in quiz_id
      },
    };
  });

  return transformedData;
};

const getWeekStudypackById = async (req, res) => {
  const studypackId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
  const user = req.user; // Assuming the tutor's ID is available in req.user

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401);

    // Create course
    const tutorId = foundUser.id;

    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
        tutor_id: tutorId, // Add the condition to filter by tutorId
      },
    });

    if (!studypack) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Transform the data
    const transformedStudypack = transformData(studypack);

    res.json(transformedStudypack);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};









// const getWeekStudypackById = async (req, res) => {
//   const studypackId = req.params.id; // Assuming the course ID is passed as a URL parameter (e.g., /courses/:id)
//   const tutorId = req.user.id;
//   const user = req.user;  // Assuming the tutor's ID is available in req.user

//   try {
//     const foundUser = await prisma.users.findUnique({
//       where: {
//         username: user,
//       },
//     });
//     if (!foundUser) return res.sendStatus(401);

//     // Create course
//     const tutorId = foundUser.id;

//     const studypack = await prisma.study_pack.findUnique({
//       where: {
//         id: studypackId,
//         tutor_id: tutorId, // Add the condition to filter by tutorId
//       },
//     });

//     if (!studypack) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     // Transform the content_ids object into the desired format
//     const transformedContentIds = [];

//     for (let i = 1; i <= 4; i++) {
//       const weekKey = `week${i}`;
//       const weekData = {
//         [weekKey]: {
//           tute_id: studypack.content_ids[weekKey]?.tute_id || [],
//           video_id: studypack.content_ids[weekKey]?.video_id || [],
//           quiz_id: studypack.content_ids[weekKey]?.quiz_id || [],
//         },
//       };
//       transformedContentIds.push(weekData);
//     }

//     // Replace the original content_ids with the transformed one
//     studypack.content_ids = transformedContentIds;

//     res.json(studypack);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error.message });
//   }
// };





const editStudypack = async (req, res) => {
  // Extract data from the request body
  const studypackId = req.params.id;
  const user = req.user;
  const {
    title,
    description,
    subject,
    price,
    thumbnail,
    course_id,
    content_ids,
    public_ids,
    visibility,
    expire_date,
  } = req.body;

  try {
    // Find the study pack by ID
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    // Check if the study pack exists
    if (!studypack) {
      return res.status(404).json({ message: 'Study pack not found' });
    }

    // Find the user by username
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // Define the data to update, starting with the fields that are always updated
    let updatedData = {
      title,
      description,
      subject,
      thumbnail,
      course_id,
      content_ids,
      public_ids,
      visibility,
      price: parseInt(price),
    };

    // Check if expire_date is provided in the request body
    if (expire_date) {
      // Parse the provided expire_date
      const newExpireDate = new Date(expire_date);
      const currentDate = new Date();

      // Check if newExpireDate is a valid date
      if (isNaN(newExpireDate)) {
        return res.status(400).json({ message: 'Invalid expire_date format' });
      }

      // Calculate the difference in years and months
      const yearsDiff = newExpireDate.getFullYear() - currentDate.getFullYear();
      const monthsDiff = newExpireDate.getMonth() - currentDate.getMonth();

      // Calculate the total number of months based on years and months difference
      const totalMonths = yearsDiff * 12 + monthsDiff;

      // Calculate the total number of days based on days difference
      const daysDiff = Math.floor((newExpireDate - currentDate) / (24 * 60 * 60 * 1000));

      // Update the data with the calculated values
      updatedData = {
        ...updatedData,
        expire_date: newExpireDate,
        access_period: {
          years: yearsDiff,
          months: totalMonths,
          days: daysDiff,
        },
      };
    }

    // Update the study pack in the database
    const updatedStudyPack = await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: updatedData,
    });

    // Send the updated study pack as the response
    res.json(updatedStudyPack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




const editWeekStudypack = async (req, res) => {
  // Extract data from the request body
  const studypackId = req.params.id;
  const user = req.user;
  const {
    title,
    description,
    subject,
    price,
    thumbnail,
    course_id,
    content_ids,
    public_ids,
    visibility,
    expire_date,
  } = req.body;

  try {
    // Find the study pack by ID
    const studypack = await prisma.study_pack.findUnique({
      where: {
        id: studypackId,
      },
    });

    // Check if the study pack exists
    if (!studypack) {
      return res.status(404).json({ message: 'Study pack not found' });
    }

    // Find the user by username
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });
    if (!foundUser) return res.sendStatus(401);

    // Transform content_ids to the desired format
    const transformedContentIds = content_ids.map((content, index) => {
      const weekTitle = `week${index + 1}`;
      return {
        title: weekTitle,
        quiz_id: content[weekTitle].quiz_id, // Use the quiz_id from the inner object
        tute_id: content[weekTitle].tute_id,
        video_id: content[weekTitle].video_id,
      };
    });

    // Define the data to update, starting with the fields that are always updated
    let updatedData = {
      title,
      description,
      subject,
      thumbnail,
      course_id,
      content_ids: transformedContentIds, // Use the transformed array
      public_ids,
      visibility,
      price: parseInt(price),
    };

    // Check if expire_date is provided in the request body
    if (expire_date) {
      // Parse the provided expire_date
      const newExpireDate = new Date(expire_date);
      const currentDate = new Date();

      // Check if newExpireDate is a valid date
      if (isNaN(newExpireDate)) {
        return res.status(400).json({ message: 'Invalid expire_date format' });
      }

      // Calculate the difference in years and months
      const yearsDiff = newExpireDate.getFullYear() - currentDate.getFullYear();
      const monthsDiff = newExpireDate.getMonth() - currentDate.getMonth();

      // Calculate the total number of months based on years and months difference
      const totalMonths = yearsDiff * 12 + monthsDiff;

      // Calculate the total number of days based on days difference
      const daysDiff = Math.floor((newExpireDate - currentDate) / (24 * 60 * 60 * 1000));

      // Update the data with the calculated values
      updatedData = {
        ...updatedData,
        expire_date: newExpireDate,
        access_period: {
          years: yearsDiff,
          months: totalMonths,
          days: daysDiff,
        },
      };
    }

    // Update the study pack in the database
    const updatedStudyPack = await prisma.study_pack.update({
      where: {
        id: studypackId,
      },
      data: updatedData,
    });

    // Send the updated study pack as the response
    res.json(updatedStudyPack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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
        video_id: [], 
        quiz_id: [],// Add video_ids if any
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

    // Find the content with the specified "title" in the content_ids array
    const updatedContentIds = studypack.content_ids.map((content) => {
      if (content.title === partToDelete) {
        // Filter out the contentIdToRemove from quiz_id, tute_id, and video_id arrays
        const updatedQuizIds = content.quiz_id.filter(id => id !== contentIdToRemove);
        const updatedTuteIds = content.tute_id.filter(id => id !== contentIdToRemove);
        const updatedVideoIds = content.video_id.filter(id => id !== contentIdToRemove);

        return {
          title: content.title,
          quiz_id: updatedQuizIds,
          tute_id: updatedTuteIds,
          video_id: updatedVideoIds,
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





const removecoursepackIds = async (req, res) => {
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
getWeekStudypackById,
editStudypack,
removeStudypack,
getCourses,
editContent_ids,
removeContent,
removeIds,editWeekStudypack,removecoursepackIds }