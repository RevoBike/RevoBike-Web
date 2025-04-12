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
  Container,
} from "@mantine/core";
import {
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import StationsMetrics from "./_components/station-metrics";
import EditStationModal from "./_components/update-modal";
import DeleteConfirmationModal from "./_components/delete-modal";
import AddStationModal from "./_components/add-modal";
import StationDetailsModal from "./_components/details-modal";

export default function StationsManagement() {
  const [filter, setFilter] = useState("all");
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 4;

  const [stations, setStations] = useState([
    {
      id: 1,
      name: "Central Park",
      address: "123 Park Ave",
      capacity: 20,
      bikes: 18,
    },
    {
      id: 2,
      name: "Downtown Hub",
      address: "456 Main St",
      capacity: 15,
      bikes: 5,
    },
    {
      id: 3,
      name: "Riverside Stop",
      address: "789 River Rd",
      capacity: 10,
      bikes: 2,
    },
    {
      id: 4,
      name: "Uptown Plaza",
      address: "101 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
    {
      id: 5,
      name: "Uptown Plaza 2",
      address: "102 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
    {
      id: 6,
      name: "Uptown Plaza 3",
      address: "103 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
  ]);

  const filteredStations = stations.filter((station) => {
    const occupancy = (station.bikes / station.capacity) * 100;
    if (filter === "overloaded") return occupancy > 80;
    if (filter === "underloaded") return occupancy < 20;
    if (filter === "normal") return occupancy >= 20 && occupancy <= 80;
    return true;
  });

  interface Station {
    id: number;
    name: string;
    address: string;
    capacity: number;
    bikes: number;
  }

  const handleRowClick = (station: Station): void => {
    setSelectedStation(station);
    setDetailsModalOpened(true);
  };

  const handleEditClick = (station: Station, e: Event) => {
    e.stopPropagation();
    setSelectedStation(station);
    setEditModalOpened(true);
  };

  const handleDeleteClick = (station: Station, e: Event) => {
    e.stopPropagation();
    setSelectedStation(station);
    setDeleteModalOpened(true);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={3}>Stations Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
          className="bg-customBlue text-white hover:bg-customBlue"
        >
          Add Station
        </Button>
      </Group>
      <StationsMetrics />

      <Group mb="md">
        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={[
            { value: "all", label: "All" },
            { value: "overloaded", label: "Overloaded (>80%)" },
            { value: "underloaded", label: "Underloaded (<20%)" },
            { value: "normal", label: "Normal (20-80%)" },
          ]}
          value={filter}
          onChange={(value) => setFilter(value || "all")}
          leftSection={<IconFilter size={16} />}
          style={{ width: "200px" }}
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white text-black",
          }}
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400 ">
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Capacity</Table.Th>
            <Table.Th>Bikes</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredStations.map((station) => {
            const occupancy = (station.bikes / station.capacity) * 100;
            const status =
              occupancy > 80
                ? "Overloaded"
                : occupancy < 20
                ? "Underloaded"
                : "Normal";
            const statusColor =
              occupancy > 80 ? "red" : occupancy < 20 ? "yellow" : "green";

            return (
              <Table.Tr
                key={station.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(station)}
              >
                <Table.Td>{station.id}</Table.Td>
                <Table.Td>{station.name}</Table.Td>
                <Table.Td>{station.address}</Table.Td>
                <Table.Td>{station.capacity}</Table.Td>
                <Table.Td>{station.bikes}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor} variant="light">
                    {status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleEditClick(station, e)}
                    >
                      <IconEdit size={14} color="green" />
                    </Button>
                    |
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleDeleteClick(station, e)}
                    >
                      <IconTrash size={14} color="red" />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-customBlue text-white"
          onClick={() => {
            setPage(Math.max(page - 1, 1));
          }}
          disabled={page === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className={`bg-customBlue text-white`}
          // onClick={() => {
          //   if (!isPlaceholderData && hasNextPage) {
          //     setPage((old) => old + 1);
          //   }
          // }}
          // disabled={isPlaceholderData || !hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>

      {/* <AddStationModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        onAdd={(newStation) =>
          setStations([...stations, { id: stations.length + 1, ...newStation }])
        }
      /> */}
      {/* <EditStationModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        station={selectedStation}
        onUpdate={(updatedStation) =>
          setStations(
            stations.map((s) =>
              s.id === updatedStation.id ? updatedStation : s
            )
          )
        }
      /> */}
      {/* <DeleteConfirmationModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        station={selectedStation}
        onDelete={() =>
          setStations(stations.filter((s) => s.id !== selectedStation?.id))
        }
      /> */}
      {/* <StationDetailsModal
        opened={detailsModalOpened}
        onClose={() => setDetailsModalOpened(false)}
        station={selectedStation}
        onUpdate={(updatedStation) =>
          setStations(
            stations.map((s) =>
              s.id === updatedStation.id ? updatedStation : s
            )
          )
        }
      /> */}
    </Card>
  );
}
