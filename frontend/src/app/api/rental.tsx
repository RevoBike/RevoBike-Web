"use client";
import axios from "axios";
import { Ride } from "@/app/interfaces/rides";

const URL = process.env.API_URL || "http://localhost:5000/api";

const GetRides = async (
  page: number,
  limit: number,
  search?: string,
  filter?: string
): Promise<Ride[]> => {
  try {
    const response = await axios.get(
      `${URL}/rides?filter=${filter}&search=${search}&limit=${limit}&page=${page}`,
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
    console.log(response.data.data);
    return response.data.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export { GetRides };
