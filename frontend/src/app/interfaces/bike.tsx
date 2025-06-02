export interface Bike {
  _id: string;
  bikeId: string;
  qrCode: string;
  status: string;
  currentLocation: {
    coordinates: [number, number];
  };
  currentStation: string;
  geofenceStatus: string;
  batteryLevel: number;
  batteryHealth: number;
  lastCharged: string;
  lastMaintenance: string;
  nextMaintenance: string;
  totalRides: number;
  totalDistance: number;
  lastRide: string;
  averageSpeed: number;
  model: string;
  manufacturer: string;
  lockStatus: string;
  alarmStatus: string;
  insuranceExpiry: string;
  imgUrl: string;
  color: string;
  maintenanceNotes: string;
  createdAt: string;
  updatedAt: string;
  maintenanceHistory: {
    date: string;
    type: string;
    technician: string;
    description: string;
    cost: number;
    provider: string;
  }[];
  lastInspection: string;
  nextInspection: string;
}
