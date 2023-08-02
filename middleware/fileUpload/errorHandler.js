const multer = require("multer");

const errorHandler = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({ message: "File is too large" });
        break;
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({ message: "File limit exceeded" });
        break;
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(400).json({ message: "File is not required type" });
        break;
      default:
        return res.status(500).json({ message: "Something went wrong" });
        break;
    }
  } else {
    next();
  }
};

module.exports = errorHandler;
