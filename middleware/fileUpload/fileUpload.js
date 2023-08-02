const path = require('path');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const googleCloud = new Storage({
  keyFilename: path.join(__dirname, "../../eastern-button-394702-d283b3c44d30.json"),
  projectId: "eastern-button-394702"
});

const fileBucket = googleCloud.bucket('next_tier_file_bucket')

const VerifyExt = (req, file, callback) => {
  if (file.mimetype.split("/")[0] === "image") {
    callback(null, true);
  } else {
    req.fileError = "Invalid file type";
    callback(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: VerifyExt,
  limits: { fileSize : 5 * 1024 * 1024},
});

module.exports = {upload, fileBucket};
