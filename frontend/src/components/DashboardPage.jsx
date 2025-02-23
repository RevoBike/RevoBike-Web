const DashboardPage = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Overview</h2>
          <p className="text-gray-600 mt-2">A summary of your bike rental statistics and usage.</p>
          <div className="mt-4 flex space-x-4">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg">Active Rentals</h3>
              <p className="font-bold text-3xl">56</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg">Available Bikes</h3>
              <p className="font-bold text-3xl">123</p>
            </div>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800">Recent Activity</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center space-x-4">
              <span className="text-gray-600">User 1 rented a bike</span>
              <span className="text-gray-500">2 minutes ago</span>
            </li>
            <li className="flex items-center space-x-4">
              <span className="text-gray-600">User 2 rented a bike</span>
              <span className="text-gray-500">5 minutes ago</span>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default DashboardPage;
  