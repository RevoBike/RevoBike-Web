"use client";

import BookingsOverview from "./_components/booking-stats";
import DashboardMetrics from "./_components/dashboard-metrics";
import Footer from "./_components/footer";
import BikeAvailability from "./_components/left-section";
import RentStatusDashboard from "./_components/rent-status-dashboard";
import Remainder from "./_components/reminder";
import DashboardHeader from "./_components/header";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col w-full md:flex-row">
        <div className="w-full">
          <DashboardHeader />
          <div className="flex flex-col md:flex-row gap-4 p-4">
            <div className="w-full md:w-2/3 flex flex-col gap-4">
              <DashboardMetrics />
              <BookingsOverview />
            </div>
            <div className="w-full md:w-1/3 flex flex-col gap-4">
              <RentStatusDashboard />
              <Remainder />
            </div>
            <div className="w-full md:w-1/3 bg-white shadow-lg p-2 rounded-lg h-fit md:ml-2">
              <BikeAvailability />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
