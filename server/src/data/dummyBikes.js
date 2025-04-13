const dummyBikes = [
    // Tulu Dimtu Gate Station (4 bikes)
    {
        bikeId: "BIKE001",
        qrCode: "QR001",
        status: "available",
        currentLocation: {
            type: "Point",
            coordinates: [38.7994, 8.9992]
        },
        geofenceStatus: "inside",
        // Battery and Power
        batteryLevel: 95,
        batteryHealth: 98,
        lastCharged: new Date("2024-04-04"),
        // Maintenance
        lastMaintenance: new Date("2024-03-15"),
        nextMaintenance: new Date("2024-06-15"),
        maintenanceHistory: [{
            date: new Date("2024-03-15"),
            type: "Regular Checkup",
            description: "General inspection and cleaning",
            technician: "John Doe",
            cost: 500
        }],
        // Usage Statistics
        totalRides: 45,
        totalDistance: 225, // km
        lastRide: new Date("2024-04-01"),
        averageSpeed: 15, // km/h
        // Bike Specifications
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "Red",
        // Safety Features
        lockStatus: "locked",
        alarmStatus: "active",
        // Insurance and Compliance
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-15"),
        nextInspection: new Date("2024-09-15")
    },
    {
        bikeId: "BIKE002",
        qrCode: "QR002",
        status: "available",
        currentLocation: {
            type: "Point",
            coordinates: [38.7994, 8.9992]
        },
        geofenceStatus: "inside",
        batteryLevel: 100,
        batteryHealth: 100,
        lastCharged: new Date("2024-04-04"),
        lastMaintenance: new Date("2024-03-20"),
        nextMaintenance: new Date("2024-06-20"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-20"),
                type: "Battery Replacement",
                description: "Replaced old battery with new one",
                technician: "Jane Smith",
                cost: 1500
            }
        ],
        totalRides: 32,
        totalDistance: 160,
        lastRide: new Date("2024-04-02"),
        averageSpeed: 16,
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "Blue",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-20"),
        nextInspection: new Date("2024-09-20")
    },
    {
        bikeId: "BIKE003",
        qrCode: "QR003",
        status: "underMaintenance",
        currentLocation: {
            type: "Point",
            coordinates: [38.7994, 8.9992]
        },
        geofenceStatus: "inside",
        batteryLevel: 0,
        batteryHealth: 85,
        lastCharged: new Date("2024-03-25"),
        lastMaintenance: new Date("2024-03-10"),
        nextMaintenance: new Date("2024-04-10"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-10"),
                type: "Brake System",
                description: "Brake system needs replacement",
                technician: "Mike Johnson",
                cost: 800
            }
        ],
        totalRides: 78,
        totalDistance: 390,
        lastRide: new Date("2024-03-25"),
        averageSpeed: 15,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Black",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-10"),
        nextInspection: new Date("2024-09-10")
    },
    {
        bikeId: "BIKE004",
        qrCode: "QR004",
        status: "reserved",
        currentLocation: {
            type: "Point",
            coordinates: [38.7994, 8.9992]
        },
        geofenceStatus: "inside",
        batteryLevel: 85,
        batteryHealth: 92,
        lastCharged: new Date("2024-04-03"),
        lastMaintenance: new Date("2024-03-18"),
        nextMaintenance: new Date("2024-06-18"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-18"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 56,
        totalDistance: 280,
        lastRide: new Date("2024-04-03"),
        averageSpeed: 14,
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "White",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-18"),
        nextInspection: new Date("2024-09-18")
    },

    // Engineering Library Station (4 bikes)
    {
        bikeId: "BIKE005",
        qrCode: "QR005",
        status: "available",
        currentLocation: {
            type: "Point",
            coordinates: [38.7985, 8.9987]
        },
        geofenceStatus: "inside",
        batteryLevel: 90,
        batteryHealth: 95,
        lastCharged: new Date("2024-04-04"),
        lastMaintenance: new Date("2024-03-22"),
        nextMaintenance: new Date("2024-06-22"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-22"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 42,
        totalDistance: 210,
        lastRide: new Date("2024-04-01"),
        averageSpeed: 15,
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "Green",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-22"),
        nextInspection: new Date("2024-09-22")
    },
    {
        bikeId: "BIKE006",
        qrCode: "QR006",
        status: "in-use",
        currentLocation: {
            type: "Point",
            coordinates: [38.7985, 8.9987]
        },
        geofenceStatus: "inside",
        batteryLevel: 75,
        batteryHealth: 88,
        lastCharged: new Date("2024-04-03"),
        lastMaintenance: new Date("2024-03-15"),
        nextMaintenance: new Date("2024-06-15"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-15"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 65,
        totalDistance: 325,
        lastRide: new Date("2024-04-04"),
        averageSpeed: 16,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Yellow",
        lockStatus: "unlocked",
        alarmStatus: "inactive",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-15"),
        nextInspection: new Date("2024-09-15")
    },
    {
        bikeId: "BIKE007",
        qrCode: "QR007",
        status: "underMaintenance",
        currentLocation: {
            type: "Point",
            coordinates: [38.7985, 8.9987]
        },
        geofenceStatus: "inside",
        batteryLevel: 0,
        batteryHealth: 70,
        lastCharged: new Date("2024-03-20"),
        lastMaintenance: new Date("2024-03-05"),
        nextMaintenance: new Date("2024-04-05"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-05"),
                type: "Battery Issues",
                description: "Battery replacement needed",
                technician: "Jane Smith",
                cost: 1500
            }
        ],
        totalRides: 89,
        totalDistance: 445,
        lastRide: new Date("2024-03-20"),
        averageSpeed: 15,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Black",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-05"),
        nextInspection: new Date("2024-09-05")
    },
    {
        bikeId: "BIKE008",
        qrCode: "QR008",
        status: "available",
        currentLocation: {
            type: "Point",
            coordinates: [38.7985, 8.9987]
        },
        geofenceStatus: "inside",
        batteryLevel: 100,
        batteryHealth: 100,
        lastCharged: new Date("2024-04-04"),
        lastMaintenance: new Date("2024-03-25"),
        nextMaintenance: new Date("2024-06-25"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-25"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 23,
        totalDistance: 115,
        lastRide: new Date("2024-04-02"),
        averageSpeed: 15,
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "Red",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-25"),
        nextInspection: new Date("2024-09-25")
    },

    // Administration Office Station (4 bikes)
    {
        bikeId: "BIKE009",
        qrCode: "QR009",
        status: "available",
        currentLocation: {
            type: "Point",
            coordinates: [38.7978, 8.9995]
        },
        geofenceStatus: "inside",
        batteryLevel: 80,
        batteryHealth: 90,
        lastCharged: new Date("2024-04-03"),
        lastMaintenance: new Date("2024-03-10"),
        nextMaintenance: new Date("2024-06-10"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-10"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 67,
        totalDistance: 335,
        lastRide: new Date("2024-04-03"),
        averageSpeed: 15,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Blue",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-10"),
        nextInspection: new Date("2024-09-10")
    },
    {
        bikeId: "BIKE010",
        qrCode: "QR010",
        status: "reserved",
        currentLocation: {
            type: "Point",
            coordinates: [38.7978, 8.9995]
        },
        geofenceStatus: "inside",
        batteryLevel: 95,
        batteryHealth: 98,
        lastCharged: new Date("2024-04-04"),
        lastMaintenance: new Date("2024-03-15"),
        nextMaintenance: new Date("2024-06-15"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-15"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 45,
        totalDistance: 225,
        lastRide: new Date("2024-04-01"),
        averageSpeed: 15,
        model: "E-Bike Pro 2024",
        manufacturer: "RevoBike",
        year: 2024,
        color: "White",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2025-04-01"),
        lastInspection: new Date("2024-03-15"),
        nextInspection: new Date("2024-09-15")
    },
    {
        bikeId: "BIKE011",
        qrCode: "QR011",
        status: "in-use",
        currentLocation: {
            type: "Point",
            coordinates: [38.7978, 8.9995]
        },
        geofenceStatus: "inside",
        batteryLevel: 60,
        batteryHealth: 85,
        lastCharged: new Date("2024-04-03"),
        lastMaintenance: new Date("2024-03-20"),
        nextMaintenance: new Date("2024-06-20"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-20"),
                type: "Regular Checkup",
                description: "General inspection and cleaning",
                technician: "John Doe",
                cost: 500
            }
        ],
        totalRides: 78,
        totalDistance: 390,
        lastRide: new Date("2024-04-04"),
        averageSpeed: 16,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Black",
        lockStatus: "unlocked",
        alarmStatus: "inactive",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-20"),
        nextInspection: new Date("2024-09-20")
    },
    {
        bikeId: "BIKE012",
        qrCode: "QR012",
        status: "underMaintenance",
        currentLocation: {
            type: "Point",
            coordinates: [38.7978, 8.9995]
        },
        geofenceStatus: "inside",
        batteryLevel: 0,
        batteryHealth: 75,
        lastCharged: new Date("2024-03-15"),
        lastMaintenance: new Date("2024-03-01"),
        nextMaintenance: new Date("2024-04-01"),
        maintenanceHistory: [
            {
                date: new Date("2024-03-01"),
                type: "Tire Replacement",
                description: "Tire replacement and general checkup",
                technician: "Mike Johnson",
                cost: 1000
            }
        ],
        totalRides: 92,
        totalDistance: 460,
        lastRide: new Date("2024-03-15"),
        averageSpeed: 15,
        model: "E-Bike Pro 2023",
        manufacturer: "RevoBike",
        year: 2023,
        color: "Red",
        lockStatus: "locked",
        alarmStatus: "active",
        insuranceExpiry: new Date("2024-12-31"),
        lastInspection: new Date("2024-03-01"),
        nextInspection: new Date("2024-09-01")
    }
];

module.exports = dummyBikes; 