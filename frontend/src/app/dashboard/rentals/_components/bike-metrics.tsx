"use client";

import { useState } from "react";
import { Card, Group, Text, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
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
  // Add more mock data for variety
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

// Function to aggregate rentals by month
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

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={2}>Rentals Management</Title>
      </Group>

      {/* Yearly Status Chart */}
      <Card withBorder radius="md" padding="md" mb="lg">
        <Text size="lg" fw={600} mb="md">
          Yearly Rental Status (2025)
        </Text>
        <BarChart
          h={300}
          data={chartData}
          series={[
            { name: "Active Rentals", color: "blue" },
            { name: "Completed Rentals", color: "green" },
          ]}
          xAxisProps={{ title: { text: "Month" } }}
          yAxisProps={{ title: { text: "Number of Rentals" } }}
        />
      </Card>
    </Card>
  );
}
