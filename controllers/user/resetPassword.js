const bcrypt = require("bcrypt");

// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const resetPassword = async (req, res) => {
  const { currentPwd, newPwd, confirmPwd } = req.body;
  const user = req.user;

  //validate inputs
  if (
    !PWD_REGEX.test(currentPwd) ||
    !PWD_REGEX.test(newPwd) ||
    !PWD_REGEX.test(confirmPwd)
  ) {
    return res.status(400).json({ error: "Invalid password pattern" });
  } else if( newPwd !== confirmPwd ) {
    return res.status(400).json({ error: "new password not match" });
  }

  try {
    // find user registered or not
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    console.log(currentPwd, newPwd, confirmPwd)
    if (!foundUser) return res.sendStatus(401); // unauhorized user

    // match password
    const matchPassword = await bcrypt.compare(currentPwd, foundUser.password);
    if(!matchPassword) return res.status(400).json({error: 'current password not valid'});

    const hashedPassword = await bcrypt.hash(newPwd, 10);
    const updatedUser = await prisma.users.update({
        where: {username : user},
        data: {password: hashedPassword}
    })
    res.sendStatus(204)
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {resetPassword}
