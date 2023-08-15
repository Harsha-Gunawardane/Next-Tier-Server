const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// import login form validator
const loginFormSchema = require("../../validators/loginFormValidator");

/**
 *
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} Promise that resolves when user is logged in
 */

const handleLogin = async (req, res) => {
  // validate input form data
  const { error, data } = loginFormSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { user, pwd } = req.body;

  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    if (!foundUser) return res.sendStatus(401); // unauhorized user

    // check account is verified ot not
    if (!foundUser.verified)
      return res.status(410).json({ message: "User not verified" }); // 410 is custom error code for not verified user

    // match password
    const matchPassword = await bcrypt.compare(pwd, foundUser.password);

    if (matchPassword) {
      const roles = Object.values(foundUser.roles);
      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "5d" }
      );
      const refreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "1d" }
      );

      // const updatedUser = await updateRefreshToken(user, refreshToken);
      const updatedUser = await prisma.users.update({
        where: { username: user },
        data: { refresh_token: refreshToken },
      });

      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleLogin };
