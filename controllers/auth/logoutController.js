const fsPromises = require("fs").promises;
const path = require("path");

// work on database
const {
  findUserWithRefreshToken,
  deleteRefreshToken,
} = require("../../models/users");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // no content

  const refreshToken = cookies.jwt;

  const foundUser = await findUserWithRefreshToken(refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
    return res.sendStatus(204); // success with no content
  }

  // delete refresh token from database
  const deletedRefreshToken = await deleteRefreshToken(foundUser.username);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None" });
  res.sendStatus(204); // success without content
};

module.exports = { handleLogout };
