"use client";
import api from "./api";

const GetStats = async (): Promise<{
  rented: {
    count: number;
    change: number;
  };
  maintenance: {
    count: number;
    change: number;
  };
  available: {
    count: number;
    change: number;
  };
  revenue: {
    total: number;
    change: number;
  };
}> => {
  const response = await api.get(`/stats`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetRentalStats = async (): Promise<
  {
    month: number;
    active: number;
    completed: number;
  }[]
> => {
  const response = await api.get(
    `/stats/rental-stats?year=${new Date().getFullYear()}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetRentalStatus = async (
  timeframe: string
): Promise<
  {
    label: string;
    percentage: string;
    count: number;
  }[]
> => {
  const response = await api.get(`/stats/rental-status?timeframe=${timeframe}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  console.log("The status:", response.data.data);
  return response.data.data;
};

export { GetStats, GetRentalStats, GetRentalStatus };
