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
  IconMapPin,
} from "@tabler/icons-react";
import dynamic from "next/dynamic";

import BikeMetrics from "./_components/bike-metrics";
import UpdateBikeModal from "./_components/update-modal";
import DeleteBikeModal from "./_components/delete-modal";
import MaintenanceBikeModal from "./_components/maintenance-modal";
import AddBikeModal from "./_components/add-modal";
import BikeDetailsModal from "./_components/details-modal";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetStationsList } from "@/app/api/station-api";
import { GetBikes } from "@/app/api/bikes-api";
import { Bike } from "@/app/interfaces/bike";
import formatDate from "@/app/_utils/format-date";
import { useCheckRole } from "@/app/_utils/check-role";
import LoadingPage from "@/app/loading";

const BikeMapModal = dynamic(() => import("./_components/map-modal"), {
  ssr: false,
});

export default function BikesManagement() {
  const isSuperAdmin = useCheckRole();
  const limit = 10;

  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "in-use" | "underMaintenance"
  >("all");
  const [bikeFilter, setBikeFilter] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

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
      "bikes",
      currentPage,
      limit,
      searchTerm,
      statusFilter,
      bikeFilter,
    ],
    queryFn: () =>
      GetBikes(currentPage, limit, searchTerm, statusFilter, bikeFilter),

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

  const handleRowClick = (bike: Bike, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedBike(bike);
    openDetailsModal();
  };

  const handleMaintenanceClick = (bike: Bike, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBike(bike);
    openMaintenanceModal();
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="between" mb="md">
        <div className="flex items-center gap-1" onClick={openMapModal}>
          <IconMapPin
            size={24}
            color="#154B1B"
            className="hover:cursor-pointer"
          />
          <Text className="text-[#154B1B] hover:cursor-pointer">View Map</Text>
        </div>
        {isSuperAdmin && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={openAddModal}
            className="bg-[#154B1B] text-white hover:bg-green-600 ml-auto"
          >
            Add Bike
          </Button>
        )}
      </Group>
      <BikeMetrics />

      <Group mb="md" gap="md">
        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={[
            { value: "all", label: "All" },
            { value: "available", label: "Available" },
            { value: "in-use", label: "Rented" },
            { value: "underMaintenance", label: "Maintenance" },
          ]}
          value={statusFilter}
          leftSection={<IconFilter size={16} />}
          className="w-full sm:w-[200px]"
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white text-black",
            label: "text-gray-800 text-sm",
          }}
          onChange={(value) => {
            setStatusFilter(
              (value as "all" | "available" | "in-use" | "underMaintenance") ||
                "all"
            );
            setCurrentPage(1);
          }}
        />
        <Select
          label="Filter by Station"
          placeholder="Select station"
          data={[{ label: "All", value: "" }, ...(stations?.data || [])]}
          value={bikeFilter}
          onChange={(value) => {
            setBikeFilter(value as string);
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
              <Table.Th>Status</Table.Th>
              <Table.Th>Created At</Table.Th>
              {isSuperAdmin && <Table.Th>Actions</Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bikes &&
              bikes.map((bike) => (
                <Table.Tr
                  key={bike._id}
                  onClick={(e) => handleRowClick(bike, e)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Td>{bike.bikeId}</Table.Td>
                  <Table.Td>{bike.model}</Table.Td>
                  <Table.Td>{bike.currentStation}</Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        bike.status === "available"
                          ? "green"
                          : bike.status === "in-use"
                          ? "yellow"
                          : "blue"
                      }
                      variant="light"
                    >
                      {bike.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{formatDate(bike.createdAt)}</Table.Td>
                  {isSuperAdmin && (
                    <Table.Td className="ml-auto">
                      <Button
                        size="xs"
                        variant="subtle"
                        onClick={(e) => handleMaintenanceClick(bike, e)}
                      >
                        <IconTool size={18} />
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
                  )}
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>
      </div>

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

      {selectedBike && (
        <BikeDetailsModal
          opened={detailsModalOpened}
          onClose={closeDetailsModal}
          bikeId={selectedBike._id}
        />
      )}

      <BikeMapModal opened={mapModalOpened} onClose={closeMapModal} />

      <UpdateBikeModal
        opened={updateModalOpened}
        onClose={closeUpdateModal}
        bike={selectedBike}
      />

      <DeleteBikeModal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        bike={selectedBike}
      />

      <MaintenanceBikeModal
        opened={maintenanceModalOpened}
        onClose={closeMaintenanceModal}
        bikeId={selectedBike?._id || ""}
      />

      <AddBikeModal opened={addModalOpened} onClose={closeAddModal} />
    </Card>
  );
}
