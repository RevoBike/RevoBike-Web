const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "RevoBike API Docs",
      version: "1.0.0",
      description: "API documentation for RevoBike",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
      },
    ],
       components: {
      schemas: {
        Station: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              description: "The unique ID of the station",
              example: "65f3b1a79c4a6b7d2a123456",
            },
            name: {
              type: "string",
              description: "The name of the station",
              example: "Downtown Station",
            },
            location: {
              type: "object",
              properties: {
                coordinates: {
                  type: "array",
                  items: { type: "number" },
                  example: [37.7749, -122.4194],
                },
              },
            },
            totalSlots: {
              type: "integer",
              description: "Total number of slots at the station",
              example: 20,
            },
            availableSlots: {
              type: "integer",
              description: "Available slots for bikes",
              example: 5,
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
