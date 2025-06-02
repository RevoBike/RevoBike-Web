"use client";
import axios from "axios";
import { Bike, Alert } from "@/app/interfaces/bike";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetAlerts = async (
  page: number,
  limit: number,
  search?: string,
  filter?: string,
  date?: string
): Promise<Alert[]> => {
  try {
    const response = await axios.get(
      `${URL}/alert?filter=${filter}&date=${date}&search=${search}&limit=${limit}&page=${page}`,
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

export { GetAlerts };
