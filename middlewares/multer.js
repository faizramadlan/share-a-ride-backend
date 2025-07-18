const uuid = require("uuid").v4;
const multer = require("multer");
const logger = require("../helpers/logger");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] !== "image") {
    logger.warn(`Rejected file upload: invalid mimetype ${file.mimetype}`);
    cb(new Error("Invalid image"), false);
  } else {
    logger.info(`Accepted file upload: ${file.originalname}`);
    cb(null, true);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5000_000,
    files: 2,
  },
});

module.exports = upload;
