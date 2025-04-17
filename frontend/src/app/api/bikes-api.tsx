"use client";
import axios from "axios";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetBikeStats = async (): Promise<{
  totalBikes: number;
  bikeInMaintenance: number;
  bikeInRental: number;
  availableBikes: number;
}> => {
  try {
    // const response = await axios.get(`${URL}/stations/stats`, {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    //   },
    // });

    // if (response.status === 404) {
    //   throw new Error(response.data.message);
    // }
    // return response.data.data;
    const data = {
      totalBikes: 1000,
      bikeInMaintenance: 100,
      bikeInRental: 30,
      availableBikes: 67,
    };

    return data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const GetStations = async (
  page: number,
  limit: number,
  searchTerm?: string,
  statusFilter?: string
): Promise<
  {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  }[]
> => {
  // try {
  //   const response = await axios.get(`${URL}/stations`, {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  //     },
  //   });

  //   if (response.status === 404) {
  //     throw new Error(response.data.message);
  //   }
  //   return response.data.data;
  // } catch (error: Error | unknown) {
  //   if (axios.isAxiosError(error) && error.response) {
  //     throw new Error(error.response.data.message || error.message);
  //   }
  //   throw new Error("An unknown error occurred");
  // }
  const stations = [
    {
      id: "134566677888990000",
      name: "Central Park",
      address: "123 Park Ave",
      capacity: 20,
      bikes: 1,
    },
    {
      id: "134566677888992000",
      name: "Downtown Hub",
      address: "456 Main St",
      capacity: 15,
      bikes: 5,
    },
    {
      id: "134566677888990300",
      name: "Riverside Stop",
      address: "789 River Rd",
      capacity: 10,
      bikes: 2,
    },
    {
      id: "134566677888990380",
      name: "Uptown Plaza",
      address: "101 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
    {
      id: "134566677888990030",
      name: "Uptown Plaza 2",
      address: "102 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
    {
      id: "134566677888990003",
      name: "Uptown Plaza 3",
      address: "103 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
  ];

  return stations;
};

const GetStation = async (
  id: string
): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  };
}> => {
  try {
    const response = await axios.get(`${URL}/stations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const AddBike = async (
  data: FormData
): Promise<{
  data: {
    id: string;
    type: string;
    station: string;
  };
}> => {
  try {
    const response = await axios.post(`${URL}/bikes`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const UpdateStation = async (
  id: string,
  data: {
    name: string;
    address: string;
    capacity: number;
  }
): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  };
}> => {
  try {
    const response = await axios.put(`${URL}/stations/${id}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    return response.data.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const DeleteStation = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${URL}/stations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export {
  GetStations,
  GetStation,
  AddBike,
  UpdateStation,
  DeleteStation,
  GetBikeStats,
};
