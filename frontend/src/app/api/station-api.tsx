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
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  try {
    const OPEN_CAGE_API_KEY =
      process.env.NEXT_PUBLIC_OPENCAGE_KEY ||
      "aa67ebeebf5a471d91d1cb5704dcdce8";
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        data.address + ", Addis Ababa, Ethiopia"
      )}&key=${OPEN_CAGE_API_KEY}`
    );
    if (!geoRes.data.results?.[0]?.geometry) {
      throw new Error("Invalid address");
    }
    const { lat, lng } = geoRes.data.results[0].geometry;
    const address = geoRes.data.results[0].formatted || data.address;

    const payload = {
      name: data.name,
      location: { coordinates: [lng, lat] },
      totalSlots: Number(data.capacity),
      address,
    };
    const response = await axios.post(`${URL}/stations`, payload, {
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

const UpdateStation = async (data: {
  id: string;
  name: string;
  address: string;
  capacity: number;
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  try {
    const OPEN_CAGE_API_KEY =
      process.env.NEXT_PUBLIC_OPENCAGE_KEY ||
      "aa67ebeebf5a471d91d1cb5704dcdce8";
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        data.address + ", Addis Ababa, Ethiopia"
      )}&key=${OPEN_CAGE_API_KEY}`
    );
    if (!geoRes.data.results?.[0]?.geometry) {
      throw new Error("Invalid address");
    }
    const { lat, lng } = geoRes.data.results[0].geometry;
    const address = geoRes.data.results[0].formatted || data.address;

    const payload = {
      name: data.name,
      location: { coordinates: [lng, lat] },
      totalSlots: Number(data.capacity),
      address,
    };
    const response = await axios.put(`${URL}/stations/${data.id}`, payload, {
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
};
