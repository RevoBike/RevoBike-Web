"use client";

import Sidebar from "./sideBar";
import Header from "./header";
import { useState } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSidebarToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  const handleMobileDrawerToggle = () => {
    setIsMobileDrawerOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#FAFBFF] min-h-screen">
      <div
        className={`flex-shrink-0 transition-all duration-300 ${
          isSidebarCollapsed ? "w-16" : "w-full md:w-64"
        } ${
          isMobileDrawerOpen || (!isMobileDrawerOpen && !isSidebarCollapsed)
            ? "block"
            : "hidden md:block"
        }`}
      >
        <Sidebar
          onToggle={handleSidebarToggle}
          isCollapsed={isSidebarCollapsed}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onMobileDrawerClose={() => setIsMobileDrawerOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <Header
          onMobileDrawerToggle={handleMobileDrawerToggle}
          isMobileDrawerOpen={isMobileDrawerOpen}
        />
        <main className="p-2 md:p-4 lg:p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
