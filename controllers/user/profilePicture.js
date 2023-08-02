// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require("uuid").v4;

const { fileBucket } = require("../../middleware/fileUpload/fileUpload");

const uploadProfilePicture = async (req, res) => {
  // check file got error in middleware
  if (req.fileError) return res.status(400).json({ message: req.fileError });

  const user = req.user;
  const profilePic = req.file;

  let date = new Date();
  date = date.toISOString();

  const newImageFileName = `${uuid()}-${date}-${profilePic.originalname}`;
  const blob = fileBucket.file(newImageFileName);
  const blobStream = await blob.createWriteStream({
    resumable: false,
    gzip: true
  });

  blobStream.on("error", (error) => {
    console.error(error);
    return res.status(500).json({ message: error.message });
  });

  blobStream.on("finish", async () => {
    console.log("Uploading profile picture");

    try {
      const foundUser = await prisma.users.findUnique({
        where: {
          username: user,
        },
      });

      const imageUrl = `https://storage.googleapis.com/${process.env.GCS_FILEBUCKET}/${blob.name}`;

      // insert new file to DB
      const newProfileData = {
        name: newImageFileName,
        path: imageUrl,
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

      res.status(201).json({ image: imageUrl });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

};

module.exports = { uploadProfilePicture };
