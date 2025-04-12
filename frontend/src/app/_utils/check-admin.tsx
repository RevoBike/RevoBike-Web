"use client";
const checkAdmin = () => {
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  if (!accessToken || !role) {
    return false;
  }
  return true;
};
export default checkAdmin;
