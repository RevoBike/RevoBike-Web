import { useState } from "react";
import {
  FaTachometerAlt,
  FaBicycle,
  FaUsers,
  FaCog,
  FaChargingStation,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`bg-gray-900 text-white h-screen p-4 ${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <h2
          className={`text-xl font-bold mb-4 ${collapsed ? "hidden" : "block"}`}
        >
          RevoBike Admin
        </h2>
        <button onClick={() => setCollapsed(!collapsed)} className="text-white">
          <i className={`fas ${collapsed ? "fa-bars" : "fa-times"}`} />
        </button>
      </div>

      <nav>
        <ul>
          <li className="mb-2">
            <NavLink
              to="/admin/dashboard"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition-all duration-300"
              activeClassName="bg-gray-700"
            >
              <FaTachometerAlt className="mr-2" />
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Dashboard
              </span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/stations"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition-all duration-300"
              activeClassName="bg-gray-700"
            >
              <FaChargingStation className="mr-2" />
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Stations
              </span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/bikes"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition-all duration-300"
              activeClassName="bg-gray-700"
            >
              <FaBicycle className="mr-2" />
              <span className={`${collapsed ? "hidden" : "block"}`}>Bikes</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/users"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition-all duration-300"
              activeClassName="bg-gray-700"
            >
              <FaUsers className="mr-2" />
              <span className={`${collapsed ? "hidden" : "block"}`}>Users</span>
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/admin/settings"
              className="flex items-center p-2 hover:bg-gray-700 rounded transition-all duration-300"
              activeClassName="bg-gray-700"
            >
              <FaCog className="mr-2" />
              <span className={`${collapsed ? "hidden" : "block"}`}>
                Settings
              </span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
