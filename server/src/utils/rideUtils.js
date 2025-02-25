const EARTH_RADIUS_KM = 6371;

// Haversine formula to calculate distance
exports.calculateDistance = (startCoords, endCoords) => {
    const [lng1, lat1] = startCoords;
    const [lng2, lat2] = endCoords;

    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * 
        Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c; // Distance in km
};


// Cost calculation based on distance (per km) and time
exports.calculateRideCost = (distance) => {
    const baseFare = 10; // Base fare in currency
    const perKmRate = 5; // Charge per km
    // const perMinuteRate = 5; // Charge per minute

    // const rideDurationMinutes = (Date.now() - new Date(startTime)) / 60000;
    //return baseFare + (distance * perKmRate) + (rideDurationMinutes * perMinuteRate);
    return baseFare + (distance * perKmRate);
};
