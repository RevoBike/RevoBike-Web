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
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconArrowLeft,
  IconArrowRight,
  IconSearch,
} from "@tabler/icons-react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetStations } from "@/app/api/station-api";
import { useDisclosure } from "@mantine/hooks";

import StationsMetrics from "./_components/station-metrics";
import EditStationModal from "./_components/update-modal";
import DeleteConfirmationModal from "./_components/delete-modal";
import AddStationModal from "./_components/add-modal";
import StationDetailsModal from "./_components/details-modal";
import { Station } from "@/app/interfaces/station";

export default function StationsManagement() {
  const [filter, setFilter] = useState<
    "all" | "normal" | "overloaded" | "underloaded"
  >("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);
  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const limit = 4;

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

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <Text>Loading...</Text>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="flex justify-center items-center h-full">
  //       <Text>{(error as Error).message}</Text>
  //     </div>
  //   );
  // }

  const hasNextPage = stations && stations.length === limit;

  const handleRowClick = (station: Station): void => {
    setSelectedStation(station);
    setDetailsModalOpened(true);
  };

  const handleEditClick = (station: Station) => {
    setSelectedStation(station);
    openUpdateModal();
  };

  const handleDeleteClick = (station: Station, e: Event) => {
    e.stopPropagation();
    setSelectedStation(station);
    setDeleteModalOpened(true);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="end" mb="sm">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openAddModal}
          className="bg-customBlue text-white hover:bg-blue-950"
        >
          Add Station
        </Button>
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
            onChange={(value) =>
              setFilter(
                (value as "all" | "normal" | "overloaded" | "underloaded") ||
                  "all"
              )
            }
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

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400 ">
            <Table.Th>Station ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Capacity</Table.Th>
            <Table.Th>Bikes</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {stations &&
            stations.map((station) => {
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
                    <div>
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={() =>
                          handleEditClick({
                            ...station,
                            id: Number(station.id),
                          })
                        }
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
                    </div>
                  </Table.Td>
                </Table.Tr>
              );
            })}
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

      <AddStationModal opened={addModalOpened} onClose={closeAddModal} />
      {/* <EditStationModal
        opened={updateModalOpened}
        onClose={closeUpdateModal}
        station={selectedStation}
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
