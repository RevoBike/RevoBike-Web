import BookingsOverview from "./dashboard/booking-stats";
import BikeBookings from "./dashboard/bike-booking";
import DashboardMetrics from "./dashboard/dashboard-metrics";
import Footer from "./dashboard/footer";
import DashboardHeader from "./dashboard/header";
import CarAvailability from "./dashboard/left-section";
import RentStatusDashboard from "./dashboard/rent-status-dashboard";
import Remainder from "./dashboard/reminder";

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
