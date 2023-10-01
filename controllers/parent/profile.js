// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const parentProfileSchema = require("../../validators/parent/profile");

const getProfile = async (req, res) => {
  const user = req.user;

  try {
    const parent = await prisma.users.findUnique({
      where: {
        username: user,
      },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone_number: true,
        address: true,
        profile_picture: true,
      },
    });

    if (parent) {
      res.send(parent);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const edit = async (req, res) => {
  const user = req.user;
  // Validate input form data
  const { error, value } = parentProfileSchema.validate(req.body);

  console.log(req.body)
  if (error) {
    console.log(error);
    return res.status(400).json({ error: error.details[0].message });
  }

  const { fName, lName, email, mobileNo, address } = value;

  try {
    // Check for duplicate username for updated email
    if (user !== email) {
      const existingUser = await prisma.users.findUnique({
        where: {
          username: email,
        },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email is already exists" });
      }
    }

    // Store new user
    const updatedUser = await prisma.users.update({
      where: {
        username: user,
      },
      data: {
        email: email,
        first_name: fName,
        last_name: lName,
        phone_number: mobileNo,
        address: address,
      },
    });

    console.log(updatedUser);

    const parentData = {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone_number: updatedUser.phone_number,
      profile_picture: updatedUser.profile_picture,
      address: updatedUser.address,
    };
    const response = {
      data: parentData,
      success: `Parent ${fName} ${lName} updated successfully`,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getProfile, edit };
