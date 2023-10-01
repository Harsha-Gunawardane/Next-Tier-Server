// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const moment = require("moment");


const getUserInfo = async (req, res) => {
    console.log(req.user)
    const user = req.user;

    try {

        // find user registered or not
        const foundUser = await prisma.users.findUnique({
            where: {
                username: user,
            },
        });

        if (!foundUser) return res.sendStatus(401); // unauhorized user


        const userInfo = {
            fName: foundUser.first_name,
            lName: foundUser.last_name,
            userRole: foundUser.roles,
            profile_picture: foundUser.profile_picture
        }
        res.json(userInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getUserInfo }