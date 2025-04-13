"use client";
import axios from "axios";

const URL = process.env.API_URL || "http://localhost:5000/api/v1";

const GetStations = async (): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  }[];
}> => {
  try {
    const response = await axios.get(`${URL}/stations`, {
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
  try {
    const response = await axios.get(`${URL}/stations/${id}`, {
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
const CreateStation = async (data: {
  name: string;
  address: string;
  capacity: number;
}): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  };
}> => {
  try {
    const response = await axios.post(`${URL}/stations`, data, {
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

const UpdateStation = async (
  id: string,
  data: {
    name: string;
    address: string;
    capacity: number;
  }
): Promise<{
  data: {
    id: string;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  };
}> => {
  try {
    const response = await axios.put(`${URL}/stations/${id}`, data, {
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

const DeleteStation = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${URL}/stations/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.status === 404) {
      throw new Error(response.data.message);
    }
  } catch (error: Error | unknown) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw new Error("An unknown error occurred");
  }
};

export { GetStations, GetStation, CreateStation, UpdateStation, DeleteStation };
