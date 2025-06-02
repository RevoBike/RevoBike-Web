"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Table,
  Text,
  TextInput,
  Container,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconFilter,
  IconSearch,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import LineGraph from "./_components/rental-metrics";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetRides } from "@/app/api/rental";
import formatDate from "@/app/_utils/format-date";

const aggregateRentalsByMonth = (rentals) => {
  // const months = Array(12)
  //   .fill(0)
  //   .map(() => ({ active: 0, completed: 0 }));
  // rentals.forEach((rental) => {
  //   const month = new Date(rental.startTime).getMonth();
  //   if (rental.status === "Active") {
  //     months[month].active += 1;
  //   } else if (rental.status === "Completed") {
  //     months[month].completed += 1;
  //   }
  // });
  // return months;
  return [];
};

export default function RentalsManagement() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const {
    data: rentals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rides", currentPage, limit, searchTerm, statusFilter],
    queryFn: () => GetRides(currentPage, limit, searchTerm, statusFilter),

    placeholderData: keepPreviousData,
  });

  const hasNextPage = rentals && rentals.length === limit;

  const monthlyData = aggregateRentalsByMonth(rentals);

  // Chart data
  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Active Rentals",
        data: monthlyData && monthlyData.map((m) => m.active),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
      },
      {
        label: "Completed Rentals",
        data: monthlyData && monthlyData.map((m) => m.completed),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green
      },
    ],
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Card withBorder radius="md" padding="md" mb="lg">
        <Text size="lg" fw={600} mb="md" c="black">
          Yearly Rental Status (2025)
        </Text>
        <LineGraph rentals={monthlyData} />
      </Card>

      <Group mb="md" gap="md" align="flex-end">
        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
          ]}
          value={statusFilter}
          onChange={(value) =>
            setStatusFilter((value as "all" | "active" | "completed") || "all")
          }
          leftSection={<IconFilter size={16} />}
          className="w-full sm:w-[200px]"
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white text-black",
            label: "text-gray-800 text-sm",
          }}
        />
        <div>
          <div className="flex gap-3">
            <DatePickerInput
              label="Start date"
              placeholder="Select date"
              minDate={new Date()}
              radius="md"
              styles={{
                label: {
                  color: "#495057",
                  fontWeight: 500,
                  marginBottom: "6px",
                },
                input: {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#ced4da",
                  "&:focus": {
                    borderColor: "#868e96",
                    boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
                  },
                },
                error: { color: "#f03e3e" },
              }}
              style={{ width: "50%" }}
            />

            <DatePickerInput
              label="End date"
              placeholder="Select date"
              minDate={new Date()}
              radius="md"
              styles={{
                label: {
                  color: "#495057",
                  fontWeight: 500,
                  marginBottom: "6px",
                },
                input: {
                  backgroundColor: "#f8f9fa",
                  borderColor: "#ced4da",
                  "&:focus": {
                    borderColor: "#868e96",
                    boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
                  },
                },
                error: { color: "#f03e3e" },
              }}
              style={{ width: "50%" }}
            />
          </div>
        </div>
        <div className="w-full sm:w-auto md:mt-4 ml-auto">
          <TextInput
            placeholder="Search by User or Bike ID"
            leftSection={<IconSearch color="#7E7E7E" size={20} />}
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400">
            <Table.Th>User</Table.Th>
            <Table.Th>Bike</Table.Th>
            <Table.Th>Start Station</Table.Th>
            <Table.Th>End Station</Table.Th>
            <Table.Th>Start Time</Table.Th>
            <Table.Th>End Time</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Payment Status</Table.Th>
            <Table.Th>Amount Charged</Table.Th>
            <Table.Th>Distance Covered</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rentals &&
            rentals.map((rental) => (
              <Table.Tr key={rental._id}>
                <Table.Td>{rental.user && rental.user.name}</Table.Td>
                <Table.Td>{rental.bike.bikeId}</Table.Td>
                <Table.Td>{rental.startStationName || "N/A"}</Table.Td>
                <Table.Td>{rental.endStationName || "N/A"}</Table.Td>
                <Table.Td>{formatDate(rental.startTime)}</Table.Td>
                <Table.Td>{formatDate(rental.endTime) || "N/A"}</Table.Td>
                <Table.Td>
                  <Badge
                    color={rental.status === "active" ? "blue.6" : "green.6"}
                    variant="light"
                  >
                    {rental.status}
                  </Badge>
                </Table.Td>

                <Table.Td>
                  <Badge
                    color={
                      rental.paymentStatus === "pending"
                        ? "yellow.6"
                        : rental.paymentStatus === "paid"
                        ? "green.6"
                        : "red.6"
                    }
                    variant="light"
                  >
                    {rental.paymentStatus}
                  </Badge>
                </Table.Td>
                <Table.Td>{rental.cost.toFixed(2)} Birr</Table.Td>
                <Table.Td>{rental.distance} km</Table.Td>
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>

      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600"
          variant="small"
          onClick={() => {
            setCurrentPage(Math.max(currentPage - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className="bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600"
          onClick={() => {
            if (hasNextPage) {
              setCurrentPage((old) => old + 1);
            }
          }}
          disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>
    </Card>
  );
}
