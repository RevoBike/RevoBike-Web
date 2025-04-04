import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/SideBar";
import NavBar from "../../components/NavBar";
import BikesPage from "../../components/BikesPage";
import DashboardPage from "../../components/DashboardPage";
import UsersPage from "../../components/UsersPage";
import SettingsPage from "../../components/SettingsPage";
import StationsPage from "../../components/StationsPage";

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col my-4">
        {/* <NavBar /> */}

        <div className="flex-1 overflow-y-auto p-4">
          {/* <DashboardPage /> */}
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/stations" element={<StationsPage />} />
            <Route path="/bikes" element={<BikesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
