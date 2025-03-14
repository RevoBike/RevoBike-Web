import React from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const StationsPage = () => {
  const bikes = [
    { id: 1, model: "Mountain Bike", status: "Available" },
    { id: 2, model: "Road Bike", status: "Out of Service" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Bikes</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-all">
          <MdAdd className="mr-2" />
          Add Bike
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Bike Id</th>
              <th className="px-6 py-3">Model</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bikes.map((bike) => (
              <tr key={bike.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{bike.id}</td>
                <td className="px-6 py-4">{bike.model}</td>
                <td className="px-6 py-4">{bike.status}</td>
                <td className="px-6 py-4 flex space-x-4">
                  <button className="text-blue-600 hover:text-blue-800">
                    <MdEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StationsPage;
