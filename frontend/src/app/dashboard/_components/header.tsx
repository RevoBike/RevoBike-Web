import { Avatar, Group, Text, Box, Container } from "@mantine/core";
import { IconSearch, IconSettings, IconBell } from "@tabler/icons-react";

export default function DashboardHeader() {
  return (
    <Box
      component="header"
      bg="#f8f9fa"
      py="md"
      px="md"
      style={{ borderBottom: "1px solid #e9ecef" }}
    >
      <Container size="xl" px="xs">
        <Group justify="space-between" align="center">
          <Text fw={500} size="xl" c="dark">
            Dashboard
          </Text>

          <Group gap="md">
            <div className="bg-white text-gray-500 flex items-center rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100 hover:cursor-pointer">
              <IconSearch size={20} stroke={1.5} />
            </div>

            <div className="bg-white text-gray-500 flex items-center rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100 hover:cursor-pointer">
              <IconSettings size={20} stroke={1.5} />
            </div>
            <div className="bg-white text-gray-500 flex items-center rounded-lg px-2 py-1 shadow-sm hover:bg-gray-100 hover:cursor-pointer">
              <IconBell size={20} stroke={1.5} />
            </div>

            <Group gap="sm">
              <Avatar
                radius="xl"
                size="md"
                src="/placeholder-user.jpg"
                alt="Abram Schneller"
              />
              <Box>
                <Text size="sm" fw={500} lh="tight">
                  Abebe Belete{" "}
                </Text>
                <Text size="xs" c="dimmed" lh="tight">
                  Admin
                </Text>
              </Box>
            </Group>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
