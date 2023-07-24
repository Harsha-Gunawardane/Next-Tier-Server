// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");

const personalInfoSchema = require("../../validators/student/personalInfoValidator");
const NIC_REGEX = /^(?:\d{9}[Vv]|\d{11}(?![Vv]))$/

const getStudentInfo = async (req, res) => {
  const user = req.user

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
      where: {student_id: foundUser.id}
    })

    if (!student) return res.sendStatus(401); // unauhorized student

    const studentInfo = {
      fName: foundUser.first_name,
      lName: foundUser.last_name,
      address: foundUser.address,
      dob: foundUser.DOB,
      phoneNo: foundUser.phone_number,
      stream: student.stream,
      college: student.school,
      medium: student.medium
    }

    res.json(studentInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

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

  if(nic) {
    if(!NIC_REGEX.test(nic)){
      return res.status(400).json({error: 'Invalid NIC'})
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
            NIC: nic
        }

        const updatedUser = await prisma.users.update({
            where: { username: user },
            data: updatedData
        })
    }

    const studentId = foundUser.id;

    // update student details
    const updatedStudent = await prisma.students.update({
        where: { student_id: studentId },
        data: {
            stream: stream,
            medium: medium,
            school: college
        }
    })
    const updatedStudentInfo = req.body;
    res.json(updatedStudentInfo)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
};

module.exports = {updateStudentInfo, getStudentInfo}