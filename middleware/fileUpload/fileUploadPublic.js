const path = require('path');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const FILE_TYPE_VIDEO = require('../../config/allowedFilesVideo')

const googleCloud = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFilePublic.json"),
  projectId: "fluted-clock-395620"
});

const fileBucket = googleCloud.bucket('next_tier_bucket')
const videoRawBucket = googleCloud.bucket('hls-streaming-gcp-raw-files-fluted-clock-395620')

const VerifyExt = (req, file, callback) => {
  // console.log('req', req)
  if (FILE_TYPE_VIDEO.includes(file.mimetype.split("/")[0])) {
    callback(null, true);
  } else {
    req.fileError = "Invalid file type";
    callback(null, false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: VerifyExt,
});

const multi_upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})


module.exports = {
  upload,
  multi_upload,
  fileBucket,
  googleCloud,
  videoRawBucket

};
