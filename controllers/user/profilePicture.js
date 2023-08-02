// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadProfilePicture = async (req, res) => {
    console.log(req.fileError)
  if (req.fileError) return res.status(400).json({ message: req.fileError });
  if (req.fileValidationError) {
    res.status(400).json({ error: req.fileValidationError });
  }
  const user = req.user;
  const profilePic = req.file;

  let date = new Date();
  date = date.toISOString();

  try {
    const foundUser = await prisma.users.findUnique({
      where: {
        username: user,
      },
    });

    // insert new file to DB
    const newProfileData = {
      name: profilePic.filename,
      path: profilePic.path,
      uploaded_at: date,
      mime_type: profilePic.mimetype,
      uploaded_by: foundUser.id,
      original_name: profilePic.originalname,
    };

    // console.log(newProfileData)
    const newImageFile = await prisma.files.create({
      data: newProfileData,
    });

    // update user profile
    updatedUser = await prisma.users.update({
      where: {
        username: user,
      },
      data: {
        profile_picture: newImageFile.path,
      },
    });

    res.status(201).json({ message: "Upload profile picture" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadProfilePicture };
