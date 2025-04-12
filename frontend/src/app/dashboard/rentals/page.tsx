"use client";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Table,
  Title,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconFilter,
  IconTool,
  IconPlus,
} from "@tabler/icons-react";
import BikeMetrics from "./_components/bike-metrics";
import EditBikeModal from "./_components/update-modal";
import DeleteBikeModal from "./_components/delete-modal";
import MaintenanceBikeModal from "./_components/maintenance-modal";
import AddBikeModal from "./_components/add-modal";
import BikeDetailsModal from "./_components/details-modal";

export default function RentalManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [stationFilter, setStationFilter] = useState("all");
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [maintenanceModalOpened, setMaintenanceModalOpened] = useState(false);

  const rentals = [
    {
      id: "RENT001",
      bikeId: "BK001",
      userId: "USR001",
      startDate: "2025-03-15",
      endDate: "2025-03-20",
      status: "Active",
      amount: 50,
    },

    {
      id: "RENT002",
      bikeId: "BK002",
      userId: "USR002",
      startDate: "2025-03-10",
      endDate: "2025-03-15",
      status: "Completed",
      amount: 30,
    },
    {
      id: "RENT003",
      bikeId: "BK003",
      userId: "USR003",
      startDate: "2025-03-05",
      endDate: "2025-03-10",
      status: "Cancelled",
      amount: 0,
    },
    {
      id: "RENT004",
      bikeId: "BK004",
      userId: "USR004",
      startDate: "2025-03-20",
      endDate: "2025-03-25",
      status: "Active",
      amount: 70,
    },
  ];

  const stations = [
    "Central Park",
    "Downtown Hub",
    "Riverside Stop",
    "Uptown Plaza",
  ];

  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus =
      statusFilter === "all" || rental.status.toLowerCase() === statusFilter;
    const matchesDate =
      stationFilter === "all" || rental.endDate === stationFilter;

    return matchesStatus && matchesDate;
  });

  interface Rental {
    id: string;
    bikeId: string;
    userId: string;
    startDate: string;
    endDate: string;
    status: string;
    amount: number;
  }

  interface Event {
    stopPropagation: () => void;
  }

  const handleEditClick = (bike: Bike, e: Event) => {
    e.stopPropagation();
    setSelectedBike(bike);
    setEditModalOpened(true);
  };

  const handleDeleteClick = (bike: Bike, e: Event) => {
    e.stopPropagation();
    setSelectedBike(bike);
    setDeleteModalOpened(true);
  };

  interface MaintenanceClickEvent extends Event {
    stopPropagation: () => void;
  }

  const handleMaintenanceClick = (bike: Bike, e: MaintenanceClickEvent) => {
    e.stopPropagation();
    setSelectedBike(bike);
    setMaintenanceModalOpened(true);
  };

  const handleRowClick = (bike: Bike) => {
    setSelectedBike(bike);
    setDetailsModalOpened(true);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={3}>Rentals Management</Title>
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
            <Table.Th>Rental ID</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Bike</Table.Th>
            <Table.Th>Start Station</Table.Th>
            <Table.Th>End Station</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Amount Charged</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rentals.map((rental) => (
            <Table.Tr
              key={rental.id}
              onClick={() => handleRowClick(rental)}
              style={{ cursor: "pointer" }}
            >
              <Table.Td>{rental.id}</Table.Td>
              <Table.Td>{rental.userId}</Table.Td>
              <Table.Td>{rental.bikeId}</Table.Td>
              <Table.Td>{rental.startDate}</Table.Td>
              <Table.Td>{rental.endDate}</Table.Td>
              <Table.Td>
                <Badge
                  color={
                    rental.status === "Available"
                      ? "green"
                      : rental.status === "Rented"
                      ? "blue"
                      : "yellow"
                  }
                  variant="light"
                >
                  {rental.status}
                </Badge>
              </Table.Td>
              <Table.Td>{rental.amount}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      {selectedBike && (
        <BikeDetailsModal
          opened={detailsModalOpened}
          onClose={() => setDetailsModalOpened(false)}
          bike={selectedBike}
        />
      )}
      {/* <EditBikeModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        bike={selectedBike}
        onUpdate={(updatedStation) =>
          setSelectedBike(
            stations.map((s) =>
              s.id === updatedStation.id ? updatedStation : s
            )
          )
        }
      /> */}
      {/* <DeleteBikeModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        bike={selectedBike}
        onDelete={() =>
          setSelectedBike(stations.filter((s) => s.id !== selectedBike?.id))
        }
      /> */}

      {/* <MaintenanceBikeModal
        opened={maintenanceModalOpened}
        onClose={() => setMaintenanceModalOpened(false)}
        bike={selectedBike}
        onDelete={() =>
          setSelectedBike(stations.filter((s) => s.id !== selectedBike?.id))
        }
        onSchedule={(data) => console.log("Maintenance Scheduled:", data)}
      /> */}
      {/* 
      <AddBikeModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        // onAdd={(newStation) =>
        //   ([...stations, { id: stations.length + 1, ...newStation }])
        // }
      /> */}
    </Card>
  );
}
