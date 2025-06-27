"use client";
import { useState, useEffect } from "react";

export const useCheckAdmin = () => {
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("accessToken") || "");
    }
  }, []);

  return !!accessToken;
};
