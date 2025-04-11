const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Station = require('../models/Station');
const Bike = require('../models/Bike');
const dummyStations = require('../data/dummyStations');
const dummyBikes = require('../data/dummyBikes');

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await Station.deleteMany({});
        await Bike.deleteMany({});
        console.log('Cleared existing data');

        // Insert stations
        const stations = await Station.insertMany(dummyStations);
        console.log('Successfully seeded stations');

        // Insert bikes and link them to stations
        const bikes = await Bike.insertMany(dummyBikes);
        console.log('Successfully seeded bikes');

        // Update stations with their bikes
        for (const station of stations) {
            const stationBikes = bikes.filter(bike => 
                bike.currentLocation.coordinates[0] === station.location.coordinates[0] &&
                bike.currentLocation.coordinates[1] === station.location.coordinates[1]
            );

            station.available_bikes = stationBikes.map(bike => bike._id);
            await station.save();
        }
        console.log('Successfully linked bikes to stations');

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData(); 