import { Card, Group, Text } from "@mantine/core";
import { IconBike } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { GetBikeStats } from "@/app/api/bikes-api";

export default function BikeMetrics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["bikesMetrics"],
    queryFn: GetBikeStats,
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
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconBike size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Bikes{" "}
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalBikes || 0} <span className="text-sm">Bikes</span>
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
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconBike size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Bikes in maintenance
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalBikesInMaintenance || 0}{" "}
                <span className="text-sm">Bikes</span>
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
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconBike size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Rented Bikes
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalRentedBikes || 0}{" "}
                <span className="text-sm">Bikes</span>
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
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconBike size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Available Bikes
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {data?.totalAvailableBikes || 0}{" "}
                <span className="text-sm">Bikes</span>
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    </div>
  );
}
