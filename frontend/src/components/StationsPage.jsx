import React from "react";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";

const StationsPage = () => {
  const stations = [
    { id: 1, name: "Legehar Station", location: "Legehar 12 Avenue", maxCapacity: 100 },
    { id: 2, name: "Piassa Station", location: "Piassa 143 Avenue", maxCapacity: 140 },
    { id: 3, name: "Tulu Dimtu Station", location: "Tulu 143 Avenue", maxCapacity: 14 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Manage Stations</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-all">
          <MdAdd className="mr-2" />
          Add Station
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3">Station Id</th>
              <th className="px-6 py-3">Station Name</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Maximum Capacity</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4">{station.id}</td>
                <td className="px-6 py-4">{station.name}</td>
                <td className="px-6 py-4">{station.location}</td>
                <td className="px-6 py-4">{station.maxCapacity}</td>
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
