import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBike,
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";
import StationsMetrics from "./Stations/station-metrics";

export default function StationsManagement() {
  const [filter, setFilter] = useState("all");
  const [modalOpened, setModalOpened] = useState(false);

  const stations = [
    {
      id: 1,
      name: "Central Park",
      address: "123 Park Ave",
      capacity: 20,
      bikes: 18,
    },
    {
      id: 2,
      name: "Downtown Hub",
      address: "456 Main St",
      capacity: 15,
      bikes: 5,
    },
    {
      id: 3,
      name: "Riverside Stop",
      address: "789 River Rd",
      capacity: 10,
      bikes: 2,
    },
    {
      id: 4,
      name: "Uptown Plaza",
      address: "101 Plaza Dr",
      capacity: 25,
      bikes: 24,
    },
  ];

  const filteredStations = stations.filter((station) => {
    const occupancy = (station.bikes / station.capacity) * 100;
    if (filter === "overloaded") return occupancy > 80;
    if (filter === "underloaded") return occupancy < 20;
    if (filter === "normal") return occupancy >= 20 && occupancy <= 80;
    return true;
  });

  const handleRowClick = (station) => {
    console.log("Edit station:", station);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={2}>Stations Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setModalOpened(true)}
        >
          Add Station
        </Button>
      </Group>
      <StationsMetrics />

      <Group mb="md">
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
          onChange={setFilter}
          leftSection={<IconFilter size={16} />}
          style={{ width: "200px" }}
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Capacity</Table.Th>
            <Table.Th>Bikes</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredStations.map((station) => {
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
                onClick={() => handleRowClick(station)}
                style={{ cursor: "pointer" }}
              >
                <Table.Td>{station.name}</Table.Td>
                <Table.Td>{station.address}</Table.Td>
                <Table.Td>{station.capacity}</Table.Td>
                <Table.Td>{station.bikes}</Table.Td>
                <Table.Td>
                  <Badge color={statusColor} variant="light">
                    {status}
                  </Badge>
                </Table.Td>
                <Table.Td className="flex flex-row gap-2">
                  <IconEdit color="green" /> |
                  <IconTrash color="red" />
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <AddStationModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </Card>
  );
}

function AddStationModal({ opened, onClose }) {
  const form = useForm({
    initialValues: {
      name: "",
      address: "",
      capacity: "",
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      address: (value) =>
        value.length < 5 ? "Address must be at least 5 characters" : null,
      capacity: (value) =>
        !/^\d+$/.test(value) || value < 1
          ? "Capacity must be a positive number"
          : null,
    },
  });

  const handleSubmit = (values) => {
    console.log("New station:", values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>Add New Station</Text>}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Station Name"
            placeholder="e.g., Central Park"
            required
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Address"
            placeholder="e.g., 123 Park Ave"
            required
            {...form.getInputProps("address")}
          />
          <TextInput
            label="Capacity"
            placeholder="e.g., 20"
            required
            {...form.getInputProps("capacity")}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" leftSection={<IconBike size={16} />}>
              Add Station
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
