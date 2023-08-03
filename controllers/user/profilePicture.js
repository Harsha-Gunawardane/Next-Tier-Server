// import ORM to handle Database
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const uuid = require("uuid").v4;

const {
  fileBucket,
  googleCloud,
} = require("../../middleware/fileUpload/fileUpload");

const uploadProfilePicture = async (req, res) => {
  // check file got an error in middleware
  if (req.fileError) return res.status(400).json({ message: req.fileError });

  const user = req.user;
  const profilePic = req.file;

  if(!profilePic) return res.status(400).json({ message: "Something went wrong" })

  let date = new Date();
  date = date.toISOString();

  const newImageFileName = `${uuid()}-${date}-${profilePic.originalname}`;

  try {
    const blob = fileBucket.file(newImageFileName);
    const blobStream = blob.createWriteStream();

    blobStream.on("finish", async () => {
      // update DB
      const foundUser = await prisma.users.findUnique({
        where: {
          username: user,
        },
      });

      const imageUrl = `https://storage.googleapis.com/next_tier_file_bucket/${newImageFileName}`;

      // insert new file to DB
      const newProfileData = {
        name: newImageFileName,
        path: imageUrl,
        uploaded_at: date,
        mime_type: profilePic.mimetype,
        uploaded_by: foundUser.id,
        original_name: profilePic.originalname,
      };

      const newImageFile = await prisma.files.create({
        data: newProfileData,
      });

      const authenticatedUrl = await googleCloud
        .bucket("next_tier_file_bucket")
        .file(newImageFileName)
        .getSignedUrl({
          action: "read",
          expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        });

      // update user profile
      updatedUser = await prisma.users.update({
        where: {
          username: user,
        },
        data: {
          profile_picture: authenticatedUrl[0],
        },
      });

      res.status(201).json({ profile: authenticatedUrl[0] });
    });

    blobStream.end(profilePic.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadProfilePicture };
