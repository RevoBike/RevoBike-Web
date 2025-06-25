"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Select,
  Card,
  Title,
  Container,
  Badge,
  Flex,
} from "@mantine/core";
import {
  IconMapPin,
  IconFilter,
  IconAlertCircle,
  IconArrowLeft,
  IconArrowRight,
  IconX,
} from "@tabler/icons-react";
// import { DatePickerInput } from "@mantine/dates";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import { useDisclosure } from "@mantine/hooks";
import dynamic from "next/dynamic";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { GetAlerts, GetRecentAlerts } from "@/app/api/alerts";
import LoadingPage from "@/app/loading";
import { DatePickerInput } from "@mantine/dates";

const MapModal = dynamic(() => import("./_components/map-modal"), {
  ssr: false,
});

export default function AlertsPage() {
  const limit = 10;
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<"all" | "Geofence Exit" | "Theft Alert">(
    "all"
  );
  const [date, setDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [mapModalOpened, { open: openMapModal, close: closeMapModal }] =
    useDisclosure(false);

  const clearFilters = () => {
    setFilter("all");
    setDate(null);
    setCurrentPage(1);
  };

  const {
    data: alerts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["alerts", currentPage, limit, filter, date],
    queryFn: () => GetAlerts(currentPage, limit, filter, date),
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
  });

  const { data: recentAlerts } = useQuery({
    queryKey: ["recentAlerts"],
    queryFn: GetRecentAlerts,
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
  });

  console.log("Alerts data:", alerts);

  useEffect(() => {
    const socket = io("https://backend-ge4m.onrender.com", {
      reconnection: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("geofenceAlert", () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      queryClient.invalidateQueries({ queryKey: ["recentAlerts"] });
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  const hasNextPage = alerts && alerts.length === limit;

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
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 items-center">
          <IconAlertCircle color="red" size={24} />
          <Title order={3} c="red">
            Recent Alerts
          </Title>
        </div>
        <Group justify="end">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={openMapModal}
          >
            <IconMapPin size={24} color="#154B1B" />
            <Text c="#154B1B">View Map</Text>
          </div>
        </Group>
      </div>
      <Flex
        gap="md"
        justify="flex-start"
        direction="row"
        wrap="wrap"
        className="shadow-sm p-2"
      >
        {recentAlerts &&
          recentAlerts.map((alert) => (
            <Flex
              key={alert._id}
              gap="md"
              justify="flex-start"
              direction="row"
              wrap="wrap"
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                className="w-fit hover:scale-95"
                style={{
                  backgroundColor: "#fff",
                  transition: "transform 0.2s",
                }}
              >
                <Group mb="xs">
                  <Badge
                    color={alert.alertType === "Theft Alert" ? "red" : "orange"}
                    size="lg"
                  >
                    {alert.alertType}
                  </Badge>
                </Group>
                <Text size="md" fw={500}>
                  {alert.bike.bikeId} - {alert.bike.model}
                </Text>
                <Text size="sm" c="dimmed">
                  User: {alert.user?.name || "N/A"}
                </Text>
                <Text size="sm" c="dimmed">
                  Time: {new Date(alert.timestamp).toLocaleString()}
                </Text>
                <Text size="sm" mt="xs">
                  {alert.alertType === "Theft Alert"
                    ? `Possible theft detected for ${alert.bike.bikeId}`
                    : `${alert.bike.bikeId} exited geofence`}
                </Text>
              </Card>
            </Flex>
          ))}
      </Flex>
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-end"
        direction="row"
        wrap="wrap"
        my="lg"
      >
        <Select
          label="Filter by alert type"
          placeholder="Select alert"
          data={[
            { value: "all", label: "All Alerts" },
            { value: "Geofence Exit", label: "Geofence Exit" },
            { value: "Theft Alert", label: "Theft Alert" },
          ]}
          value={filter}
          onChange={(value) => {
            setFilter(value as "all" | "Geofence Exit" | "Theft Alert");
            setCurrentPage(1);
          }}
          leftSection={<IconFilter size={16} />}
          className="w-full sm:w-[200px]"
          styles={{
            label: { color: "#495057", fontWeight: 500 },
            input: {
              borderColor: "#ced4da",
              "&:focus": {
                borderColor: "#868e96",
                boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
              },
            },
          }}
        />
        <DatePickerInput
          label="Filter by date"
          placeholder="Select date"
          value={date}
          onChange={(value) => {
            setDate(value);
            setCurrentPage(1);
          }}
          radius="md"
          className="w-full sm:w-[200px]"
          styles={{
            label: { color: "#495057", fontWeight: 500 },
            input: {
              borderColor: "#ced4da",
              "&:focus": {
                borderColor: "#868e96",
                boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
              },
            },
            error: { color: "#f03e3e" },
          }}
        />

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
      </Flex>
      <div className="w-full overflow-x-auto">
        <Table highlightOnHover className="min-w-full md:table-hidden">
          <Table.Thead>
            <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400 ">
              <Table.Th>Bike ID</Table.Th>
              <Table.Th>Model</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Phone Number</Table.Th>
              <Table.Th>Alert Type</Table.Th>
              <Table.Th>Timestamp</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {alerts &&
              alerts.map((alert) => (
                <Table.Tr key={alert._id} style={{ cursor: "pointer" }}>
                  <Table.Td>{alert.bike.bikeId}</Table.Td>
                  <Table.Td>{alert.bike.model}</Table.Td>
                  <Table.Td>{alert.user?.name || "N/A"}</Table.Td>
                  <Table.Td>{alert.user?.phone_number || "N/A"}</Table.Td>
                  <Table.Td>{alert.alertType}</Table.Td>
                  <Table.Td>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Table.Td>
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
      <MapModal opened={mapModalOpened} onClose={closeMapModal} />
    </Card>
  );
}
