"use client";

import Link from "next/link";
import {
  IconChevronRight,
  IconChevronLeft,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";
import {
  FaTachometerAlt,
  FaBicycle,
  FaUsers,
  FaChargingStation,
  FaKey,
  FaTools,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useDisclosure } from "@mantine/hooks";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const data = [
  { link: "/dashboard", label: "Dashboard", icon: FaTachometerAlt },
  {
    label: "Stations",
    icon: FaChargingStation,
    children: [
      { link: "/dashboard/stations", label: "All Stations" },
      { link: "/dashboard/stations/create", label: "Create Station" },
    ],
  },
  { link: "/dashboard/bikes", label: "Bikes", icon: FaBicycle },
  { link: "/dashboard/users", label: "Users", icon: FaUsers },
  { link: "/dashboard/rentals", label: "Rentals", icon: FaKey },
  { link: "/dashboard/maintenance", label: "Maintenance", icon: FaTools },
  { link: "/dashboard/alerts", label: "Alerts", icon: FaExclamationTriangle },
];

interface SidebarProps {
  onToggle?: (collapsed: boolean) => void;
  isCollapsed?: boolean;
  isMobileDrawerOpen?: boolean;
  onMobileDrawerClose?: () => void;
}

export default function Sidebar({
  onToggle,
  isCollapsed: parentCollapsed = false,
  isMobileDrawerOpen = false,
  onMobileDrawerClose,
}: SidebarProps) {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [isCollapsed, setIsCollapsed] = useState(parentCollapsed);
  const [expanded, setExpanded] = useState<string | null>(null);
  const path = usePathname();

  const isActive = (link: string) =>
    path === link ? "mx-2 bg-white !text-[#154B1B]" : "text-white";

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) onToggle(newCollapsedState);
  };

  const toggleExpanded = (label: string) => {
    setExpanded((prev) => (prev === label ? null : label));
  };

  useEffect(() => {
    if (isMobileDrawerOpen && !opened) toggle();
    else if (!isMobileDrawerOpen && opened) close();
  }, [isMobileDrawerOpen, opened, toggle, close]);

  useEffect(() => {
    setIsCollapsed(parentCollapsed);
  }, [parentCollapsed]);

  const links = data.map((item) => {
    const isItemActive = isActive(item.link || "");

    if (item.children) {
      const isOpen = expanded === item.label;
      return (
        <div key={item.label} className="text-white">
          <button
            onClick={() => toggleExpanded(item.label)}
            className={`w-full text-left block p-2 sm:p-3 ${isItemActive} hover:text-gray-400 transition-colors rounded-md`}
          >
            <div className="flex items-center gap-2">
              <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              {!isCollapsed && (
                <span className="flex-1 text-xs sm:text-sm">{item.label}</span>
              )}
              {!isCollapsed && (
                <IconChevronRight
                  className={`transition-transform duration-200 ${
                    isOpen ? "rotate-90" : ""
                  }`}
                  size={14}
                />
              )}
            </div>
          </button>
          {isOpen && !isCollapsed && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.link}
                  href={child.link}
                  className={`block text-xs sm:text-sm px-2 py-1 rounded-md hover:bg-white/10 ${isActive(
                    child.link
                  )}`}
                  onClick={() => {
                    close();
                    if (onMobileDrawerClose) onMobileDrawerClose();
                  }}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.link}
        className={`block p-2 sm:p-3 ${isItemActive} hover:text-gray-400 transition-colors rounded-md`}
        key={item.label}
        onClick={() => {
          close();
          if (onMobileDrawerClose) onMobileDrawerClose();
        }}
      >
        <div className="flex items-center gap-2">
          <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
          {!isCollapsed && (
            <span className="flex-1 text-xs sm:text-sm">{item.label}</span>
          )}
        </div>
      </Link>
    );
  });

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md shadow-md bg-[#154B1B] md:hidden"
        onClick={() => {
          toggle();
          if (onMobileDrawerClose) onMobileDrawerClose();
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

      <nav
        className={`h-screen bg-[#154B1B] shadow-md flex flex-col z-50 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-full md:w-64"
        } ${
          isMobileDrawerOpen || opened
            ? "fixed top-0 left-0 translate-x-0"
            : "fixed top-0 left-0 -translate-x-full"
        } md:static md:translate-x-0`}
        style={{ zIndex: 1000 }}
      >
        <div className="flex-1">
          <div className="flex flex-row justify-between items-center p-2 sm:p-4">
            {!isCollapsed && (
              <h1 className="text-xs sm:text-base font-bold text-white">
                Admin
              </h1>
            )}
            <button
              className="p-2 rounded-md text-white hover:bg-gray-700 md:block hidden"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <IconChevronRight size={20} stroke={1.5} />
              ) : (
                <IconChevronLeft size={20} stroke={1.5} />
              )}
            </button>
          </div>
          <div className="mt-2 sm:mt-4">{links}</div>
        </div>
      </nav>

      {(isMobileDrawerOpen || opened) && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => {
            close();
            if (onMobileDrawerClose) onMobileDrawerClose();
          }}
        />
      )}
    </>
  );
}
