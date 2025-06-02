"use client";

import Link from "next/link";
import { IconChevronRight, IconMenu2, IconX } from "@tabler/icons-react";
import {
  FaTachometerAlt,
  FaBicycle,
  FaUsers,
  FaChargingStation,
  FaKey,
  FaMoneyBill,
  FaTools,
  FaExclamationTriangle,
} from "react-icons/fa";
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
    icon: FaKey,
  },
  {
    link: "/dashboard/settings",
    label: "Payments",
    icon: FaMoneyBill,
  },
  {
    link: "/dashboard/maintenance",
    label: "Maintenance",
    icon: FaTools,
  },
  {
    link: "/dashboard/alerts",
    label: "Alerts",
    icon: FaExclamationTriangle,
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
      className={`block p-2 sm:p-4 ${isActive(
        item.link
      )} hover:text-gray-400 transition-colors rounded-md`}
      key={item.label}
      onClick={close}
    >
      <div className="flex items-center gap-2">
        {item.icon && (
          <item.icon
            className={`${isActive(item.link)} w-5 h-5 sm:w-6 sm:h-6`}
          />
        )}
        <span className="flex flex-row align-middle items-center justify-between w-full text-sm sm:text-base">
          {item.label}
          <IconChevronRight
            stroke={1.5}
            className={`${isActive(item.link)} w-5 h-5 sm:w-6 sm:h-6`}
          />
        </span>
      </div>
    </Link>
  ));

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md shadow-md bg-[#154B1B] md:hidden"
        onClick={() => {
          toggle();
          console.log("Sidebar opened:", opened);
        }}
        aria-label={opened ? "Close menu" : "Open menu"}
        aria-expanded={opened}
      >
        {opened ? (
          <IconX size={20} stroke={1.5} />
        ) : (
          <IconMenu2 size={20} stroke={1.5} />
        )}
      </button>

      {opened && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}
      <nav
        className={`fixed top-0 left-0 h-full bg-[#154B1B] shadow-md flex flex-col z-50 transition-transform duration-300 w-3/4 max-w-[250px] md:static md:w-64 md:max-w-none md:translate-x-0 ${
          opened ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex-1">
          <div className="flex flex-row justify-center align-middle items-center p-2 sm:p-4">
            <h1 className="text-sm sm:text-base font-bold text-white">Admin</h1>
          </div>
          <div className="mt-2 sm:mt-4">{links}</div>
        </div>
      </nav>
    </>
  );
}
