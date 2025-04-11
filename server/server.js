const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./src/config/db");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const http = require("http"); // For WebSocket server
const { Server } = require("socket.io"); // Import socket.io

const { loggingHandler } = require("./src/middlewares/loggingHandler");


dotenv.config(); //load env
// console.log("Environment Variables:", process.env); // Log all environment variables
console.log(`MongoDB URI: ${process.env.MONGO_URI}`); // Log the MongoDB URI
const app = express();
const server = http.createServer(app); // Create an HTTP server for WebSockets


// Connect to MongoDB
connectDB();

app.use(loggingHandler);
app.use(
  cors({
    credentials: true,
    origin: "*", // REACT APP URL
  })
);


// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // all clients to connect no matter their origin(all REACT APP URL)
    methods: ["GET", "POST"],
  },
});

// Store socket.io instance globally 
app.set("io", io); // to emit evetns everywhere

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});


const userRoutes = require("./src/routes/authRoutes");
const stationRoutes = require("./src/routes/stationRoutes");
const rideRoutes = require("./src/routes/rideRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");


const swaggerSpec = require("./src/config/swaggerConfig");

app.use(express.json()); // Middleware to parse JSON bodies

app.use("/api/users", userRoutes); // User routes
app.use("/api/stations", stationRoutes); //Station routes

app.use("/api/payments", paymentRoutes);//Payment routes
app.use("/api/rides", rideRoutes); //Ride routes


// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
