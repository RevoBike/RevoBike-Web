import React from "react";
import Link from "next/link";
import { IconArrowBack } from "@tabler/icons-react";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-6xl font-extrabold text-red-500 animate-fadeIn mb-6">
          404
        </h1>
        <p className="text-2xl text-gray-700 mb-4">Oops! Page not found.</p>
        <p className="text-lg text-gray-500 mb-8">
          The page you&apos;re looking for might have been moved or deleted.
        </p>
        <Link
          href="/"
          className="flex justify-center items-center text-lg font-semibold text-white bg-green-500 py-2 px-6 rounded-full hover:bg-green-600 transition duration-300"
        >
          <IconArrowBack />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
