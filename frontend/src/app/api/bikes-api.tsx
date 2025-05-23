"use client";
import axios from "axios";
import { Bike } from "@/app/interfaces/bike";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetBikeStats = async (): Promise<{
  totalBikes: number;
  totalAvailableBikes: number;
  totalRentedBikes: number;
  totalReservedBikes: number;
  totalBikesInMaintenance: number;
}> => {
  try {
    const response = await axios.get(`${URL}/bikes/bike-metrics`, {
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

const GetBikes = async (
  page: number,
  limit: number,
  searchTerm?: string,
  statusFilter?: string,
  bikeFilter?: string
): Promise<Bike[]> => {
  try {
    const response = await axios.get(
      `${URL}/bikes?filter=${statusFilter}&bikeFilter=${bikeFilter}&search=${searchTerm}&limit=${limit}&page=${page}`,
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

const GetBike = async (
  id: string | null
): Promise<{
  data: Bike;
}> => {
  try {
    const response = await axios.get(`${URL}/bikes/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (response.status === 404) {
      throw new Error(response.data.message);
    }
    console.log("Getting the bike", response.data.data);
    return response.data;
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

const UpdateBike = async (data: {
  id: string;
  model: string;
  station: string | null;
}): Promise<{
  data: {
    id: string;
    model: string;
    station: string;
  };
}> => {
  try {
    const payload = {
      model: data.model,
      currentStation: data.station,
    };
    const response = await axios.put(`${URL}/bikes/${data.id}`, payload, {
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

const DeleteBike = async (id: string): Promise<void> => {
  try {
    console.log("The id", id);
    const response = await axios.delete(`${URL}/bikes/${id}`, {
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

export { GetBikes, GetBike, AddBike, UpdateBike, DeleteBike, GetBikeStats };
