"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Container,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import {
  IconFilter,
  IconSearch,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import LineGraph from "./_components/rental-metrics";

const aggregateRentalsByMonth = (rentals) => {
  const months = Array(12)
    .fill(0)
    .map(() => ({ active: 0, completed: 0 }));
  rentals.forEach((rental) => {
    const month = new Date(rental.startTime).getMonth();
    if (rental.status === "Active") {
      months[month].active += 1;
    } else if (rental.status === "Completed") {
      months[month].completed += 1;
    }
  });
  return months;
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
  const rentals = [
    {
      id: "R001",
      user: "John Doe",
      bike: "BK001",
      startStation: "Central Park",
      endStation: "Downtown Hub",
      startTime: "2025-04-08 09:00",
      endTime: "2025-04-08 10:30",
      status: "Completed",
      amountCharged: 15.5,
      distance: 5.2,
    },
    {
      id: "R002",
      user: "Jane Smith",
      bike: "BK002",
      startStation: "Riverside Stop",
      endStation: null,
      startTime: "2025-04-09 14:00",
      endTime: null,
      status: "Active",
      amountCharged: 0,
      distance: 5.2,
    },
    {
      id: "R003",
      user: "Mike Johnson",
      bike: "BK003",
      startStation: "Uptown Plaza",
      endStation: "Central Park",
      startTime: "2025-04-07 16:00",
      endTime: "2025-04-07 17:15",
      status: "Completed",
      amountCharged: 12.75,
      distance: 5.2,
    },
    {
      id: "R004",
      user: "Alice Brown",
      bike: "BK004",
      startStation: "Downtown Hub",
      endStation: "Riverside Stop",
      startTime: "2025-03-15 10:00",
      endTime: "2025-03-15 11:00",
      status: "Completed",
      amountCharged: 10.0,
      distance: 5.2,
    },
    {
      id: "R005",
      user: "Bob White",
      bike: "BK005",
      startStation: "Central Park",
      endStation: null,
      startTime: "2025-05-01 08:00",
      endTime: null,
      status: "Active",
      amountCharged: 0,
      distance: 5.2,
    },
  ];

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
        data: monthlyData.map((m) => m.active),
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Blue
      },
      {
        label: "Completed Rentals",
        data: monthlyData.map((m) => m.completed),
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Green
      },
    ],
  };

  // Filter logic for table
  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus =
      statusFilter === "all" || rental.status.toLowerCase() === statusFilter;
    const rentalStart = new Date(rental.startTime.split(" ")[0]);
    const matchesDate =
      (!startDate || rentalStart >= new Date(startDate)) &&
      (!endDate || rentalStart <= new Date(endDate));
    return matchesStatus && matchesDate;
  });

  // Handle row click to show details
  const handleRowClick = (rental) => {
    setSelectedRental(rental);
    setDetailsModalOpened(true);
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
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
        {/* <Text size="sm" c="gray.4">
          <IconFilter size={16} style={{ marginRight: "5px" }} />
          Filter by Date:
        </Text> */}

        {/* <DateTimePicker
          label="Start Date"
          placeholder="Pick start date"
          value={startDate}
          onChange={setStartDate}
          maxDate={new Date()}
          styles={{
            input: {
              backgroundColor: "#343a40",
              color: "white",
              borderColor: "#495057",
            },
            label: { color: "#98a2b3" },
          }}
          style={{ width: "200px" }}
        />
        <DateTimePicker
          label="End Date"
          placeholder="Pick end date"
          value={endDate}
          onChange={setEndDate}
          maxDate={new Date()}
          minDate={startDate}
          styles={{
            input: {
              backgroundColor: "#343a40",
              color: "white",
              borderColor: "#495057",
            },
            label: { color: "#98a2b3" },
          }}
          style={{ width: "200px" }}
        />
        <Button
          variant="subtle"
          color="gray.4"
          leftSection={<IconX size={16} />}
          onClick={clearFilters}
        >
          Clear Filters
        </Button> */}
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400">
            <Table.Th>Rental ID</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Bike</Table.Th>
            <Table.Th>Start Station</Table.Th>
            <Table.Th>End Station</Table.Th>
            <Table.Th>Start Time</Table.Th>
            <Table.Th>End Time</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Amount Charged</Table.Th>
            <Table.Th>Distance Covered</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredRentals.map((rental) => (
            <Table.Tr
              key={rental.id}
              onClick={() => handleRowClick(rental)}
              style={{ cursor: "pointer" }}
            >
              <Table.Td>{rental.id}</Table.Td>
              <Table.Td>{rental.user}</Table.Td>
              <Table.Td>{rental.bike}</Table.Td>
              <Table.Td>{rental.startStation}</Table.Td>
              <Table.Td>{rental.endStation || "N/A"}</Table.Td>
              <Table.Td>{rental.startTime}</Table.Td>
              <Table.Td>{rental.endTime || "N/A"}</Table.Td>
              <Table.Td>
                <Badge
                  color={rental.status === "Active" ? "blue.6" : "green.6"}
                  variant="light"
                >
                  {rental.status}
                </Badge>
              </Table.Td>
              <Table.Td>${rental.amountCharged.toFixed(2)}</Table.Td>
              <Table.Td>{rental.distance} km</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-customBlue text-white w-fit h-fit p-2"
          variant="small"
          onClick={() => {
            setCurrentPage(Math.max(currentPage - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className={`bg-customBlue text-white w-fit h-fit p-2`}
          onClick={() => {
            // if (hasNextPage) {
            //   setCurrentPage((old) => old + 1);
            // }
          }}
          // disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>

      {/* {selectedRental && (
        <Modal
          opened={detailsModalOpened}
          onClose={() => setDetailsModalOpened(false)}
          title={
            <Text fw={700} c="white">
              Payment Details: {selectedRental.id}
            </Text>
          }
          centered
          size="md"
          styles={{
            header: { backgroundColor: "#343a40", color: "white" },
            body: { backgroundColor: "#2b2c31", color: "white" },
          }}
        >
          <Stack gap="md">
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Rental ID:
              </Text>
              <Text size="sm" fw={500}>
                {selectedRental.id}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                User:
              </Text>
              <Text size="sm" fw={500}>
                {selectedRental.user}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Amount Charged:
              </Text>
              <Text size="sm" fw={500}>
                ${selectedRental.amountCharged.toFixed(2)}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Payment Method:
              </Text>
              <Text size="sm" fw={500}>
                Credit Card
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Transaction ID:
              </Text>
              <Text size="sm" fw={500}>
                TXN-{selectedRental.id}-001
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Payment Date:
              </Text>
              <Text size="sm" fw={500}>
                {selectedRental.endTime || "Pending"}
              </Text>
            </Group>
            <Group justify="space-between">
              <Text size="sm" c="gray.4">
                Status:
              </Text>
              <Badge
                color={
                  selectedRental.amountCharged > 0 ? "green.6" : "yellow.6"
                }
                variant="light"
              >
                {selectedRental.amountCharged > 0 ? "Paid" : "Pending"}
              </Badge>
            </Group>
          </Stack>
        </Modal> */}
      {/* )} */}
    </Card>
  );
}
