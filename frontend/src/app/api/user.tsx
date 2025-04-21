"use client";
import axios from "axios";

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
    console.log(response.data);
    return response.data.data;
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export { CreateAdmin };
