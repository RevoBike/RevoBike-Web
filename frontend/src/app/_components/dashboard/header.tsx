import React from "react";
import { MdNotifications, MdAccountCircle, MdExitToApp } from "react-icons/md";

const NavBar = () => {
  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div></div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-700 hover:text-gray-900">
          <MdNotifications size={25} color="blue" />
        </button>

        <button className="text-gray-700 hover:text-gray-900">
          <MdAccountCircle size={25} color="green" />
        </button>

        <button className="text-gray-700 hover:text-gray-900">
          <MdExitToApp size={25} color="red" />
        </button>
      </div>
    </div>
  );
};

export default NavBar;
