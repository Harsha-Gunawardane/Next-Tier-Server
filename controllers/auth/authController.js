const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();
const fsPromises = require("fs").promises;
const path = require("path");

// work on database
const { findUser, updateRefreshToken } = require("../../models/users");

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "USername and password are required" });

  // find user registered or not
  const foundUser = await findUser(user);
  if (!foundUser) return res.sendStatus(401); // unauhorized user

  // match password
  const matchPassword = await bcrypt.compare(pwd, foundUser.password);

  if (matchPassword) {
    const roles = Object.values(JSON.parse(foundUser.roles));
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET_KEY,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET_KEY,
      { expiresIn: "1d" }
    );

    const updatedUser = await updateRefreshToken(user, refreshToken);

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
