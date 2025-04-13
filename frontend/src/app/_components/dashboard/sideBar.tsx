"use client";

import Link from "next/link";
import { IconChevronRight, IconMenu2, IconX } from "@tabler/icons-react";
import {
  FaTachometerAlt,
  FaBicycle,
  FaUsers,
  FaCog,
  FaChargingStation,
} from "react-icons/fa";
import { Avatar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";

const data = [
  { link: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    link: "/dashboard/stations",
    label: "Stations",
    icon: FaChargingStation,
  },
  {
    link: "/dashboard/bikes",
    label: "Bikes",
    icon: FaBicycle,
  },
  {
    link: "/dashboard/users",
    label: "Users",
    icon: FaUsers,
  },
  {
    link: "/dashboard/rentals",
    label: "Rentals",
    icon: FaCog,
  },
  {
    link: "/dashboard/settings",
    label: "Payments",
    icon: FaCog,
  },
  {
    link: "/dashboard/settings",
    label: "Maintenance",
    icon: FaCog,
  },
  {
    link: "/dashboard/settings",
    label: "Battery",
    icon: FaCog,
  },
  {
    link: "/dashboard/settings",
    label: "Alerts",
    icon: FaCog,
  },
  {
    link: "/dashboard/settings",
    label: "Settings",
    icon: FaCog,
  },
];

export default function Sidebar() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const path = usePathname();
  const isActive = (link: string) => {
    return path === link ? "bg-white text-black" : "text-white";
  };

  const links = data.map((item) => (
    <Link
      href={item.link}
      className={`block p-4 text-black ${isActive(
        item.link
      )} hover:text-gray-400 transition-colors rounded-md`}
      key={item.label}
      onClick={close}
    >
      <div className="flex items-center gap-2">
        {item.icon && <item.icon className={`${isActive(item.link)}`} />}
        <span className="flex flex-row align-middle items-center justify-between w-full">
          {item.label}
          <IconChevronRight stroke={1.5} className={`${isActive(item.link)}`} />
        </span>
      </div>
    </Link>
  ));

  return (
    <>
      <button
        className="fixed md:hidden top-4 left-4 z-50 p-2 rounded-md shadow-md mt-24 bg-green-950"
        onClick={toggle}
      >
        {opened ? (
          <IconX size={24} stroke={1.5} />
        ) : (
          <IconMenu2 size={24} stroke={1.5} />
        )}
      </button>

      {opened && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      <nav
        className={`md:static p-2 top-0 left-0 h-full bg-customBlue shadow-md flex flex-col justify-between z-50 transition-transform duration-300 w-64 ${
          opened ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1">
          <div className="flex flex-row justify-center align-middle items-center p-4">
            <h1 className="text-lg font-bold text-white bg-clip-text text-transparent">
              RevoBike Admin
            </h1>
          </div>

          <div className="mt-4">{links}</div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center p-4 cursor-pointer rounded-full w-fit">
            <Avatar
              radius="xl"
              size="sm"
              // src={`http://localhost:5000/${user?.picture}`}
            />
            <span className="ml-2 text-white">Profile</span>
          </div>
        </div>
      </nav>
    </>
  );
}
