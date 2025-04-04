import { Card, Group, Text, Badge } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconBike,
  IconCreditCard,
  IconHome,
  IconGlassFull,
} from "@tabler/icons-react";

export default function StationsMetrics() {
  return (
    <div className="grid grid-rows-1 grid-cols-2 gap-4 mb-4">
      <Card padding="md" withBorder shadow="sm" radius="md">
        <Group align="flex-start" gap="md">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconHome size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Stations
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                10 Units
              </Text>
            </Group>
          </div>
        </Group>
      </Card>

      <Card padding="md" withBorder shadow="sm" radius="md">
        <Group align="flex-start" gap="md">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconGlassFull size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Maximum Capacity
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
