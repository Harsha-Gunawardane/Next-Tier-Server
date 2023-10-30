const path = require('path');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const FILE_TYPE = require('../../config/allowedFileTypes')

const googleCloud = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFile.json"),
  projectId: "eastern-button-394702"
});

const fileBucket = googleCloud.bucket('next_tier_bucket')
const publicFileBucket = googleCloud.bucket('next_tier_public')

const VerifyExt = (req, file, callback) => {
  // console.log('req', req)
  if (FILE_TYPE.includes(file.mimetype.split("/")[0])) {
    callback(null, true);
  } else {
    req.fileError = "Invalid file type";
    callback(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: VerifyExt,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const multi_upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})


module.exports = { upload, multi_upload, fileBucket, googleCloud,publicFileBucket };
