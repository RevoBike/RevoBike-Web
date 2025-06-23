"use client";
import api from "./api";
import { Bike } from "@/app/interfaces/bike";

const GetBikesUnderMaintenance = async (
  page: number,
  limit: number,
  searchTerm?: string,
  bikeFilter?: string
): Promise<Bike[]> => {
  const response = await api.get(
    `/maintenance?bikeFilter=${bikeFilter}&search=${searchTerm}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const AddBikeUnderMaintenance = async (data: {
  bikeId: string;
  date: Date;
  description: string;
  type: string;
  technician: string;
  cost: number;
}): Promise<Bike> => {
  const response = await api.post(`/maintenance/${data.bikeId}`, {
    description: data.description,
    date: data.date,
    type: data.type,
    technician: data.technician,
    cost: data.cost,
  });

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const DoneBikeMaintenance = async (id: string): Promise<Bike> => {
  const response = await api.get(`/maintenance/${id}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const UpdateBikeUnderMaintenance = async (data: {
  bikeId: string;
  date: Date;
  description: string;
  type: string;
  technician: string;
  cost: number;
}): Promise<Bike> => {
  const response = await api.put(`/maintenance/${data.bikeId}`, {
    description: data.description,
    date: data.date,
    type: data.type,
    technician: data.technician,
    cost: data.cost,
  });

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const DeleteBikeMaintenance = async (data: {
  bikeId: string;
}): Promise<Bike> => {
  const response = await api.delete(`/maintenance/${data.bikeId}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export {
  GetBikesUnderMaintenance,
  AddBikeUnderMaintenance,
  DoneBikeMaintenance,
  UpdateBikeUnderMaintenance,
  DeleteBikeMaintenance,
};
