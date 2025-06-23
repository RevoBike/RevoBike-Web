export interface Alert {
  _id: string;
  user: {
    _id: string;
    name: string;
    phone_number: string;
  };
  bike: {
    _id: string;
    bikeId: string;
    model: string;
  };
  alertType: string;
  location: string;
  timestamp: string;
}
