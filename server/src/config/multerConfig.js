const multer = require("multer");
const path = require("path");

const generateFileName = require("../utils/generateFileName");

const storage = multer.diskStorage({
  destination: (req, _, cb) => {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: (_, file, cb) => {
    cb(null, generateFileName(file));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, and GIF files are allowed"));
    }
  },
});

module.exports = upload;
