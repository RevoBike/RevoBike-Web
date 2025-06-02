"use client";
import axios from "axios";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetStationStats = async (): Promise<{
  totalStations: number;
  maxCapacity: number;
}> => {
  try {
    const response = await axios.get(`${URL}/stations/station-metrics`, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
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

const GetStations = async (
  page: number,
  limit: number,
  searchTerm?: string,
  statusFilter?: string
): Promise<
  {
    _id: string;
    name: string;
    address: string;
    available_bikes: [];
    createdAt: string;
    updatedAt: string;
    totalSlots: number;
    location: {
      coordinates: number[];
    };
  }[]
> => {
  try {
    const response = await axios.get(
      `${URL}/stations?filter=${statusFilter}&search=${searchTerm}&limit=${limit}&page=${page}`,
      {
        headers: {
          "x-auth-token": localStorage.getItem("accessToken"),
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

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
        "x-auth-token": localStorage.getItem("accessToken"),
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

const GetStationsList = async (): Promise<{
  data: {
    value: string;
    label: string;
  }[];
}> => {
  try {
    const response = await axios.get(`${URL}/stations/stationList`, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const CreateStation = async (data: {
  name: string;
  address: string;
  capacity: number;
  location: number[];
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  try {
    const payload = {
      name: data.name,
      location: { coordinates: data.location },
      totalSlots: Number(data.capacity),
      address: data.address,
    };
    const response = await axios.post(`${URL}/stations`, payload, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
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

const UpdateStation = async (data: {
  id: string;
  name: string;
  address: string;
  capacity: number;
  location: number[];
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  try {
    const payload = {
      name: data.name,
      location: { coordinates: data.location },
      totalSlots: Number(data.capacity),
      address: data.address,
    };

    console.log("Payload", payload);
    const response = await axios.put(`${URL}/stations/${data.id}`, payload, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
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
        "x-auth-token": localStorage.getItem("accessToken"),
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

const GetStationLocation = async (): Promise<
  {
    name: string;
    coordinates: number[];
  }[]
> => {
  try {
    const response = await axios.get(`${URL}/stations/locations`, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    console.log("Station Locations", response.data.data);
    return response.data.data;
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
  CreateStation,
  UpdateStation,
  DeleteStation,
  GetStationStats,
  GetStationsList,
  GetStationLocation,
};
