// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uuid = require("uuid").v4;

const registerFormSchema = require("../../validators/admin/register");

const register = async (req, res) => {
  // Validate input form data
  const { error, value } = registerFormSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    fName,
    lName,
    email,
    mobileNo,
    emergencyContact,
    address,
    role,
    qualifications,
  } = value;

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
        roles: { User: 2001, Admin: 5150 },
        password: pwd,
        join_date: joinedTime,
        address: address,
      },
    });

    console.log(addedUser);

    // Add Admin to DB
    const newAdmin = await prisma.admin.create({
      data: {
        user: {
          connect: { id: addedUser.id },
        },
        emergency_No: emergencyContact,
        admin_role: role,
        qualifications: qualifications,
      },
    });

    const adminData = {
      first_name: addedUser.first_name,
      last_name: addedUser.last_name,
      username: addedUser.username,
      phone_number: addedUser.phone_number,
      profile_picture: addedUser.profile_picture,
      address: addedUser.address,
      admin_role: newAdmin.admin_role,
      emergency_No: newAdmin.emergency_No,
      qualifications: newAdmin.qualifications,
    };
    const response = {
      data: adminData,
      success: `New admin ${fName} ${lName} registered`,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error handling new admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();

    // create admin ids array
    const adminIds = admins.map((admin) => admin.admin_id);

    // get user details as well
    const users = await prisma.users.findMany({
      where: {
        id: {
          in: adminIds,
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        phone_number: true,
        address: true,
        profile_picture: true,
      },
    });

    const response = admins.map((admin) => {
      const matchingUser = users.find((user) => user.id === admin.admin_id);
      const { id: userId, admin_id, ...userWithoutIds } = matchingUser;

      const { admin_id: adminId, ...adminWithoutId } = admin;

      return {
        ...adminWithoutId,
        ...userWithoutIds,
      };
    });

    console.log(response);

    res.status(200).send({ data: response });
  } catch (error) {
    console.error("Error handling new admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAdmin = async (req, res) => {
  const user = req.user;
  try {
    const userAdmin = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        username: true,
        address: true,
        phone_number: true,
      },
    });

    console.log(userAdmin);

    const admin = await prisma.admin.findUnique({
      where: {
        admin_id: userAdmin.id,
      },
      select: {
        emergency_No: true,
        admin_role: true,
        qualifications: true,
      },
    });

    console.log(admin);
    const data = { ...userAdmin, ...admin };

    console.log(data);
    if (!admin) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).send({ data });
  } catch (error) {
    console.error("Error handling new admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const edit = async (req, res) => {
  const user = req.user;
  // Validate input form data
  const { error, value } = registerFormSchema.validate(req.body);

  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const {
    fName,
    lName,
    email,
    mobileNo,
    emergencyContact,
    address,
    role,
    qualifications,
  } = value;

  try {
    // Check for duplicate username for updated email
    if (user !== email) {
      const existingUser = await prisma.users.findUnique({
        where: {
          username: email,
        },
      });

      if (!existingUser) {
        return res.status(409).json({ message: "Email is already exists" });
      }
    }

    // Store new user
    const updatedUser = await prisma.users.update({
      where: {
        username: user,
      },
      data: {
        username: email,
        first_name: fName,
        last_name: lName,
        phone_number: mobileNo,
        address: address,
      },
    });

    console.log(updatedUser);

    const updatedAdmin = await prisma.admin.update({
      where: {
        admin_id: updatedUser.id,
      },
      data: {
        emergency_No: emergencyContact,
        admin_role: role,
        qualifications: qualifications,
      },
    });

    const adminData = {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      username: updatedUser.username,
      phone_number: updatedUser.phone_number,
      profile_picture: updatedUser.profile_picture,
      address: updatedUser.address,
      admin_role: updatedAdmin.admin_role,
      emergency_No: updatedAdmin.emergency_No,
      qualifications: updatedAdmin.qualifications,
    };
    const response = {
      data: adminData,
      success: `The admin ${fName} ${lName} updated successfully`,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error handling new admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { register, getAdmins, getAdmin, edit };
