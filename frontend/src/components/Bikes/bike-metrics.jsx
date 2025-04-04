import { Card, Group, Text } from "@mantine/core";
import { IconBike } from "@tabler/icons-react";

export default function BikeMetrics() {
  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-4 mb-6">
      <Card padding="md" withBorder shadow="sm" radius="md">
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
                386 Unit
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
      <Card padding="md" withBorder shadow="sm" radius="md">
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
                214 Unit
              </Text>
            </Group>
          </div>
        </Group>
      </Card>

      <Card padding="md" withBorder shadow="sm" radius="md">
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
                214 Unit
              </Text>
            </Group>
          </div>
        </Group>
      </Card>

      <Card padding="md" withBorder shadow="sm" radius="md">
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
                89 Unit
              </Text>
            </Group>
          </div>
        </Group>
      </Card>
    </div>
  );
}
