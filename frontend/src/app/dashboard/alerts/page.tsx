"use client";

import { useState } from "react";
import {
  Table,
  Button,
  Group,
  Text,
  Select,
  Card,
  Modal,
  Stack,
  Title,
  Container,
  Badge,
  Flex,
  TextInput,
} from "@mantine/core";
import {
  IconMapPin,
  IconFilter,
  IconAlertCircle,
  IconSearch,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";

import "leaflet/dist/leaflet.css";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import MapModal from "./_components/map-modal";

// Dummy data
const dummyAlerts = [
  {
    _id: "1",
    bike: { _id: "bike1", name: "Bike A" },
    user: { _id: "user1", name: "Abebe Kebede" },
    alertType: "Geofence Exit",
    location: { type: "Point", coordinates: [38.7631, 8.9997] }, // Main Gate
    timestamp: new Date("2025-04-22T10:00:00Z"),
    status: "unresolved",
  },
  {
    _id: "2",
    bike: { _id: "bike2", name: "Bike B" },
    user: { _id: "user2", name: "Marta Tesfaye" },
    alertType: "Theft Alert",
    location: { type: "Point", coordinates: [38.7625, 8.9989] }, // Library
    timestamp: new Date("2025-04-22T09:30:00Z"),
    status: "unresolved",
  },
  {
    _id: "3",
    bike: { _id: "bike3", name: "Bike C" },
    user: { _id: "user3", name: "Yonas Alem" },
    alertType: "Geofence Exit",
    location: { type: "Point", coordinates: [38.764, 9.0005] }, // Admin Building
    timestamp: new Date("2025-04-22T08:45:00Z"),
    status: "resolved",
  },
  {
    _id: "4",
    bike: { _id: "bike4", name: "Bike D" },
    user: { _id: "user4", name: "Selamawit Getachew" },
    alertType: "Theft Alert",
    location: { type: "Point", coordinates: [38.7618, 9.0012] }, // Cafeteria
    timestamp: new Date("2025-04-22T07:00:00Z"),
    status: "unresolved",
  },
];

// Alert Details Modal
const AlertDetailsModal = ({ opened, onClose, alert }) => {
  if (!alert) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700}>
          Alert Details
        </Text>
      }
      centered
      radius="md"
      size="lg"
      styles={{
        header: { padding: "16px 24px", borderBottom: "1px solid #e9ecef" },
        body: { padding: "24px" },
      }}
    >
      <Stack>
        <Group>
          <Text size="sm" c="dimmed">
            Alert Type
          </Text>
          <Badge color={alert.alertType === "Theft Alert" ? "red" : "orange"}>
            {alert.alertType}
          </Badge>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Bike
          </Text>
          <Text>{alert.bike.name}</Text>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            User
          </Text>
          <Text>{alert.user.name}</Text>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Location
          </Text>
          <Text>
            {alert.location.coordinates[1].toFixed(4)},{" "}
            {alert.location.coordinates[0].toFixed(4)}
          </Text>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Timestamp
          </Text>
          <Text>{new Date(alert.timestamp).toLocaleString()}</Text>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Status
          </Text>
          <Badge color={alert.status === "resolved" ? "green" : "gray"}>
            {alert.status}
          </Badge>
        </Group>
        <Group>
          <Text size="sm" c="dimmed">
            Description
          </Text>
          <Text>
            {alert.alertType === "Theft Alert"
              ? `Possible theft detected for ${
                  alert.bike.name
                } near ${alert.location.coordinates[1].toFixed(
                  4
                )}, ${alert.location.coordinates[0].toFixed(4)}`
              : `${
                  alert.bike.name
                } exited geofence near ${alert.location.coordinates[1].toFixed(
                  4
                )}, ${alert.location.coordinates[0].toFixed(4)}`}
          </Text>
        </Group>
        <Button
          onClick={onClose}
          color="gray.9"
          radius="md"
          mt="md"
          styles={{
            root: {
              backgroundColor: "#212529",
              "&:hover": { backgroundColor: "#343a40" },
            },
          }}
        >
          Close
        </Button>
      </Stack>
    </Modal>
  );
};

export default function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "Geofence Exit" | "Theft Alert">(
    "all"
  );
  const [date, setDate] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [mapModalOpened, { open: openMapModal, close: closeMapModal }] =
    useDisclosure(false);

  const router = useRouter();
  const [alerts, setAlerts] = useState(dummyAlerts);
  const [bikeModalOpen, setBikeModalOpen] = useState(false);
  const [selectedBike, setSelectedBike] = useState(null);

  // Filter alerts
  const filteredAlerts =
    filter === "all"
      ? alerts
      : alerts.filter((alert) => alert.alertType === filter);

  // Handle actions
  const handleResolve = (id) => {
    setAlerts(
      alerts.map((alert) =>
        alert._id === id ? { ...alert, status: "resolved" } : alert
      )
    );
    notifications.show({
      title: "Success",
      message: "Alert resolved successfully",
      color: "green",
    });
  };

  const handleNotify = (userName, alertType) => {
    notifications.show({
      title: "Notification Sent",
      message: `Notified ${userName}: ${alertType} reported for their bike.`,
      color: "orange",
    });
  };

  const handleViewBike = (bike) => {
    setSelectedBike(bike);
    setBikeModalOpen(true);
  };

  const handleViewUser = (userId) => {
    router.push(`/users/${userId}`);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="end" mb="sm">
        <div className="flex items-center gap-1" onClick={openMapModal}>
          <IconMapPin
            size={24}
            color="#154c79"
            className="hover:cursor-pointer"
          />
          <Text className="text-customBlue hover:cursor-pointer">View Map</Text>
        </div>
      </Group>

      <div className="flex gap-1 align-middle">
        <IconAlertCircle color="red" className="mt-1" />
        <Title order={3} mb="md" c="red">
          Recent Alerts
        </Title>
      </div>

      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap"
        className="shadow-sm p-2"
      >
        {dummyAlerts.length === 0 ? (
          <Text c="dimmed">No alerts</Text>
        ) : (
          dummyAlerts.map((alert) => (
            <Flex
              gap="md"
              justify="flex-start"
              align="flex-start"
              direction="row"
              wrap="wrap"
              key={alert._id}
              className="mx-r"
            >
              <Card
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  backgroundColor: "#fff",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.02)" },
                }}
                className="w-fit hover:scale-95"
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
                  {alert.bike.name}
                </Text>
                <Text size="sm" c="dimmed">
                  User: {alert.user.name}
                </Text>
                <Text size="sm" c="dimmed">
                  Location: {alert.location.coordinates[1].toFixed(4)},{" "}
                  {alert.location.coordinates[0].toFixed(4)}
                </Text>
                <Text size="sm" c="dimmed">
                  Time: {new Date(alert.timestamp).toLocaleString()}
                </Text>
                <Text size="sm" mt="xs">
                  {alert.alertType === "Theft Alert"
                    ? `Possible theft detected for ${alert.bike.name}`
                    : `${alert.bike.name} exited geofence`}
                </Text>
              </Card>
            </Flex>
          ))
        )}
      </Flex>
      <div className="flex flex-row align-middle gap-2 items-center mt-6 mb-6">
        <Select
          label="Filter by alert type"
          placeholder="Select alert"
          data={[
            { value: "all", label: "All Alerts" },
            { value: "Geofence Exit", label: "Geofence Exit" },
            { value: "Theft Alert", label: "Theft Alert" },
          ]}
          value={filter}
          leftSection={<IconFilter size={16} />}
          className="w-full sm:w-[200px]"
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white text-black",
            label: "text-gray-800 text-sm",
          }}
          onChange={(value) => {
            setFilter(
              (value as "all" | "Geofence Exit" | "Theft Alert") || "all"
            );
            setCurrentPage(1);
          }}
        />
        <DatePickerInput
          label="Date"
          placeholder="Select date"
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
        <div className="w-full sm:w-auto md:mt-4 ml-auto">
          <TextInput
            placeholder="Search by Bike or User ID"
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
          <Table.Tr className="bg-[#154B1B] text-white hover:bg-gray-400 ">
            <Table.Th>Alert Id</Table.Th>
            <Table.Th>Bike</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Alert Type</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Location</Table.Th>
            <Table.Th>Timestamp</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredAlerts &&
            filteredAlerts.map((alert) => {
              return (
                <Table.Tr
                  key={alert._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(station)}
                >
                  <Table.Td>{alert._id}</Table.Td>
                  <Table.Td>{alert.bike._id}</Table.Td>
                  <Table.Td>{alert.user.name}</Table.Td>
                  <Table.Td>{alert.alertType}</Table.Td>
                  <Table.Td>
                    <Badge color="red" variant="light">
                      {alert.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    {alert.location.coordinates[1].toFixed(4)},{" "}
                    {alert.location.coordinates[0].toFixed(4)}
                  </Table.Td>
                  <Table.Td>
                    {new Date(alert.timestamp).toLocaleString()}
                  </Table.Td>
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
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
          // onClick={() => {
          //   if (hasNextPage) {
          //     setCurrentPage((old) => old + 1);
          //   }
          // }}
          // disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>

      {/* Bike Details Modal (Placeholder) */}
      <Modal
        opened={bikeModalOpen}
        onClose={() => setBikeModalOpen(false)}
        title={
          <Text size="lg" fw={700}>
            Bike Details
          </Text>
        }
        centered
        radius="md"
      >
        {selectedBike && (
          <Stack>
            <Text>
              <strong>Name:</strong> {selectedBike.name}
            </Text>
            <Text>
              <strong>ID:</strong> {selectedBike._id}
            </Text>
            <Text>
              <strong>Status:</strong> Available
            </Text>
            <Button onClick={() => setBikeModalOpen(false)} mt="md">
              Close
            </Button>
          </Stack>
        )}
      </Modal>

      <MapModal opened={mapModalOpened} onClose={closeMapModal} />
    </Card>
  );
}
