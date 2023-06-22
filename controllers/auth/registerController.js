const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

// work on database
const { createNewUser, findUser } = require("../../models/users");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;

  // check if required data is present
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  try {
    // check duplicates username
    const duplicate = await findUser(user);
    if (duplicate) return res.sendStatus(409);

    // register new user

    // encrypt password
    const hashedPassword = await bcrypt.hash(pwd, 10);

    // store new user
    const newUser = {
      username: user,
      roles: { User: 2001 },
      password: hashedPassword,
    };

    const addedUser = await createNewUser(newUser);
    console.log(addedUser);

    res.status(201).json({ success: `New user ${user} registered` });
  } catch (error) {
    res.sendStatus(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
