const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const tutorStaffFormSchema = require("../../validators/tutor/tutorStaffFormValidator");

const getAllStaffs = asyncHandler(async (req, res) => {
  try {
    // Use Prisma Client to retrieve all supporting staff
    const allSupportingStaffs = await prisma.supporting_staff.findMany({
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
            profile_picture: true,
          },
        },
      },
    });

    if (!allSupportingStaffs) return res.sendStatus(401);

    const formattedSupportingStaffs = allSupportingStaffs.map((staff) => ({
      id: staff.user.id,
      first_name: staff.user.first_name,
      last_name: staff.user.last_name,
      email: staff.user.email,
      phone_number: staff.user.phone_number,
      profile_picture: staff.user.profile_picture,
      staff_title: staff.staff_title,
    }));

    res.status(201).json(formattedSupportingStaffs);
  } catch (error) {
    throw new Error("Error fetching supporting staff: " + error.message);
  }
});


const createNewStaff = asyncHandler(async (req, res) => {

  const user = req.user;
  console.log(user);
  try {
    // Validate input form data
    const { error, value } = tutorStaffFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    //Destructuring
    const {
      first_name,
      last_name,
      NIC,
      DOB,
      address,
      phone_number,
      email,
      staff_title,
    } = value;

    // Check for duplicate username
    const existingUser = await prisma.users.findUnique({
      where: {
        username: email,
      },
    });

    if (existingUser) {
      return res.sendStatus(409);
    }

    // Register new user
    const pwd = "Testing@123";
    const hashedPassword = await bcrypt.hash(pwd, 10); // Encrypt password
    const joinedTime = new Date();

    if(staff_title === "Admin"){

    // Store new user
    const addedUser = await prisma.users.create({
      data: {
        username: email,
        first_name: first_name,
        last_name: last_name,
        NIC: NIC,
        DOB: DOB,
        address: address,
        email:email,
        phone_number: phone_number,
        roles: { User: 2001, TutorStaff: 5566 },
        password: hashedPassword,
        join_date: joinedTime,
      },
    });

    console.log(addedUser);

    // Add supporting_staff to DB
    const addedSupportingStaff = await prisma.supporting_staff.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        staff_title: staff_title,
      },
    });

    console.log(addedSupportingStaff);

    const foundTutor = await prisma.users.findFirst({
      where: {
        username : user
      },
      select: {
        id: true
      }
    })

    // Add staffOnTutor to DB
    const addedStaffOnTutor = await prisma.staffOnTutor.create({
      data: {
        staff: {
          connect: { staff_id: addedSupportingStaff.staff_id },
        },
        tutor: {
          connect: { tutor_id: foundTutor.id },
        },
        no_marked_papers: 0,
      },
    });

    console.log(addedStaffOnTutor);

    res.status(201).json({ success: `New staff added` });

  } catch (error) {
    console.error("Error handling new user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const updateStaff = asyncHandler(async (req, res) => {
  
  const id = req.params.id;

  try {

    // Validate input form data
    const { error, value } = tutorStaffFormSchema.validate(req.body);

    if (error) {
      console.log(error);
      return res.status(400).json({ error: error.details[0].message });
    }

    //Destructuring
    const {
      first_name,
      last_name,
      NIC,
      DOB,
      address,
      phone_number,
      email,
      staff_title,
    } = value;

    // find Staff registered or not
    const foundStaff = await prisma.users.findFirst({
      where: {
        id:id
      },
    });

    if (!foundStaff) {
      return res.status(400).json({
        message: `Staff ${first_name} ${last_name} not found`,
      });
    }

    const updatedData = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      DOB: DOB,
      address: address,
      email:email,
      NIC: NIC,
    };

    const updatedStaff = await prisma.users.update({
      where: {
        id: id,
      },
      data: updatedData,
    });

    const updatedSupportingStaff = await prisma.supporting_staff.update({
      where: {
        staff_id: id,
      },
      data: {
        staff_title: staff_title,
      },
    });

    res.json(updatedStaff);
  } catch (error) {
    throw error;
  }
});

const deleteStaff = asyncHandler(async (req, res) => {

  const id = req.params.id;

  try {
    // find user registered or not
    const foundStaff = await prisma.users.findUnique({
      where: {
        id: id,
      },
    });
    if (!foundStaff) {
      return res
        .status(400)
        .json({ message: `Staff not found` });
    }

    const deleteStaff = await prisma.users.delete({
      where: { id: id },
    });

    res.json({
      message: `Staff deleted`,
    });
  } catch (error) {
    throw error;
  }
});

const getStaff = asyncHandler(async (req, res) => {
  
  const id = req.params.id;

  try {
    const supportingStaff = await prisma.users.findUnique({
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
        supporting_staff: {
          select: {
            staff_title: true,
          },
        },
      },
    });

    const formattedSupportingStaff = {
      id: supportingStaff.id,
      first_name: supportingStaff.first_name,
      last_name: supportingStaff.last_name,
      email: supportingStaff.email,
      address: supportingStaff.address,
      NIC: supportingStaff.NIC,
      DOB: supportingStaff.DOB,
      phone_number: supportingStaff.phone_number,
      profile_picture: supportingStaff.profile_picture,
      staff_title: supportingStaff.supporting_staff[0].staff_title,
    };

    if (!formattedSupportingStaff) {
      return res
        .status(400)
        .json({ message: `Staff ${req.params.first_name} not found` });
    }

    res.json(formattedSupportingStaff);

  } catch (error) {
       throw new Error("Error fetching supporting staff: " + error.message);

  }
});

module.exports = {
  getAllStaffs,
  createNewStaff,
  updateStaff,
  deleteStaff,
  getStaff,
};
