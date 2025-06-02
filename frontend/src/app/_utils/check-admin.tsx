"use client";
import { useMemo } from "react";

export const useCheckAdmin = () => {
  const accessToken = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken") || "";
    }
    return "";
  }, []);

  return !!accessToken;
};
