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

export default function BikesManagement() {
  const limit = 3;

  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "in-use" | "underMaintenance"
  >("all");
  const [bikeFilter, setBikeFilter] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBike, setSelectedBike] = useState<Bike | null>(null);

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

  const handleRowClick = (bikeId: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setSelectedBike(bikeId);
    openDetailsModal();
  };

  const handleMaintenanceClick = (bike: Bike, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBike(bike._id);
    openMaintenanceModal();
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="end" mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openAddModal}
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

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400">
            <Table.Th>Bike ID</Table.Th>
            <Table.Th>Model</Table.Th>
            <Table.Th>Station</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>CreatedAt</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bikes &&
            bikes.map((bike) => (
              <Table.Tr
                key={bike._id}
                onClick={(e) => handleRowClick(bike._id, e)}
                style={{ cursor: "pointer" }}
              >
                <Table.Td>{bike._id}</Table.Td>
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
              </Table.Tr>
            ))}
        </Table.Tbody>
      </Table>

      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-customBlue text-white w-fit h-fit p-1"
          variant="small"
          onClick={() => {
            setCurrentPage(Math.max(currentPage - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className={`bg-customBlue text-white w-fit h-fit p-1`}
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
        bikeId={selectedBike}
      />

      <AddBikeModal opened={addModalOpened} onClose={closeAddModal} />
    </Card>
  );
}
