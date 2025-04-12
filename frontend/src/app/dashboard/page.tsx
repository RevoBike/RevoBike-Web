'use client";';
import BookingsOverview from "./_components/booking-stats";
import BikeBookings from "./_components/bike-booking";
import DashboardMetrics from "./_components/dashboard-metrics";
import Footer from "./_components/footer";
import CarAvailability from "./_components/left-section";
import RentStatusDashboard from "./_components/rent-status-dashboard";
import Remainder from "./_components/reminder";
import DashboardHeader from "./_components/header";

const DashboardPage = () => {
  return (
    <>
      <div className="flex flex-row w-full">
        <div className="w-4/5">
          <DashboardHeader />
          <div className="flex flex-row gap-4 p-4">
            <div className="w-2/3 flex flex-col gap-4">
              <DashboardMetrics />
              <BookingsOverview />
            </div>
            <div className="w-1/3">
              <RentStatusDashboard />
              <Remainder />
            </div>
          </div>
          <BikeBookings />
        </div>
        <div className="bg-white shadow-lg p-2 rounded-lg h-fit ml-2">
          <CarAvailability />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
