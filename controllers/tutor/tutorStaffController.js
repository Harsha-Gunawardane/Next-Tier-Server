const asyncHandler = require("express-async-handler");
// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tutorStaffFormSchema = require("../../validators/tutor/tutorStaffFormValidator");

async function getAllStaffs() {
  try {
    // Use Prisma Client to retrieve all supporting staff
    const allSupportingStaff = await prisma.supporting_staff.findMany({
      include: {
        user: {
          select: {
            first_name: true, // Include the first_name field
            last_name: true, // Include the last_name field
            email: true, // Include the email field
            phone_number: true, // Include the phone_number field
          },
        },
      },
    });

    return allSupportingStaff.map((staff) => ({
      id: staff.staff_id,
      fullName: `${staff.user.first_name} ${staff.user.last_name}`,
      email: staff.user.email,
      phoneNumber: staff.user.phone_number,
    }));
  } catch (error) {
    throw new Error("Error fetching supporting staff: " + error.message);
  }
}

const createNewStaff = async (req, res) => {
  try {
    // Validate input form data
    const { error, value } = tutorStaffFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    const {
      first_name,
      last_name,
      NIC,
      DOB,
      address,
      phone_number,
      email,
      staff_title,
      joined_date,
    } = value;

    // Check for duplicate username
    const existingUser = await prisma.users.findUnique({
      where: {
        email: user,
      },
    });

    if (existingUser) {
      return res.sendStatus(409);
    }

    // Register new user
    const hashedPassword = await bcrypt.hash(pwd, 10); // Encrypt password
    const joinedTime = new Date();

    // Store new user
    const addedUser = await prisma.users.create({
      data: {
        username: user,
        first_name: fName,
        last_name: lName,
        phone_number: phoneNo,
        roles: { User: 2001, Student: 1942 },
        password: hashedPassword,
        join_date: joinedTime,
      },
    });

    console.log(addedUser);

    // Add student to DB
    const addedStudent = await prisma.students.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        grade: "",
        stream: "",
        emergency_contact: {},
        school: "",
      },
    });

    console.log(addedStudent);

    res.status(201).json({ success: `New user ${user} registered` });
  } catch (error) {
    console.error("Error handling new user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateStaff = asyncHandler(async (req, res) => {
  const {
    find_first_name,
    find_last_name,
    update_first_name,
    update_last_name,
  } = req.body;

  if (
    !find_first_name ||
    !find_last_name ||
    !update_first_name ||
    !update_last_name
  ) {
    return res.status(400).json({ message: "Some arguments are missing" });
  }
  try {
    // find Staff registered or not
    const foundStaff = await prisma.staffs.findFirst({
      where: {
        first_name: find_first_name,
        last_name: find_last_name,
      },
    });

    if (!foundStaff) {
      return res.status(400).json({
        message: `Staff ${find_first_name} ${find_last_name} not found`,
      });
    }
    const updatedStaff = await prisma.users.update({
      where: {
        first_name: find_first_name,
        last_name: find_last_name,
      },
      data: {
        first_name: update_first_name,
        last_name: update_last_name,
      },
    });

    res.json(updatedStaff);
  } catch (error) {
    throw error;
  }
});

const deleteStaff = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // find user registered or not
    const foundStaff = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundStaff) {
      return res
        .status(400)
        .json({ message: `Staff ${req.params.first_name} not found` });
    }

    const deleteStaff = await prisma.users.delete({
      where: { id: id },
    });

    res.json({
      message: `Staff ${req.params.foundStaff.first_name} deleted`,
    });
  } catch (error) {
    throw error;
  }
});

const getStaff = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // find user registered or not
    const foundStaff = await prisma.users.findFirst({
      where: {
        id: id,
      },
    });
    if (!foundStaff) {
      return res
        .status(400)
        .json({ message: `Staff ${req.params.first_name} not found` });
    }
    res.json(foundStaff);
  } catch (error) {
    throw error;
  }
});

module.exports = {
  getAllStaffs,
  createNewStaff,
  updateStaff,
  deleteStaff,
  getStaff,
};
