"use client";
import api from "./api";
import { User } from "@/app/interfaces/user";
import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CreateAdmin = async (data: {
  name: string;
  email: string;
  phone_number: string;
  role: string;
}): Promise<{
  name: string;
  email: string;
}> => {
  const response = await api.post("/admin", data, {});

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetUserStats = async (): Promise<{
  totalUsers: number;
  totalCustomers: number;
  totalAdmins: number;
  totalSuperAdmins: number;
}> => {
  const response = await api.get(`/admin/user-metrics`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetAllUsers = async (
  page: number,
  limit: number,
  search?: string,
  filter?: string
): Promise<User[]> => {
  const response = await api.get(
    `/admin/all?filter=${filter}&search=${search}&limit=${limit}&page=${page}`
  );

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const Login = async (data: {
  email: string;
  password: string;
}): Promise<{
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    isVerified: boolean;
    name: string;
  };
}> => {
  try {
    const response = await axios.post(`${URL}/users/login`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

const UpdateRole = async (data: {
  role: string;
  id: string;
}): Promise<{
  success: string;
  message: string;
}> => {
  const response = await api.put(`/admin/update/${data.id}`, data);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const DeleteUser = async (data: {
  id: string;
}): Promise<{
  success: string;
  message: string;
}> => {
  const response = await api.delete(`/admin/${data.id}`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const GetProfile = async (): Promise<{
  name: string;
  email: string;
  phone_number: string;
  role: string;
  isVerified: boolean;
}> => {
  const response = await api.get(`/admin/profile`);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const UpdateProfile = async (user: {
  name: string;
  email: string;
  phone_number: string;
}): Promise<{
  name: string;
  email: string;
  phone_number: string;
  role: string;
  isVerified: boolean;
}> => {
  const response = await api.put(`/admin/profile`, user);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

const ChangePassword = async (user: {
  email: string;
  oldPassword: string;
  newPassword: string;
}): Promise<{
  message: string;
}> => {
  const response = await api.put(`/users/change-password`, user);

  if (response.status === 404) {
    throw new Error(response.data.message);
  }
  return response.data.data;
};

export {
  CreateAdmin,
  GetUserStats,
  GetAllUsers,
  Login,
  UpdateRole,
  DeleteUser,
  GetProfile,
  UpdateProfile,
  ChangePassword,
};
