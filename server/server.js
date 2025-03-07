const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");


dotenv.config(); //load env
console.log("Environment Variables:", process.env); // Log all environment variables
console.log(`MongoDB URI: ${process.env.MONGO_URI}`); // Log the MongoDB URI
const app = express();

// Connect to MongoDB
connectDB();

app.use(
  cors({
    credentials: true,
    origin: "*", // REACT APP URL
  })
);

const userRoutes = require("./src/routes/authRoutes");
const stationRoutes = require("./src/routes/stationRoutes");

const swaggerSpec = require("./src/config/swaggerConfig");


app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/users", userRoutes); // User routes
app.use("/stations", stationRoutes); //Station routes

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
