const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`); // Log the MongoDB URI
    console.log(`MongoDB URI: ${process.env.MONGO_URI}`); // Log the MongoDB URI
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process if connection fails
  }
};

module.exports = connectDB;
