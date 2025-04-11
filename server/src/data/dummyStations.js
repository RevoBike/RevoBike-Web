const dummyStations = [
    {
        name: "AASTU Tulu Dimtu Gate Station",
        location: {
            type: "Point",
            coordinates: [38.7994, 8.9992] // Coordinates for Tulu Dimtu Gate
        },
        totalSlots: 10,
        available_bikes: [], // Will be populated with bike IDs
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "AASTU Engineering Library Station",
        location: {
            type: "Point",
            coordinates: [38.7985, 8.9987] // Coordinates for Engineering Library
        },
        totalSlots: 8,
        available_bikes: [], // Will be populated with bike IDs
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        name: "AASTU Administration Office Station",
        location: {
            type: "Point",
            coordinates: [38.7978, 8.9995] // Coordinates for Administration Office
        },
        totalSlots: 12,
        available_bikes: [], // Will be populated with bike IDs
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

module.exports = dummyStations; 