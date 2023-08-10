const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  console.log('in verifyJWT')
  const authHeader = req.headers.authorization || req.headers.Authorization;

  // Check authorization
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  console.log('auth header');
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decoded) => {
    console.log(err)
    if (err) return res.sendStatus(403);

    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    next();
  });
};
module.exports = verifyJWT;
