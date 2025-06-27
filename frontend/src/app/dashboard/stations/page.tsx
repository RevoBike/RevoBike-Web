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
  IconFilter,
  IconPlus,
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
  IconEdit,
  IconTrash,
  IconMapPin,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetStations } from "@/app/api/station-api";
import { useDisclosure } from "@mantine/hooks";
import formatDate from "@/app/_utils/format-date";

import StationsMetrics from "./_components/station-metrics";
import AddStationModal from "./_components/add-modal";
import UpdateStationModal from "./_components/update-modal";
import DeleteConfirmationModal from "./_components/delete-modal";
import { Station } from "@/app/interfaces/station";
import { useCheckRole } from "@/app/_utils/check-role";
import LoadingPage from "@/app/loading";

const StationMapModal = dynamic(() => import("./_components/map-modal"), {
  ssr: false,
});

const StationDetailsModal = dynamic(
  () => import("./_components/details-modal"),
  {
    ssr: false,
  }
);

export default function StationsManagement() {
  const isSuperAdmin = useCheckRole();
  const limit = 10;
  const [filter, setFilter] = useState<
    "all" | "normal" | "overloaded" | "underloaded"
  >("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const [mapModalOpened, { open: openMapModal, close: closeMapModal }] =
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

  const handleEditClick = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStation(station);
    openUpdateModal();
  };

  const handleDeleteClick = (station: Station, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStation(station);
    openDeleteModal();
  };

  const {
    data: stations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stations", currentPage, limit, searchTerm, filter],
    queryFn: () =>
      GetStations(
        currentPage,
        limit,
        searchTerm,
        filter === "all" ? undefined : filter.toLowerCase()
      ),
    placeholderData: keepPreviousData,
  });

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

  const hasNextPage = stations && stations.length === limit;

  const handleRowClick = (station: Station): void => {
    setSelectedStation(station);
    openDetailsModal();
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="between" mb="sm">
        <div className="flex items-center gap-1" onClick={openMapModal}>
          <IconMapPin
            size={24}
            color="#154B1B"
            className="hover:cursor-pointer"
          />
          <Text className="text-[#154B1B] hover:cursor-pointer hover:text-green-600">
            View Map
          </Text>
        </div>

        {isSuperAdmin && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddModal}
            className="bg-[#154B1B] text-white hover:bg-green-600 ml-auto"
          >
            Add Station
          </Button>
        )}
      </Group>
      <StationsMetrics />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
        <div className="w-full sm:w-auto">
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
            onChange={(value) => {
              setFilter(
                (value as "all" | "normal" | "overloaded" | "underloaded") ||
                  "all"
              );
              setCurrentPage(1);
            }}
            leftSection={<IconFilter size={16} />}
            className="w-full sm:w-[200px]"
            classNames={{
              input: "text-gray-800",
              dropdown: "bg-white text-black",
              label: "text-gray-800 text-sm",
            }}
          />
        </div>

        <div className="w-full sm:w-auto md:mt-4">
          <TextInput
            placeholder="Search by station name"
            leftSection={<IconSearch color="#7E7E7E" size={20} />}
            value={searchTerm}
            onChange={(event) => {
              setSearchTerm(event.currentTarget.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <Table highlightOnHover className="min-w-full md:table-hidden">
          <Table.Thead>
            <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400 ">
              <Table.Th>Name</Table.Th>
              <Table.Th>Address</Table.Th>
              <Table.Th>Capacity</Table.Th>
              <Table.Th>Bikes</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
              {isSuperAdmin && <Table.Th>Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {stations && stations.length > 0 ? (
              stations.map((station) => {
                const occupancy =
                  station && station.totalSlots && station.totalSlots > 0
                    ? (station.available_bikes.length / station.totalSlots) *
                      100
                    : 0;
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
                    key={station._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(station)}
                  >
                    <Table.Td>{station.name}</Table.Td>
                    <Table.Td>{station.address}</Table.Td>
                    <Table.Td>{station.totalSlots || 0}</Table.Td>
                    <Table.Td>
                      {(station.available_bikes &&
                        station.available_bikes.length) ||
                        0}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={statusColor} variant="light">
                        {status}
                      </Badge>
                    </Table.Td>
                    <Table.Td>{formatDate(station.createdAt)}</Table.Td>
                    {isSuperAdmin && (
                      <Table.Td className="ml-auto">
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={(e) => handleEditClick(station, e)}
                        >
                          <IconEdit size={18} color="green" />
                        </Button>
                        |
                        <Button
                          size="xs"
                          variant="subtle"
                          onClick={(e) => handleDeleteClick(station, e)}
                        >
                          <IconTrash size={18} color="red" />
                        </Button>
                      </Table.Td>
                    )}
                  </Table.Tr>
                );
              })
            ) : (
              <Table.Tr>
                <Table.Td colSpan={isSuperAdmin ? 7 : 6}>
                  <div className="flex flex-col items-center justify-center py-8">
                    <IconMapPin size={40} color="#f03e3e" />
                    <Text c="dimmed" mt="sm">
                      No stations found.
                    </Text>
                  </div>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      {stations && stations.length > 0 && (
        <Container className="flex flex-row justify-center items-center gap-2 mt-5">
          <Button
            className="bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600 "
            variant="small"
            onClick={() => {
              setCurrentPage(Math.max(currentPage - 1, 1));
            }}
            disabled={currentPage === 1}
          >
            <IconArrowLeft />
          </Button>
          <Button
            className={`bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600 `}
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
      <AddStationModal opened={addModalOpened} onClose={closeAddModal} />
      <StationMapModal opened={mapModalOpened} onClose={closeMapModal} />
      <StationDetailsModal
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
        station={selectedStation}
        setSelectedStation={setSelectedStation}
      />
      <UpdateStationModal
        opened={updateModalOpened}
        onClose={closeUpdateModal}
        station={selectedStation}
      />
      <DeleteConfirmationModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        station={{ id: selectedStation?._id, name: selectedStation?.name }}
      />
    </Card>
  );
}
