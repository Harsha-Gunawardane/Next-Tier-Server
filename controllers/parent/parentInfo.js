// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const parentInfoSchema = require("../../validators/parent/ParentInfoValidator");

const getParentInfo = async (req, res) => {
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

    const guardianInfo = {
      fName: student.emergency_contact?.name,
      address: foundUser.address,
      phoneNo: student.emergency_contact?.phone_number,
    };

    res.json(guardianInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateParentInfo = async (req, res) => {
  const { fName, phoneNo } = req.body;

  const user = req.user;

  // validate info input data
  const { error, data } = parentInfoSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // unauhorized user

    const studentId = foundUser.id;
    const parentInfo = { name: fName, phone_number: phoneNo };

    // update student details
    const updatedStudent = await prisma.students.update({
      where: { student_id: studentId },
      data: {
        emergency_contact: parentInfo,
      },
    });

    // add parent to DB

    const student = await prisma.students.findUnique({
      where: {
        student_id: studentId,
      },
      include: {
        parent: true,
      },
    });

    const joinedTime = new Date();

    if (!student.parent.length) {
      console.log("********************************");
      const fullName = fName.split(" ");
      const parent = await prisma.users.create({
        data: {
          username: phoneNo,
          first_name: fullName[0],
          last_name: fullName[1] ? fullName[1] : "",
          phone_number: phoneNo,
          roles: { User: 2001, Parent: 1924 },
          password: "password",
          join_date: joinedTime,
        },
      });

      const ParentWithChild = await prisma.parent.create({
        data: {
          child: {
            connect: {
              student_id: studentId,
            },
          },
          user: {
            connect: {
              id: parent.id,
            },
          },
        },
      });
    }

    const updatedStudentInfo = req.body;
    res.json(updatedStudentInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getParentInfo, updateParentInfo };
