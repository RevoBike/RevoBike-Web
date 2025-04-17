const path = require("path");
const QRCode = require("qrcode");

const generateQRCode = async (text, fileName) => {
  try {
    const filePath = path.join(__dirname, "../public/uploads", fileName);
    await QRCode.toFile(filePath, text);
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
};

module.exports = generateQRCode;
