const BikesPage = () => (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Bikes</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Bike ID</th>
            <th className="border border-gray-300 p-2">Model</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2">#001</td>
            <td className="border border-gray-300 p-2">Mountain Bike</td>
            <td className="border border-gray-300 p-2 text-green-600">Available</td>
            <td className="border border-gray-300 p-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2">#002</td>
            <td className="border border-gray-300 p-2">Road Bike</td>
            <td className="border border-gray-300 p-2 text-red-600">Out of Service</td>
            <td className="border border-gray-300 p-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
              <button className="bg-red-500 text-white px-2 py-1 rounded ml-2">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  export default BikesPage;