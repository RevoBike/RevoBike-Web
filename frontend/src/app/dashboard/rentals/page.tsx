"use client";

import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Select,
  Table,
  Text,
  Container,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import {
  IconFilter,
  IconArrowLeft,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";
import LineGraph from "./_components/rental-metrics";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetRides } from "@/app/api/rental";
import { GetRentalStats } from "@/app/api/stats";
import { Ride } from "@/app/interfaces/rides";
import { useDisclosure } from "@mantine/hooks";
import formatDate from "@/app/_utils/format-date";
import LoadingPage from "@/app/loading";
import dynamic from "next/dynamic";

const RentalMapModal = dynamic(() => import("./_components/details-modal"), {
  ssr: false,
});

export default function RentalsManagement() {
  const [date, setDate] = useState<Date | null>(null);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "completed"
  >("all");
  const [
    detailsModalOpened,
    { open: openDetailsModal, close: closeDetailsModal },
  ] = useDisclosure(false);

  const [selectedRental, setSelectedRental] = useState<Ride | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  const {
    data: rentals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rides", currentPage, limit, statusFilter, date],
    queryFn: () => GetRides(currentPage, limit, statusFilter, date),
    placeholderData: keepPreviousData,
  });

  const { data: rentalStats } = useQuery({
    queryKey: ["rentalStats"],
    queryFn: GetRentalStats,
  });

  const hasNextPage = rentals && rentals.length === limit;

  const clearFilters = () => {
    setStatusFilter("all");
    setDate(null);
    setCurrentPage(1);
  };

  const handleRowClick = (rental: Ride): void => {
    setSelectedRental(rental);
    openDetailsModal();
  };

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

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Card withBorder radius="md" padding="md" mb="lg">
        <Text size="lg" fw={600} mb="md" c="black">
          Yearly Rental Status ({new Date().getFullYear()})
        </Text>

        <LineGraph rentals={rentalStats || []} />
      </Card>
      <Group mb="md" gap="md" align="flex-end">
        <Select
          label="Filter by Status"
          placeholder="Select status"
          data={[
            { value: "all", label: "All" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
          ]}
          value={statusFilter}
          onChange={(value) => {
            setStatusFilter((value as "all" | "active" | "completed") || "all");
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
        <div>
          <div className="flex gap-3">
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              value={date}
              onChange={(value) => setDate(value)}
              radius="md"
              styles={{
                label: {
                  color: "#495057",
                  fontWeight: 500,
                },
                input: {
                  borderColor: "#ced4da",
                  "&:focus": {
                    borderColor: "#868e96",
                    boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
                  },
                },
                error: { color: "#f03e3e" },
              }}
              style={{ width: "200px" }}
            />
          </div>
        </div>

        <Button
          variant="outline"
          color="#154B1B"
          radius="md"
          onClick={clearFilters}
          leftSection={<IconX size={16} />}
          styles={{ root: { height: "36px" } }}
        >
          Clear Filters
        </Button>
      </Group>
      <div className="w-full overflow-x-auto">
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400">
              <Table.Th>User</Table.Th>
              <Table.Th>Bike</Table.Th>
              <Table.Th>Start Time</Table.Th>
              <Table.Th>End Time</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Payment Status</Table.Th>
              <Table.Th>Amount Charged</Table.Th>
              <Table.Th>Distance Covered</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rentals && rentals.length > 0 ? (
              rentals.map((rental) => (
                <Table.Tr
                  key={rental._id}
                  onClick={() => handleRowClick(rental)}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Td>{rental.user && rental.user.name}</Table.Td>
                  <Table.Td>{rental.bike.bikeId}</Table.Td>
                  <Table.Td>
                    {formatDate(rental.startTime)}{" "}
                    {rental.startTime &&
                      new Date(rental.startTime).toLocaleString().split(",")[1]}
                  </Table.Td>
                  <Table.Td>
                    {rental.endTime ? (
                      <>
                        {formatDate(rental.endTime)}
                        {rental.endTime &&
                          new Date(rental.endTime)
                            .toLocaleString()
                            .split(",")[1]}
                      </>
                    ) : (
                      "Ongoing"
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={rental.status === "active" ? "blue.6" : "green.6"}
                      variant="light"
                    >
                      {rental.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      color={
                        rental.paymentStatus === "pending"
                          ? "yellow.6"
                          : rental.paymentStatus === "paid"
                          ? "green.6"
                          : "red.6"
                      }
                      variant="light"
                    >
                      {rental.paymentStatus}
                    </Badge>
                  </Table.Td>
                  <Table.Td>{rental.cost.toFixed(2)} Birr</Table.Td>
                  <Table.Td>{rental.distance} km</Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={8}>
                  <div className="flex flex-col items-center justify-center py-8">
                    <Text c="dimmed" mt="sm">
                      No rentals found.
                    </Text>
                  </div>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </div>
      {rentals && rentals.length > 0 && (
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
            className="bg-[#154B1B] text-white w-fit h-fit p-1 hover:bg-green-600"
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
      <RentalMapModal
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
        rental={selectedRental}
      />
    </Card>
  );
}
