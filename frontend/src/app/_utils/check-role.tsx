"use client";
import { useMemo } from "react";

export const useCheckAdmin = () => {
  const role = useMemo(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("role") || "";
    }
    return "";
  }, []);

  return role.toLowerCase() == "superadmin";
};
