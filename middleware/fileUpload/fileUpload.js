const multer = require("multer");
const uuid = require("uuid").v4;

const storage = multer.diskStorage({
  destination: (req, res, callback) => {
    callback(null, "./public/images");
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}-${uuid()}-${file.originalname}`);
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
  storage,
  fileFilter: VerifyExt,
  limits: { fileSize: 20000000 },
});

module.exports = upload;
