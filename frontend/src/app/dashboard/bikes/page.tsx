"use client";
import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Table,
  TextInput,
  Container,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconFilter,
  IconTool,
  IconPlus,
  IconSearch,
  IconArrowRight,
  IconArrowLeft,
} from "@tabler/icons-react";
import BikeMetrics from "./_components/bike-metrics";
import EditBikeModal from "./_components/update-modal";
import DeleteBikeModal from "./_components/delete-modal";
import MaintenanceBikeModal from "./_components/maintenance-modal";
import AddBikeModal from "./_components/add-modal";
import BikeDetailsModal from "./_components/details-modal";

export default function BikesManagement() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "normal" | "overloaded" | "underloaded"
  >("all");

  const [stationFilter, setStationFilter] = useState<
    "all" | "Central Park" | "Downtown Hub" | "Riverside Stop" | "Uptown Plaza"
  >("all");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [addModalOpened, setAddModalOpened] = useState(false);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [maintenanceModalOpened, setMaintenanceModalOpened] = useState(false);

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

  const limit = 4;
  const hasNextPage = bikes && bikes.length === limit;

  interface Bike {
    id: string;
    type: string;
    station: string;
    status: string;
    lastMaintained: string;
    lastRented: string;
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
      <Group justify="end" mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
          className="bg-customBlue text-white hover:bg-blue-950"
        >
          Add Bike
        </Button>
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
          // onChange={setStatusFilter}
          leftSection={<IconFilter size={16} />}
          className="w-full sm:w-[200px]"
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white text-black",
            label: "text-gray-800 text-sm",
          }}
        />
        <Select
          label="Filter by Station"
          placeholder="Select station"
          data={[
            { value: "all", label: "All" },
            ...stations.map((station) => ({ value: station, label: station })),
          ]}
          value={stationFilter}
          // onChange={setStationFilter}
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
            placeholder="Search by bike ID or type"
            leftSection={<IconSearch color="#7E7E7E" size={20} />}
            value={searchTerm}
            // onChange={(event) => {
            //   setSearchTerm(event.currentTarget.value);
            //   setCurrentPage(1);
            // }}
          />
        </div>
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400">
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
                    onClick={(e) => handleMaintenanceClick(bike, e)}
                  >
                    <IconTool size={14} />
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={(e) => handleEditClick(bike, e)}
                  >
                    <IconEdit size={14} color="green" />
                  </Button>
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={(e) => handleDeleteClick(bike, e)}
                  >
                    <IconTrash size={14} color="red" />
                  </Button>
                </Group>
              </Table.Td>
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
            if (hasNextPage) {
              setCurrentPage((old) => old + 1);
            }
          }}
          disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>

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

      <AddBikeModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        // onAdd={(newStation) =>
        //   ([...stations, { id: stations.length + 1, ...newStation }])
        // }
      />
    </Card>
  );
}
