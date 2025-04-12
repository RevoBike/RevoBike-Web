import { Card, Group, Text, Badge } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconBike,
  IconCreditCard,
} from "@tabler/icons-react";

export default function DashboardMetrics() {
  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-4">
      <Card padding="md" withBorder shadow="sm" radius="md">
        <Group align="flex-start" gap="md">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconCalendar size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              New Bookings
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                386
              </Text>
              <Badge
                color="green"
                variant="light"
                leftSection={<IconArrowUp size={12} />}
                size="sm"
              >
                1.73%
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              from last week
            </Text>
          </div>
        </Group>
      </Card>
      <Card padding="md" withBorder shadow="sm" radius="md">
        <Group align="flex-start" gap="md">
          <div className="bg-gray-900 text-white rounded-full p-1">
            <IconCreditCard size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Bikes in maintenance
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                214 Unit
              </Text>
              <Badge
                color="green"
                variant="light"
                leftSection={<IconArrowUp size={12} />}
                size="sm"
              >
                2.86%
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              from last week
            </Text>
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
              <Badge
                color="red"
                variant="light"
                leftSection={<IconArrowDown size={12} />}
                size="sm"
              >
                2.86%
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              from last week
            </Text>
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
              <Badge
                color="green"
                variant="light"
                leftSection={<IconArrowUp size={12} />}
                size="sm"
              >
                3.45%
              </Badge>
            </Group>
            <Text size="xs" c="dimmed" mt={4}>
              from last week
            </Text>
          </div>
        </Group>
      </Card>
    </div>
  );
}
