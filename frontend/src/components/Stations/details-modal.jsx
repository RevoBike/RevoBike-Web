import {
  Modal,
  Stack,
  Text,
  Group,
  Badge,
  Title,
  Table,
  Divider,
} from "@mantine/core";

const StationDetailsModal = ({ opened, onClose, station }) => {
  const history = [
    { date: "2025-03-15", event: "Bike Added", details: "Added bike BK001" },
    { date: "2025-03-10", event: "Maintenance", details: "Station cleaned" },
    {
      date: "2025-03-05",
      event: "Capacity Update",
      details: "Increased to 50",
    },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" align="center">
          Station Details: {station?.name}
        </Text>
      }
      centered
      size="lg"
      styles={{
        header: {
          padding: "16px 24px",
          borderBottom: "1px solid #e9ecef",
        },
        body: {
          padding: "24px",
        },
      }}
    >
      <Stack spacing="lg">
        <Stack spacing="sm">
          <Group position="apart">
            <Text size="sm" color="dimmed">
              Location:{" "}
              <Text span fw={600} color="dark">
                {station?.location}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Capacity:{" "}
              <Text span fw={600} color="dark">
                {station?.capacity}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Status:{" "}
              <Badge
                color={
                  station?.status === "Active"
                    ? "green"
                    : station?.status === "Inactive"
                    ? "red"
                    : "yellow"
                }
                size="lg"
              >
                {station?.status}
              </Badge>
            </Text>
          </Group>
          <Text size="sm" color="dimmed">
            Last Updated:{" "}
            <Text span fw={600} color="dark">
              {station?.lastUpdated}
            </Text>
          </Text>
        </Stack>

        <Divider />

        <Stack spacing="sm">
          <Title order={4} align="left" color="dark">
            Activity History
          </Title>
          <Table highlightOnHover withBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Date</Table.Th>
                <Table.Th>Event</Table.Th>
                <Table.Th>Details</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {history.map((entry, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{entry.date}</Table.Td>
                  <Table.Td>{entry.event}</Table.Td>
                  <Table.Td>{entry.details}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default StationDetailsModal;
