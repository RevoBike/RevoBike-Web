import { Card, Group, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { GetUserStats } from "@/app/api/user";

export default function UsersMetrics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userMetrics"],
    queryFn: GetUserStats,
  });

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

  return (
    <div className="grid gris=rows-2 md:grid-rows-1 grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconUser size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Users
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalUsers || 0}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>

      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconUser size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Customers
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalCustomers || 0}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconUser size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Admins
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalAdmins || 0}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconUser size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total SuperAdmins
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalSuperAdmins || 0}
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    </div>
  );
}
