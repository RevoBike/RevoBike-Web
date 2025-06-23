"use client";
import { Avatar, Group, Text, Box, Container } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { GetProfile } from "@/app/api/user";

export default function DashboardHeader() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetProfile,
  });

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
            <Group gap="sm">
              <Avatar
                radius="xl"
                size="md"
                src="/placeholder-user.jpg"
                alt="User"
              />
              <Box>
                <Text size="sm" fw={500} lh="tight" c="dimmed">
                  {profile && profile.name}{" "}
                </Text>
                <Text size="xs" c="dimmed" lh="tight">
                  {profile && profile.role}
                </Text>
              </Box>
            </Group>
          </Group>
        </Group>
      </Container>
    </Box>
  );
}
