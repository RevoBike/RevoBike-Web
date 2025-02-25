const express = require('express');
const dotenv = require('dotenv');
const connectDB = require("./src/config/db");

dotenv.config(); //load env
const app = express();

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const userRoutes = require("./src/routes/users");

app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/users", userRoutes); // Register user routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
