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
} from "@mantine/core";
import { IconEdit, IconTrash, IconFilter, IconTool } from "@tabler/icons-react";
import BikeMetrics from "./bikes/bike-metrics";

export default function BikesManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);

  const bikes = [
    {
      id: "BK001",
      type: "Bike",
      station: "Central Park",
      status: "Available",
      lastMaintained: "2025-03-15",
      lastRented: "2025-03-15",
    },
    {
      id: "BK002",
      type: "Scooter",
      station: "Downtown Hub",
      status: "Rented",
      lastMaintained: "2025-02-28",
      lastRented: "2025-03-15",
    },
    {
      id: "BK003",
      type: "Bike",
      station: "Riverside Stop",
      status: "Maintenance",
      lastMaintained: "2025-03-10",
      lastRented: "2025-03-15",
    },
    {
      id: "BK004",
      type: "Scooter",
      station: "Uptown Plaza",
      status: "Available",
      lastMaintained: "2025-03-20",
      lastRented: "2025-03-15",
    },
  ];

  const stations = [
    "Central Park",
    "Downtown Hub",
    "Riverside Stop",
    "Uptown Plaza",
  ];

  const filteredBikes = bikes.filter((bike) => {
    const matchesStatus =
      statusFilter === "all" || bike.status.toLowerCase() === statusFilter;
    const matchesStation =
      stationFilter === "all" || bike.station === stationFilter;
    return matchesStatus && matchesStation;
  });

  const handleRowClick = (bike) => {
    setSelectedBike(bike);
    setDetailsModalOpened(true);
  };

  const handleMaintenance = (bike) => {
    console.log("Schedule maintenance for:", bike.id);
  };

  const handleChangeStation = (bike) => {
    console.log("Change station for:", bike.id);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={3}>Bikes Management</Title>
      </Group>
      <BikeMetrics />

      <Group mb="md" gap="md">
        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={[
            { value: "all", label: "All" },
            { value: "available", label: "Available" },
            { value: "rented", label: "Rented" },
            { value: "maintenance", label: "Maintenance" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
          leftSection={<IconFilter size={16} />}
          style={{ width: "200px" }}
        />
        <Select
          label="Filter by Station"
          placeholder="Select station"
          data={[
            { value: "all", label: "All" },
            ...stations.map((station) => ({ value: station, label: station })),
          ]}
          value={stationFilter}
          onChange={setStationFilter}
          leftSection={<IconFilter size={16} />}
          style={{ width: "200px" }}
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Bike ID</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Station</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Last Maintained</Table.Th>
            <Table.Th>Last Rented</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredBikes.map((bike) => (
            <Table.Tr
              key={bike.id}
              onClick={() => handleRowClick(bike)}
              style={{ cursor: "pointer" }}
            >
              <Table.Td>{bike.id}</Table.Td>
              <Table.Td>{bike.type}</Table.Td>
              <Table.Td>{bike.station}</Table.Td>
              <Table.Td>
                <Badge
                  color={
                    bike.status === "Available"
                      ? "green"
                      : bike.status === "Rented"
                      ? "blue"
                      : "yellow"
                  }
                  variant="light"
                >
                  {bike.status}
                </Badge>
              </Table.Td>
              <Table.Td>{bike.lastMaintained}</Table.Td>
              <Table.Td>{bike.lastRented}</Table.Td>

              <Table.Td>
                <Group>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaintenance(bike);
                    }}
                  >
                    <IconTool size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaintenance(bike);
                    }}
                  >
                    <IconEdit size={14} color="green" />
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMaintenance(bike);
                    }}
                  >
                    <IconTrash size={14} color="red" />
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {/* Bike Details Modal */}
      {selectedBike && (
        <BikeDetailsModal
          opened={detailsModalOpened}
          onClose={() => setDetailsModalOpened(false)}
          bike={selectedBike}
        />
      )}
    </Card>
  );
}

// Bike Details Modal Component
function BikeDetailsModal({ opened, onClose, bike }) {
  // Mock history data
  const history = [
    { date: "2025-03-15", event: "Maintenance", details: "Brake repair" },
    { date: "2025-03-10", event: "Rental", details: "Rented by John Doe" },
    { date: "2025-03-05", event: "Battery", details: "Battery replaced, 100%" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Bike Details: {bike.id}</Text>}
      centered
      size="lg"
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm">
            Type:{" "}
            <Text span fw={500}>
              {bike.type}
            </Text>
          </Text>
          <Text size="sm">
            Station:{" "}
            <Text span fw={500}>
              {bike.station}
            </Text>
          </Text>
          <Text size="sm">
            Status:{" "}
            <Badge
              color={
                bike.status === "Available"
                  ? "green"
                  : bike.status === "Rented"
                  ? "blue"
                  : "yellow"
              }
            >
              {bike.status}
            </Badge>
          </Text>
        </Group>
        <Text size="sm">
          Last Maintained:{" "}
          <Text span fw={500}>
            {bike.lastMaintained}
          </Text>
        </Text>

        <Title order={4} mt="md">
          History
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Date</Table.Th>
              <Table.Th>Event</Table.Th>
              <Table.Th>Details</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {history.map((entry, index) => (
              <Table.Tr key={index}>
                <Table.Td>{entry.date}</Table.Td>
                <Table.Td>{entry.event}</Table.Td>
                <Table.Td>{entry.details}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    </Modal>
  );
}
