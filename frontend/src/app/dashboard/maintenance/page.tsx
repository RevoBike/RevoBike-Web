"use client";
import { useState } from "react";
import {
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
  IconSearch,
  IconArrowRight,
  IconArrowLeft,
  IconCheck,
} from "@tabler/icons-react";
import BikeMetrics from "./_components/maintaienence-metrics";
import DeleteBikeModal from "./_components/delete-modal";
import DoneBikeMaintenanceModal from "./_components/done-maintenance";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetStationsList } from "@/app/api/station-api";
import { GetBikesUnderMaintenance } from "@/app/api/maintenance-api";
import { Bike } from "@/app/interfaces/bike";
import formatDate from "@/app/_utils/format-date";
import UpdateMaintenanceModal from "./_components/update-modal";
import LoadingPage from "@/app/loading";

export default function BikesManagement() {
  const limit = 5;
  const [bikeFilter, setBikeFilter] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

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
    return <LoadingPage />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>{(error as Error).message}</Text>
      </div>
    );
  }

  const handleMaintenanceClick = (bike: Bike, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBike(bike);
    openMaintenanceModal();
  };

  const handleEditClick = (bike: Bike, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBike(bike);
    openUpdateModal();
  };

  const handleDeleteClick = (bike: Bike, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBike(bike);
    openDeleteModal();
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
      <div className="w-full overflow-x-auto">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400">
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
            {bikes && bikes.length > 0 ? (
              bikes.map((bike) => (
                <Table.Tr key={bike._id} style={{ cursor: "pointer" }}>
                  <Table.Td>{bike.bikeId}</Table.Td>
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
                      onClick={(e) => handleMaintenanceClick(bike, e)}
                    >
                      <IconCheck size={18} />
                    </Button>
                    |
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleEditClick(bike, e)}
                    >
                      <IconEdit size={18} color="green" />
                    </Button>
                    |
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleDeleteClick(bike, e)}
                    >
                      <IconTrash size={18} color="red" />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={9}>
                  <div className="flex flex-col items-center justify-center py-8">
                    <Text c="dimmed" mt="sm">
                      No bikes under maintenance found.
                    </Text>
                  </div>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      {bikes && bikes.length > 0 && (
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
            className={`bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600`}
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
      )}
      <UpdateMaintenanceModal
        opened={updateModalOpened}
        onClose={closeUpdateModal}
        bike={selectedBike}
      />
      <DeleteBikeModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        bike={selectedBike}
      />
      <DoneBikeMaintenanceModal
        opened={maintenanceModalOpened}
        onClose={closeMaintenanceModal}
        bike={selectedBike}
      />
    </Card>
  );
}
