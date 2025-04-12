"use client";
export const isSuperAdmin = () => {
  const role = localStorage.getItem("role");
  if (!role) {
    return false;
  }
  if (role.toLowerCase() === "superadmin") {
    return true;
  }
  return false;
};
