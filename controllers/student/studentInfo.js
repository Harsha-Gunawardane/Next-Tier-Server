const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

const personalInfoSchema = require("../../validators/student/personalInfoValidator");
const NIC_REGEX = /^(?:\d{9}[Vv]|\d{11}(?![Vv]))$/;

const getStudentInfo = async (req, res) => {
  const user = req.user;

  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // unauhorized user

    // get student details
    const student = await prisma.students.findUnique({
      where: { student_id: foundUser.id },
    });

    if (!student) return res.sendStatus(401); // unauhorized student

    const studentInfo = {
      fName: foundUser.first_name,
      lName: foundUser.last_name,
      address: foundUser.address,
      dob: foundUser.DOB,
      phoneNo: foundUser.phone_number,
      stream: student.stream,
      college: student.school,
      medium: student.medium,
      profile: foundUser.profile_picture,
    };

    res.json(studentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllStudentsInfo = asyncHandler(async (req, res) => {
  try {
    // Use Prisma Client to retrieve all supporting student
    const allStudents = await prisma.students.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            profile_picture: true,
          },
        },
      },
    });

    if (!allStudents) return res.sendStatus(401);

    const formattedStudents = allStudents.map((student) => ({
      id: student.user.id,
      first_name: student.user.first_name,
      last_name: student.user.last_name,
      email: student.user.email,
      profile_picture: student.user.profile_picture,
    }));

    res.status(201).json(formattedStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const updateStudentInfo = async (req, res) => {
  const { fName, lName, phoneNo, stream, college, medium, dob, address, nic } =
    req.body;

  const user = req.user;

  // validate info input data
  const { error, data } = personalInfoSchema.validate({
    fName,
    lName,
    phoneNo,
    stream,
    medium,
    college,
    address,
  });

  if (nic) {
    if (!NIC_REGEX.test(nic)) {
      return res.status(400).json({ error: "Invalid NIC" });
    }
  }

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const parseDob = dob ? moment(dob, "YYYY-MM-DD").toDate() : null;
  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // unauhorized user

    // update user details after checking differences
    if (
      foundUser.first_name !== fName ||
      foundUser.last_name !== lName ||
      foundUser.DOB !== dob ||
      foundUser.address !== address ||
      foundUser.phoneNo !== phoneNo ||
      foundUser.NIC !== nic
    ) {
      const updatedData = {
        first_name: fName,
        last_name: lName,
        phone_number: phoneNo,
        DOB: parseDob,
        address: address,
        NIC: nic,
      };

      const updatedUser = await prisma.users.update({
        where: { username: user },
        data: updatedData,
      });
    }

    const studentId = foundUser.id;

    // update student details
    const updatedStudent = await prisma.students.update({
      where: { student_id: studentId },
      data: {
        stream: stream,
        medium: medium,
        school: college,
      },
    });
    const updatedStudentInfo = req.body;
    res.json(updatedStudentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStudentMarks = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  const paperId = req.params.paperId;

  // console.log(req.body);

  const { subject, marks, weak_areas } = req.body;

  try {
    const foundStudent = await prisma.students.findFirst({
      where: {
        student_id: studentId,
      },
    });

    if (!foundStudent) {
      return res.status(400).json({
        message: `Student not found`,
      });
    }

    const foundPaper = await prisma.papers.findFirst({
      where: {
        paper_id: paperId,
      },
    });

    if (!foundPaper) {
      return res.status(400).json({
        message: `Paper not found`,
      });
    }

    //Update the weak_areas in students model
    const updatedStudent = await prisma.students.update({
      where: {
        student_id: studentId,
      },
      data: {
        weak_areas: {
          subject: subject,
          area: weak_areas,
        },
      },
    });

    const foundStudentMarks = await prisma.student_marks.findFirst({
      where: {
        student_id: studentId,
        paper_id: paperId,
      },
    });

    if (foundStudentMarks) {
      const updatedStudentMarks = await prisma.student_marks.update({
        where: {
          student_id_paper_id: {
            student_id: studentId,
            paper_id: paperId,
          },
        },
        data: {
          marks: Number(marks),
        },
      });

      res.status(201).json(updatedStudentMarks);
    } else {
      const addedStudentMarks = await prisma.student_marks.create({
        data: {
          student_id: studentId,
          paper_id: paperId,
          course_id: null,
          marks: Number(marks),
        },
      });

      res.status(201).json(addedStudentMarks);
    }

    // console.log("Added marks:", updatedStudentMarks, updatedStudent);
  } catch (error) {
    console.error("Error handling add student marks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const getStudentMarksDetails = asyncHandler(async (req, res) => {
  const paperId = req.params.paperId;

  try {
    const studentsWithMarksForPaper = await prisma.students.findMany({
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            profile_picture: true,
          },
        },
        student_marks: {
          where: {
            paper_id: paperId,
          },
          select: {
            marks: true,
          },
        },
      },
    });

    console.log(studentsWithMarksForPaper);

    if (!studentsWithMarksForPaper) return res.sendStatus(401);

    const formattedStudnetMarksDetails = studentsWithMarksForPaper.map(
      (studentMarkDetail) => ({
        id: studentMarkDetail.student_id,
        first_name: studentMarkDetail.user.first_name,
        last_name: studentMarkDetail.user.last_name,
        profile_picture: studentMarkDetail.user.profile_picture,
        weak_areas: studentMarkDetail.weak_areas.area,
        marks: studentMarkDetail.student_marks.map((mark) => mark.marks),
      })
    );

    res.status(201).json(formattedStudnetMarksDetails);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching supporting staff: " + error.message);
  }
});

const getStudent = asyncHandler(async (req, res) => {
  const id = req.params.id;

  try {
    const student = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        address: true,
        NIC: true,
        DOB: true,
        phone_number: true,
        profile_picture: true,
      },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: `Staff ${req.params.first_name} not found` });
    }

    res.json(student);
  } catch (error) {
    throw new Error("Error fetching supporting staff: " + error.message);
  }
});

const getStudentAttendance = asyncHandler(async (req, res) => {
  try {
    const studentAttendances = await prisma.students.findMany({
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            profile_picture: true,
          },
        },
        student_attendance: {
          select: {
            is_present: true,
          },
        },
      },
    });

    if (!studentAttendances) {
      return res.status(400).json({ message: `Student attendance not found` });
    }

    const formattedStudnetAttendance = studentAttendances.map(
      (studentAttendance) => ({
        id: studentAttendance.student_id,
        first_name: studentAttendance.user.first_name,
        last_name: studentAttendance.user.last_name,
        profile_picture: studentAttendance.user.profile_picture,
        status: studentAttendance.student_attendance.map(
          (attendance) => attendance.is_present
        ),
      })
    );

    res.json(formattedStudnetAttendance);
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching supporting staff: " + error.message);
  }
});

const addStudentAttendance = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;

  console.log("Here")
  console.log(req.body);

  const { is_present, date } = req.body;

  try {
    const foundStudent = await prisma.students.findFirst({
      where: {
        student_id: studentId,
      },
    });

    if (!foundStudent) {
      return res.status(400).json({
        message: `Student not found`,
      });
    }

    const foundStudentAttendance = await prisma.student_attendance.findFirst({
      where: {
        student_id: studentId,
        course_id: "0f1f0bbc-9c80-4fc0-a955-440de26c3e25",
      },
    });

    if (foundStudentAttendance) {
      const updatedStudentAttendance = await prisma.student_attendance.update({
        where: {
            student_id: studentId,
            course_id: "0f1f0bbc-9c80-4fc0-a955-440de26c3e25",
        },
        data: {
          is_present: is_present,
        },
      });

      res.status(201).json(updatedStudentAttendance);
    } else {
      const addStudentAttendance = await prisma.student_attendance.create({
        data: {
          student_id: studentId,
          course_id: "0f1f0bbc-9c80-4fc0-a955-440de26c3e25",
          date: date,
          is_present: is_present,
        },
      });

      res.status(201).json(addStudentAttendance);
    }

    

  } catch (error) {
    console.error("Error handling add student attendance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  updateStudentInfo,
  getStudentInfo,
  getStudent,
  getAllStudentsInfo,
  updateStudentMarks,
  getStudentMarksDetails,
  getStudentAttendance,
  addStudentAttendance,
};
