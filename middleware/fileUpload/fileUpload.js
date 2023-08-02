const multer = require("multer");
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: process.env.GCLOUD_PROJECT,
  credentials: {
    client_email: process.env.GCLOUD_CLIENT_EMAIL,
    private_key: process.env.GCLOUD_PRIVATE_KEY,
  },
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
console.log('Uploading')
const bucket = storage.bucket(process.env.GCS_BUCKET)

module.exports = {upload, bucket};
