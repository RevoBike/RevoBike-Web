const EARTH_RADIUS_KM = 6371; // Earth's radius in KM

//Haversine formula to calculate distance between two GPS points
exports.calculateDistance = (coord1, coord2) => {
    const toRad = (value) => (value * Math.PI) / 180;

    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c; //Distance in KM
};

//Define Geofence Area (Example: University Campus)
const GEOFENCE_CENTER = [38.7635, 9.0373]; // (Longitude, Latitude)
const GEOFENCE_RADIUS_KM = 5; // 5 km radius

// Function to check if a bike is inside the geofence
exports.isBikeInsideGeofence = (bikeLocation) => {
    const distance = exports.calculateDistance(bikeLocation, GEOFENCE_CENTER);
    return distance <= GEOFENCE_RADIUS_KM; // Inside = true, Outside = false
};

//Cost calculation based on distance (KM)
exports.calculateRideCost = (distanceKM) => {
    const BASE_FARE = 10; // Base fare in currency
    const PER_KM_RATE = 5; // Charge per KM

    return BASE_FARE + (distanceKM * PER_KM_RATE);
};
