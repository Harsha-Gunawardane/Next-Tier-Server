const jwt = require("jsonwebtoken");
require("dotenv").config();

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * 
 * @param {Object} req - the request object
 * @param {Object} res - the response object
 * @returns {Promise<void>} - the promise resolved when complete refreshed the access token
 * @throws {Error} - if processing fails
 */
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await prisma.users.findFirst({
      where: {
        refresh_token: {
          hasSome: refreshToken,
        },
      },
    });
    if (!foundUser) return res.sendStatus(403); // forbidden

    // evaluate access token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (err, decoded) => {
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403); // forbidden

        const roles = Object.values(JSON.parse(foundUser.roles));

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET_KEY,
          { expiresIn: "30s" }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    // res.status(500).json({ message: error.message });
    throw error;
  }
};

module.exports = { handleRefreshToken };
