const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} Promise that resolves when user is logged in
 */

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "USername and password are required" });

  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

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
  
      // const updatedUser = await updateRefreshToken(user, refreshToken);
      const updatedUser = await prisma.users.update({
        where: { username: user },
        data: { refresh_token: {push: refreshToken} },
      });
  
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin };
