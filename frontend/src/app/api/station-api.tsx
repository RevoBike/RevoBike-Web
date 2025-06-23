"use client";
import api from "./api";

const GetStationStats = async (): Promise<{
  totalStations: number;
  maxCapacity: number;
}> => {
  const response = await api.get(`/stations/station-metrics`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
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
  const response = await api.get(
    `/stations?filter=${statusFilter}&search=${searchTerm}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
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
  const response = await api.get(`/stations/${id}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetStationsList = async (): Promise<{
  data: {
    value: string;
    label: string;
  }[];
}> => {
  const response = await api.get(`/stations/stationList`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data;
};

const CreateStation = async (data: {
  name: string;
  address: string;
  capacity: number;
  location: number[] | null;
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  const payload = {
    name: data.name,
    location: { coordinates: data.location },
    totalSlots: Number(data.capacity),
    address: data.address,
  };
  const response = await api.post(`/stations`, payload);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const UpdateStation = async (data: {
  id: string;
  name: string;
  address: string;
  capacity: number;
  location: number[] | null;
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    totalSlots: number;
  };
}> => {
  const payload = {
    name: data.name,
    location: { coordinates: data.location },
    totalSlots: Number(data.capacity),
    address: data.address,
  };

  const response = await api.put(`/stations/${data.id}`, payload);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const DeleteStation = async (id: string): Promise<void> => {
  const response = await api.delete(`/stations/${id}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetStationLocation = async (): Promise<
  {
    name: string;
    coordinates: number[];
  }[]
> => {
  const response = await api.get(`/stations/locations`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
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
