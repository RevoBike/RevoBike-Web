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

interface UserDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  user: {
    username: string;
    email: string;
    role: string;
    lastActive: string;
  } | null;
}

const UserDetailsModal = ({ opened, onClose, user }: UserDetailsModalProps) => {
  const activityHistory = [
    { date: "2025-03-15", event: "Login", details: "Logged in from web" },
    { date: "2025-03-10", event: "Rental", details: "Rented a bike (BK001)" },
    { date: "2025-03-05", event: "Profile Update", details: "Updated email" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" align="center">
          User Details: {user?.username}
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
        {/* User Information Section */}
        <Stack spacing="sm">
          <Group position="apart">
            <Text size="sm" color="dimmed">
              UserName:{" "}
              <Text span fw={600} color="dark">
                {user?.username}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Email:{" "}
              <Text span fw={600} color="dark">
                {user?.email}
              </Text>
            </Text>
            <Text size="sm" color="dimmed">
              Role:{" "}
              <Badge
                color={
                  user?.role === "Admin"
                    ? "blue"
                    : user?.role === "Manager"
                    ? "green"
                    : "gray"
                }
                size="lg"
              >
                {user?.role}
              </Badge>
            </Text>
          </Group>
          <Text size="sm" color="dimmed">
            Last Active:{" "}
            <Text span fw={600} color="dark">
              {user?.lastActive}
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
              {activityHistory.map((entry, index) => (
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

export default UserDetailsModal;
