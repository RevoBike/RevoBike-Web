  "use client";
import axios from "axios";
import { User } from "@/app/interfaces/user";

const URL = process.env.API_URL || "https://revobike-web-3.onrender.com/api";


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
        "x-auth-token": localStorage.getItem("accessToken"),
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
        "x-auth-token": localStorage.getItem("accessToken"),
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

const Login = async (data: {
  email: string;
  password: string;
}): Promise<{
  token: string;
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
  try {
    const response = await axios.put(`${URL}/admin/update/${data.id}`, data, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
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

const DeleteUser = async (data: {
  id: string;
}): Promise<{
  success: string;
  message: string;
}> => {
  try {
    const response = await axios.delete(`${URL}/admin/${data.id}`, {
      headers: {
        "x-auth-token": localStorage.getItem("accessToken"),
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

export {
  CreateAdmin,
  GetUserStats,
  GetAllUsers,
  Login,
  UpdateRole,
  DeleteUser,
};
