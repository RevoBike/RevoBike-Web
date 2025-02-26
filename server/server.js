const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");

dotenv.config(); //load env
const app = express();

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const userRoutes = require("./src/routes/authRoutes");
const swaggerSpec = require("./src/config/swaggerConfig");

app.use(express.json()); // Middleware to parse JSON bodies
app.use("/api/users", userRoutes); // User routes
// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
