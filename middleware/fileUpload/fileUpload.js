const path = require('path');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const googleCloud = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFile.json"),
  projectId: "eastern-button-394702"
});

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

const fileBucket = googleCloud.bucket("next_tier_file_bucket")

module.exports = {upload, fileBucket, googleCloud};
