// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content

  const refreshToken = cookies.jwt;

  try {
    const foundUser = await prisma.users.findFirst({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
      return res.sendStatus(204); // success with no content
    }

    // delete refresh token from database
    const updatedUser = await prisma.users.update({
      where: { username: foundUser.username },
      data: {
        refresh_token: null,
      },
    });

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
    res.sendStatus(204); // success without content
  } catch (error) {
    throw error;
  }
};

module.exports = { handleLogout };
