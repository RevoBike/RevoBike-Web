export interface Ride {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  bike: {
    _id: string;
    bikeId: string;
  };
  startLocation: {
    type: string;
    coordinates: [number, number];
  };
  endLocation: {
    type: string;
    coordinates: [number, number];
  };
  startTime: string;
  endTime: string;
  distance: number;
  cost: number;
  status: "active" | "completed";
  paymentStatus: "pending" | "paid" | "failed";
  endStationName: string;
  startStationName: string;
}
