import { Loader } from "@mantine/core";
import React from "react";

const LoadingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="flex items-center justify-center mb-4">
        <Loader size="xl" className="text-[#154B1B]" />
      </div>
      <h2 className="text-xl text-primary text-[#154B1B]">
        Loading, please wait...
      </h2>
    </div>
  );
};

export default LoadingPage;
