"use client";
import api from "./api";
import { Alert } from "@/app/interfaces/alert";

const GetAlerts = async (
  page: number,
  limit: number,
  filter?: string,
  date: Date | null = null
): Promise<Alert[]> => {
  const response = await api.get(
    `/alerts?filter=${filter}&date=${date}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  console.log("Alerts fetched successfully:", response.data.data);
  return response.data.data;
};

const GetAlertLocation = async (): Promise<
  {
    bikeId: string;
    coordinates: number[];
  }[]
> => {
  const response = await api.get(`/alerts/locations`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  console.log("Well", response.data.data);
  return response.data.data;
};

const GetRecentAlerts = async (): Promise<Alert[]> => {
  const response = await api.get(`/alerts/recent`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  console.log("Alerts fetched successfully:", response.data.data);
  return response.data.data;
};
export { GetAlerts, GetAlertLocation, GetRecentAlerts };
