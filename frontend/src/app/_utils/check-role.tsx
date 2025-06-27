"use client";
import { useState, useEffect } from "react";

export const useCheckRole = () => {
  const [role, setRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRole(localStorage.getItem("role") || "");
    }
  }, []);

  return role.toLowerCase() === "superadmin";
};
