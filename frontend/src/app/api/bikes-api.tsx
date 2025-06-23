"use client";
import api from "./api";
import { Bike } from "@/app/interfaces/bike";

const GetBikeStats = async (): Promise<{
  totalBikes: number;
  totalAvailableBikes: number;
  totalRentedBikes: number;
  totalReservedBikes: number;
  totalBikesInMaintenance: number;
}> => {
  const response = await api.get(`/bikes/bike-metrics`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetBikes = async (
  page: number,
  limit: number,
  searchTerm?: string,
  statusFilter?: string,
  bikeFilter?: string
): Promise<Bike[]> => {
  const response = await api.get(
    `/bikes?filter=${statusFilter}&bikeFilter=${bikeFilter}&search=${searchTerm}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetBike = async (
  id: string | null
): Promise<{
  data: Bike;
}> => {
  const response = await api.get(`/bikes/${id}`);
  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const AddBike = async (data: {
  model: string;
  station: string;
  bikeId: string;
}): Promise<{
  data: {
    id: string;
    type: string;
    station: string;
  };
}> => {
  const response = await api.post(`/bikes`, data);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
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
  const payload = {
    model: data.model,
    currentStation: data.station,
  };
  const response = await api.put(`/bikes/${data.id}`, payload);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const DeleteBike = async (id: string): Promise<void> => {
  const response = await api.delete(`/bikes/${id}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
};

const GetBikeLocation = async (): Promise<
  {
    bikeId: string;
    coordinates: number[];
  }[]
> => {
  const response = await api.get(`/bikes/locations`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const CheckBike = async (
  bikeId: string
): Promise<{
  data: {
    bikeId: string;
    status: boolean;
  };
}> => {
  const response = await api.get(`/bikes/check/${bikeId}`);
  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data;
};

export {
  GetBikes,
  GetBike,
  AddBike,
  UpdateBike,
  DeleteBike,
  GetBikeStats,
  GetBikeLocation,
  CheckBike,
};
