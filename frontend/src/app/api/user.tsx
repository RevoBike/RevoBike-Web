"use client";
import axios from "axios";
import { User } from "@/app/interfaces/user";

const URL = process.env.API_URL || "http://localhost:5000/api";

const CreateAdmin = async (data: {
  name: string;
  email: string;
  phone_number: string;
  role: string;
}): Promise<{
  name: string;
  email: string;
}> => {
  try {
    const response = await axios.post(`${URL}/admin`, data, {
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

const GetUserStats = async (): Promise<{
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
}> => {
  try {
    const response = await axios.get(`${URL}/admin/user-metrics`, {
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

const GetAllUsers = async (
  page: number,
  limit: number,
  search?: string,
  filter?: string
): Promise<User[]> => {
  try {
    const response = await axios.get(
      `${URL}/admin/all?filter=${filter}&search=${search}&limit=${limit}&page=${page}`,
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

export { CreateAdmin, GetUserStats, GetAllUsers };
