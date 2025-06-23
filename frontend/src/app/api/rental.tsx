"use client";
import api from "./api";
import { Ride } from "@/app/interfaces/rides";

const GetRides = async (
  page: number,
  limit: number,
  filter?: string,
  date: Date | null = null
): Promise<Ride[]> => {
  const response = await api.get(
    `/rides?filter=${filter}&date=${date}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  console.log(response.data.data);
  return response.data.data;
};

export { GetRides };
