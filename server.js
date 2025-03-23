const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/users'); // Ensure this is correctly imported
const swaggerUi = require('swagger-ui-express');  // Import swagger-ui-express
const swaggerSpec = require('./docs/swaggerConfig'); // Import your swaggerConfig

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Mount the Swagger UI at /api-docs

// Routes
app.use('/api', userRoutes); // Ensure this is correctly set up

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
