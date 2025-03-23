// server/config/swaggerConfig.js
const swaggerJSDoc = require('swagger-jsdoc');

// Swagger definition
const swaggerDefinition = {
    info: {
        title: 'Bike Rental API',  // Title of your API
        version: '1.0.0',          // API version
        description: 'API documentation for the bike rental system.',
    },
    host: 'localhost:5000',           // API host
    basePath: '/',                   // Base path of API
};

// Options for swagger-jsdoc
const options = {
    swaggerDefinition,
    apis: ['./server/src/routes/*.js'], // Path to your route files to scan for comments
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
