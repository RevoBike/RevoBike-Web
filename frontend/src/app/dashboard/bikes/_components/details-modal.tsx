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

import { FC } from "react";

interface BikeDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  bike: {
    id: string;
    type: string;
    station: string;
    status: string;
    lastMaintained: string;
  };
}

const BikeDetailsModal: FC<BikeDetailsModalProps> = ({
  opened,
  onClose,
  bike,
}) => {
  const history = [
    { date: "2025-03-15", event: "Maintenance", details: "Brake repair" },
    { date: "2025-03-10", event: "Rental", details: "Rented by John Doe" },
    { date: "2025-03-05", event: "Battery", details: "Battery replaced, 100%" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" align="center">
          Bike Details: {bike.id}
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
              Type:{" "}
              <Text span fw={600} color="dark">
                {bike.type}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Station:{" "}
              <Text span fw={600} color="dark">
                {bike.station}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Status:{" "}
              <Badge
                color={
                  bike.status === "Available"
                    ? "green"
                    : bike.status === "Rented"
                    ? "blue"
                    : "yellow"
                }
                size="lg"
              >
                {bike.status}
              </Badge>
            </Text>
          </Group>
          <Text size="sm" color="dimmed">
            Last Maintained:{" "}
            <Text span fw={600} color="dark">
              {bike.lastMaintained}
            </Text>
          </Text>
        </Stack>

        <Divider />

        <Stack spacing="sm">
          <Title order={4} align="left" color="dark">
            Maintenance & Rental History
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

export default BikeDetailsModal;
