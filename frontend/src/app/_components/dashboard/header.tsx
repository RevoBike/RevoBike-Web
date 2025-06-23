"use client";

import { useState, useRef } from "react";
import {
  MdAccountCircle,
  MdExitToApp,
  MdPerson,
  MdLockReset,
} from "react-icons/md";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useMutation, QueryClient } from "@tanstack/react-query";
import { GetProfile, UpdateProfile } from "@/app/api/user";
import ProfileModal from "./profile";
import PasswordModal from "./password";
import { notifications } from "@mantine/notifications";

const NavBar = () => {
  const queryClient = new QueryClient();
  const [
    profileModalOpened,
    { open: openProfileModal, close: closeProfileModal },
  ] = useDisclosure(false);

  const [
    passwordModalOpened,
    { open: openPasswordModal, close: closePasswordModal },
  ] = useDisclosure(false);

  const [dropdownOpen, { open: openDropdown, close: closeDropdown }] =
    useDisclosure(false);
  const accountRef = useRef(null);
  const dropdownRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Alex Jackson",
    email: "fhfbfhb@gmail.com",
    phone: "+12312317923",
  });

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: GetProfile,
  });

  const updateMutation = useMutation({
    mutationFn: UpdateProfile,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Profile updated successfully",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error?.message || "An error occurred",
        color: "red",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const handleProfileClick = () => {
    openDropdown();
  };

  const handleOptionClick = (option: string) => {
    closeDropdown();
    if (option === "Profile") openProfileModal();
    if (option === "Password") openPasswordModal();
  };

  const handleSaveProfile = () => {
    updateMutation.mutate({
      name: user.name,
      email: user.email,
      phone_number: user.phone,
    });

    setIsEditing(false);
    closeProfileModal();
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center relative">
      <h1 className="text-[#154B1B] font-bold text-xl sm:text-2xl italic">
        Energy Is Free
      </h1>
      <div className="flex items-center space-x-4 relative">
        <button
          ref={accountRef}
          className="text-gray-700 hover:text-gray-900"
          onClick={handleProfileClick}
          aria-label="Open user menu"
          aria-expanded={dropdownOpen}
        >
          <MdAccountCircle size={25} color="#154B1B" />
        </button>

        <button
          className="text-gray-700 hover:text-gray-900"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <MdExitToApp size={25} color="red" />
        </button>

        {dropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-10 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[150px] sm:min-w-[170px]"
          >
            <ul className="list-none p-0 m-0 space-y-1">
              <li
                className="flex items-center gap-2 text-sm px-3 py-2 text-[#154B1B] hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleOptionClick("Profile")}
              >
                <MdPerson size={18} />
                <span>Profile</span>
              </li>
              <li
                className="flex items-center gap-2 text-sm px-3 py-2 text-[#154B1B] hover:bg-gray-100 cursor-pointer rounded"
                onClick={() => handleOptionClick("Password")}
              >
                <MdLockReset size={18} />
                <span>Change Password</span>
              </li>
            </ul>
          </div>
        )}

        <ProfileModal
          opened={profileModalOpened}
          onClose={() => {
            closeProfileModal();
            setIsEditing(false);
          }}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          user={
            profile && !isLoading && !error
              ? {
                  name: profile.name || user.name,
                  email: profile.email || user.email,
                  phone: profile.phone_number || user.phone,
                }
              : user
          }
          setUser={setUser}
          onSave={handleSaveProfile}
        />

        <PasswordModal
          opened={passwordModalOpened}
          onClose={closePasswordModal}
        />
      </div>
    </div>
  );
};

export default NavBar;
