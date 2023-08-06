const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = Array.isArray(allowedRoles[0]) ? allowedRoles[0] : allowedRoles;
    console.log(rolesArray);
    console.log(req.roles);

    const result = rolesArray.some(role => req.roles.includes(role));

    if (!result) {
      return res.sendStatus(401);
    }

    next();
  };
};

module.exports = verifyRoles;
