"use client";
import axios from "axios";

const URL = process.env.API_URL || "http://localhost:5000/api/v1/admin";

const Login = async (data: {
  username: string;
  password: string;
}): Promise<{
  accessToken: string;
  user: {
    id: string;
    username: string;
    role: string;
    createdAt: string;
  };
}> => {
  try {
    const response = await axios.post(`${URL}/login`, data);

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
const GetUserCount = async (): Promise<{
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}> => {
  try {
    const response = await axios.get(`${URL}/count-users`, {
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

const GetUsers = async (): Promise<{
  data: {
    id: string;
    createdAt: string;
  }[];
}> => {
  try {
    const response = await axios.get(`${URL}/users`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const GetAllUsers = async (): Promise<{
  data: {
    id: string;
    name: string;
    phoneNumber: string;
    country: string;
    status: string;
    date: string;
  }[];
}> => {
  try {
    const response = await axios.get(`${URL}/allUsers`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const GetAdminCount = async (): Promise<{
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
}> => {
  try {
    const response = await axios.get(`${URL}/count-admins`, {
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

const GetAdmins = async (): Promise<{
  data: {
    id: string;
    username: string;
    country: string;
    role: string;
    status: string;
    createdAt: string;
  }[];
}> => {
  try {
    const response = await axios.get(`${URL}/admins`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const CreateAdmins = async (data: {
  name: string;
  email: string;
}): Promise<{
  data: {
    id: string;
    username: string;
    createdAt: string;
  }[];
}> => {
  try {
    const response = await axios.post(`${URL}/create`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const DeleteAdmin = async (id: string) => {
  try {
    const response = await axios.post(`${URL}/delete/:id=${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const GetAdmin = async (): Promise<{
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
  };
}> => {
  try {
    const response = await axios.get(`${URL}/admin`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const ChangePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}): Promise<{
  message: string;
}> => {
  try {
    const response = await axios.post(`${URL}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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

const adminApi = {
  Login,
  GetUserCount,
  GetUsers,
  GetAllUsers,
  GetAdminCount,
  GetAdmins,
  CreateAdmins,
  DeleteAdmin,
  GetAdmin,
  ChangePassword,
};

export default adminApi;
