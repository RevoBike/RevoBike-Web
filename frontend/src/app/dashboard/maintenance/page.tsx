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
  Text,
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
import BikeMetrics from "./_components/maintaienence-metrics";
import EditBikeModal from "./_components/update-modal";
import DeleteBikeModal from "./_components/delete-modal";
import MaintenanceBikeModal from "./_components/maintenance-modal";
import AddBikeModal from "./_components/add-modal";
import BikeDetailsModal from "./_components/details-modal";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetStationsList } from "@/app/api/station-api";
import { GetBikesUnderMaintenance } from "@/app/api/maintenance-api";
import { Bike } from "@/app/interfaces/bike";
import formatDate from "@/app/_utils/format-date";

export default function BikesManagement() {
  const limit = 3;
  const [bikeFilter, setBikeFilter] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBike, setSelectedBike] = useState<string | null>(null);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    detailsModalOpened,
    { open: openDetailsModal, close: closeDetailsModal },
  ] = useDisclosure(false);

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);

  const [
    maintenanceModalOpened,
    { open: openMaintenanceModal, close: closeMaintenanceModal },
  ] = useDisclosure(false);

  const { data: stations } = useQuery({
    queryKey: ["stationsList"],
    queryFn: GetStationsList,
  });
  const {
    data: bikes,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "bikesUnderMaintenance",
      currentPage,
      limit,
      searchTerm,
      bikeFilter,
    ],
    queryFn: () =>
      GetBikesUnderMaintenance(currentPage, limit, searchTerm, bikeFilter),

    placeholderData: keepPreviousData,
  });

  const hasNextPage = bikes && bikes.length === limit;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>{(error as Error).message}</Text>
      </div>
    );
  }

  const handleEditClick = (bike: Bike) => {
    setSelectedBike(bike);
    openUpdateModal();
  };

  const handleDeleteClick = (bike: Bike) => {
    // e.stopPropagation();
    setSelectedBike(bike);
    openDeleteModal();
  };

  const handleRowClick = (bikeId: string): void => {
    setSelectedBike(bikeId);
    openDetailsModal();
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <BikeMetrics />

      <Group mb="md" gap="md">
        <Select
          label="Filter by Station"
          placeholder="Select station"
          data={[{ label: "All", value: "" }, ...(stations?.data || [])]}
          value={bikeFilter}
          onChange={(value) => setBikeFilter(value as string)}
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
            placeholder="Search by ID or model"
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
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400">
            <Table.Th>Bike ID</Table.Th>
            <Table.Th>Model</Table.Th>
            <Table.Th>Station</Table.Th>
            <Table.Th>Last Maintenance</Table.Th>
            <Table.Th>Next Maintenance</Table.Th>
            <Table.Th>Total Rides</Table.Th>
            <Table.Th>Total distance</Table.Th>
            <Table.Th>Created At</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bikes &&
            bikes.map((bike) => (
              <Table.Tr
                key={bike._id}
                onClick={() => handleRowClick(bike._id)}
                style={{ cursor: "pointer" }}
              >
                <Table.Td>{bike._id}</Table.Td>
                <Table.Td>{bike.model}</Table.Td>
                <Table.Td>{bike.currentStation}</Table.Td>

                <Table.Td>{formatDate(bike.lastMaintenance)}</Table.Td>
                <Table.Td>{formatDate(bike.nextMaintenance)}</Table.Td>
                <Table.Td>{bike.totalRides}</Table.Td>
                <Table.Td>{bike.totalDistance}</Table.Td>
                <Table.Td>{formatDate(bike.createdAt)}</Table.Td>

                <Table.Td className="ml-auto">
                  <Button
                    size="xs"
                    variant="subtle"
                    // onClick={(e) => handleMaintenanceClick(bike, e)}
                  >
                    <IconTool size={14} />
                  </Button>
                  |
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => handleEditClick(bike)}
                  >
                    <IconEdit size={14} color="green" />
                  </Button>
                  |
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => handleDeleteClick(bike)}
                  >
                    <IconTrash size={14} color="red" />
                  </Button>
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
          onClose={closeDetailsModal}
          bikeId={selectedBike}
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

      <AddBikeModal opened={addModalOpened} onClose={closeAddModal} />
    </Card>
  );
}
