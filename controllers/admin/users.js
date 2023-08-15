// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uuid = require("uuid").v4;

const registerFormSchema = require("../../validators/staff/register");

const MAX_LIMIT = 2;

const register = async (req, res) => {
  const {
    fName,
    lName,
    email,
    mobileNo,
    emergencyContact,
    address,
    qualifications,
  } = req.body;

  // Validate input form data
  const { error, value } = registerFormSchema.validate({
    fName,
    lName,
    email,
    mobileNo,
    address,
  });

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
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
    const pwd = uuid();
    const joinedTime = new Date();

    // Store new user
    const addedUser = await prisma.users.create({
      data: {
        username: email,
        first_name: fName,
        last_name: lName,
        phone_number: mobileNo,
        roles: { User: 2001, Staff: 1984 },
        password: pwd,
        join_date: joinedTime,
        address: address,
      },
    });

    console.log(addedUser);

    // Add Admin to DB
    const newInstituteStaff = await prisma.institute_staff.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        emergency_No: emergencyContact,
        qualifications: qualifications,
      },
    });

    res
      .status(201)
      .json({ success: `New institute staff ${fName} ${lName} registered` });
  } catch (error) {
    console.error("Error handling new admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const formatRole = (role) => {
  switch (role) {
    case "Student":
      return "{ User: 2001, Student: 1942 }";
    case "Tutor":
      return "{ User: 2001, Tutor: 1932 }";
    case "Staff":
      return "{ User: 2001, Staff: 1984 }";
    case "Admin":
      return "{ User: 2001, Admin: 5150 }";
    case "Parent":
      return "{ User: 2001, Parent: 1924 }";

    default:
      return;
  }
};

const getUsers = async (req, res) => {
  const { term, role, query } = req.query;
  console.log(req.query);
  try {
    let usersQuery = {
      take: MAX_LIMIT,
      select: {
        username: true,
        first_name: true,
        last_name: true,
        last_name: true,
        roles: true,
        active: true,
        verified: true,
        profile_picture: true,
      },
      skip: term * MAX_LIMIT,
    };
    if (query) {
      usersQuery.where = {
        OR: [
          {
            first_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            username: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      };
    }
    // if (role && usersQuery.where) {
    //   usersQuery.where.roles = {
    //     some: {
    //       roles: role,
    //     },
    //   };
    // } else if (role) {
    //   usersQuery.where = {
    //     roles: {
    //       some: {
    //         roles: role,
    //       },
    //     },
    //   };
    // }

    console.log(usersQuery);
    const users = await prisma.users.findMany(usersQuery);

    console.log(users);
    res.status(200).json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const activeUser = async (req, res) => {
  const { username } = req.params;
  const { state } = req.body;

  try {
    let user = null;
    if (username) {
      user = await prisma.users.findUnique({
        where: { username: username },
      });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    updatedUser = await prisma.users.update({
      where: { username: username },
      data: {
        active: state,
      },
    });

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, getUsers, activeUser };
