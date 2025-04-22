"use client";
import axios from "axios";
import { Bike } from "@/app/interfaces/bike";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetBikesUnderMaintenance = async (
  page: number,
  limit: number,
  searchTerm?: string,
  bikeFilter?: string
): Promise<Bike[]> => {
  try {
    const response = await axios.get(
      `${URL}/maintenance?bikeFilter=${bikeFilter}&search=${searchTerm}&limit=${limit}&page=${page}`,
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

const AddBikeUnderMaintenance = async (data: {
  bikeId: string;
  date: Date;
  description: string;
  type: string;
  technician: string;
  cost: number;
}): Promise<Bike> => {
  try {
    const response = await axios.post(
      `${URL}/maintenance/${data.bikeId}`,
      {
        description: data.description,
        date: data.date,
        type: data.type,
        technician: data.technician,
        cost: data.cost,
      },
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

export { GetBikesUnderMaintenance, AddBikeUnderMaintenance };
