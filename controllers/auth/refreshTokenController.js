  
  const jwt = require("jsonwebtoken");
  require("dotenv").config();
  
  // work on database
  const { findUserWithRefreshToken } = require("../../models/users");
  
  const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
  
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;
  
    // check if there is a user which contains the refresh token
    const foundUser = await findUserWithRefreshToken(refreshToken);
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
  };
  
  module.exports = { handleRefreshToken };
  