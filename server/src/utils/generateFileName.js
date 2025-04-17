const { v4: uuidv4 } = require("uuid");
const path = require("path");

const generateFileName = (file) => {
  let fileExtension = path.extname(file.originalname);
  if (!fileExtension) {
    const mimeToExt = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
    };
    fileExtension = mimeToExt[file.mimetype] || "";
  }
  return `${uuidv4()}${fileExtension}`;
};

module.exports = generateFileName;
