"use client";

import BookingsOverview from "./_components/booking-stats";
import DashboardMetrics from "./_components/dashboard-metrics";
import BikeAvailability from "./_components/left-section";
import RentStatusDashboard from "./_components/rent-status-dashboard";
import Remainder from "./_components/reminder";
import DashboardHeader from "./_components/header";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="w-full">
          <DashboardHeader />
          <div className="flex flex-col md:flex-row gap-6 p-4">
            <div className="w-full md:w-3/4 flex flex-col gap-6">
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-2/3">
                  <DashboardMetrics />
                </div>
                <div className="w-full md:w-1/3">
                  <RentStatusDashboard />
                </div>
              </div>
              <BookingsOverview />
            </div>
            <div className="w-full md:w-1/4 flex flex-col gap-6 mt-6 md:mt-0">
              <BikeAvailability />
              <Remainder />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
