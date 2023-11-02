// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getChildInfo = async (req, res) => {
  const username = req.user;
  try {
    const parentUser = await prisma.users.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });

    const parent = await prisma.parent.findUnique({
      where: {
        id: parentUser.id,
      },
      include: {
        child: true,
      },
    });

    const student = await prisma.users.findUnique({
      where: {
        id: parent.child.student_id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });

    const noOfCousres = await prisma.student_enrolled_course.count({
      where: {
        student_id: student.id,
      },
    });

    const data = {
      fullName: student.first_name + " " + student.last_name,
      noOfCousres: noOfCousres,
    };

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getChildInfo };
