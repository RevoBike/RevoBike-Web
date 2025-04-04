const fetchBikeStats = async () => {
  return {
    available: 45,
    rented: 12,
    maintenance: 3,
    activeRentals: 12,
    pendingPayments: 5,
    lowBattery: 4,
  };
};

const fetchStations = async () => {
  return [
    {
      id: 1,
      name: "Legehar Station",
      location: "Legehar 12 Avenue",
      capacity: 20,
      currentBikes: 5,
    },
    {
      id: 2,
      name: "Park Station",
      location: "Piassa 143 Avenue",
      capacity: 15,
      currentBikes: 2,
    },
  ];
};

const fetchAlerts = async () => {
  return [
    { id: 1, type: "theft", bikeId: "B123", time: "10 mins ago" },
    { id: 2, type: "lowBattery", bikeId: "B456", time: "20 mins ago" },
  ];
};
const fetchRecentRentals = async () => {
  return [
    {
      id: "R001",
      user: "john_doe",
      bikeId: "B123",
      startTime: "2025-03-30 09:00",
      endTime: "2025-03-30 09:45",
      status: "completed",
    },
    {
      id: "R002",
      user: "jane_smith",
      bikeId: "B456",
      startTime: "2025-03-30 10:15",
      endTime: null,
      status: "active",
    },
    {
      id: "R003",
      user: "bob_jones",
      bikeId: "B789",
      startTime: "2025-03-30 08:30",
      endTime: "2025-03-30 09:15",
      status: "completed",
    },
  ];
};

const updateStation = async ({ id, data }) => {
  console.log("Updating station", id, data);
  return { id, ...data };
};

const addStation = async (data) => {
  console.log("Adding station", data);
  return { id: Math.floor(Math.random() * 1000), ...data };
};

const api = {
  fetchBikeStats,
  fetchStations,
  fetchAlerts,
  fetchRecentRentals,
  updateStation,
  addStation,
};

export default api;
