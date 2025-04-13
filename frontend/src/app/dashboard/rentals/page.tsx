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
  Title,
  DatePickerInput,
} from "@mantine/core";
import { IconFilter, IconCreditCard, IconX } from "@tabler/icons-react";
import { BarChart } from "@mantine/charts";

// Function to aggregate rentals by month for the chart
const aggregateRentalsByMonth = (rentals) => {
  const months = Array(12)
    .fill(0)
    .map(() => ({ active: 0, completed: 0 }));
  rentals.forEach((rental) => {
    const month = new Date(rental.startTime).getMonth(); // 0-11 (Jan-Dec)
    if (rental.status === "Active") {
      months[month].active += 1;
    } else if (rental.status === "Completed") {
      months[month].completed += 1;
    }
  });
  return months;
};

export default function RentalsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);

  // Mock rental data
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
    },
  ];

  // Aggregate data for the chart
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
    <Card
      padding="lg"
      radius="md"
      withBorder
      style={{ backgroundColor: "#2b2c31", color: "white" }} // Dark theme
    >
      <Group justify="space-between" mb="md">
        <Title order={2} c="white">
          Rentals Management
        </Title>
      </Group>

      {/* Yearly Status Chart */}
      <Card
        withBorder
        radius="md"
        padding="md"
        mb="lg"
        style={{ backgroundColor: "#343a40" }}
      >
        <Text size="lg" fw={600} mb="md" c="white">
          Yearly Rental Status (2025)
        </Text>
        {/* <BarChart
          h={300}
          data={chartData}
          series={[
            { name: "Active Rentals", color: "blue.6" },
            { name: "Completed Rentals", color: "green.6" },
          ]}
          xAxisProps={{ title: { text: "Month", style: { color: "#98a2b3" } } }}
          yAxisProps={{
            title: { text: "Number of Rentals", style: { color: "#98a2b3" } },
          }}
          style={{ color: "#98a2b3" }}
        /> */}
      </Card>

      {/* Filters */}
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
          onChange={setStatusFilter}
          leftSection={<IconFilter size={16} />}
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
        {/* <DatePickerInput
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
        <DatePickerInput
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
        /> */}
        <Button
          variant="subtle"
          color="gray.4"
          leftSection={<IconX size={16} />}
          onClick={clearFilters}
        >
          Clear Filters
        </Button>
      </Group>

      {/* Rentals Table */}
      <Table highlightOnHover withTableBorder style={{ color: "white" }}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th style={{ color: "#98a2b3" }}>Rental ID</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>User</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>Bike</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>Start Station</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>End Station</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>Start Time</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>End Time</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>Status</Table.Th>
            <Table.Th style={{ color: "#98a2b3" }}>Amount Charged</Table.Th>
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
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Payment Details Modal */}
      {selectedRental && (
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
        </Modal>
      )}
    </Card>
  );
}
