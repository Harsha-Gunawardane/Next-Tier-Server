const path = require('path');
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const FILE_TYPE_VIDEO = require('../../config/allowedFilesVideo')
const FILE_TYPE = require('../../config/allowedFileTypes')

const googleCloud = new Storage({
  keyFilename: path.join(__dirname, "../../gcsKeyFilePublic.json"),
  projectId: "fluted-clock-395620"
});

const fileBucket = googleCloud.bucket('next_tier_bucket')
const videoRawBucket = googleCloud.bucket('hls-streaming-gcp-raw-files-fluted-clock-395620')
const publicBucket = googleCloud.bucket('next_tier_public')

const VerifyExtVideo = (req, file, callback) => {
  console.log("file", file)
  if (FILE_TYPE_VIDEO.includes(file.mimetype.split("/")[0])) {
    callback(null, true);
  } else {
    req.fileError = "Invalid file type";
    callback(null, false);
  }
};

const VerifyExtImage = (req, file, callback) => {
  console.log("file", file)
  if (FILE_TYPE.includes(file.mimetype.split("/")[0])) {
    callback(null, true);
  } else {
    req.fileError = "Invalid file type";
    callback(null, false);
  }
}

const uploadVideo = multer({
  storage: multer.memoryStorage(),
  fileFilter: VerifyExtVideo,
});

const uploadThumbnail = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },

});

const uploadTute = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },

});

const multi_upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})


module.exports = {
  uploadThumbnail,
  uploadTute,
  uploadVideo,
  multi_upload,
  fileBucket,
  googleCloud,
  videoRawBucket,
  publicBucket

};