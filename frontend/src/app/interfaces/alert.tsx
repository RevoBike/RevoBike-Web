export interface Alert {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  bike: {
    _id: string;
    bikeId: string;
    status: string;
  };
  alertType: string;
  location: string;
  timestamp: string;
}
