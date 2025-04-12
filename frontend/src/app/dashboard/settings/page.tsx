"use client";
import React, { useState } from "react";
import { MdSettings, MdLock, MdNotifications } from "react-icons/md";

const SettingsPage = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">Settings</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Profile Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              Save Profile
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <MdNotifications className="mr-2" />
          Notification Settings
        </h3>
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">Enable Notifications</label>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={() => setNotificationsEnabled(!notificationsEnabled)}
            className="toggle-checkbox"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <MdLock className="mr-2" />
          Password Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-gray-600 mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="current-password"
              placeholder="Enter current password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-gray-600 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="new-password"
              placeholder="Enter new password"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all">
              Change Password
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <MdSettings className="mr-2" />
          Theme Settings
        </h3>
        <div className="flex items-center space-x-4">
          <label className="text-gray-600">Enable Dark Mode</label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="toggle-checkbox"
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
