"use client";
import { Card, Group, Text, Badge } from "@mantine/core";
import {
  IconArrowDown,
  IconArrowUp,
  IconCalendar,
  IconBike,
  IconTool,
} from "@tabler/icons-react";

import { useQuery } from "@tanstack/react-query";
import { GetStats } from "@/app/api/stats";

export default function DashboardMetrics() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: GetStats,
  });

  return (
    <div className="grid grid-rows-2 grid-cols-2 gap-4">
      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="hover:shadow-lg transition-shadow duration-200"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconCalendar size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              New Bookings
            </Text>
            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {stats?.rented.count} Rentals
              </Text>
            </Group>

            <div className="flex items-center justify-center mt-2 gap-1">
              <Badge
                color="green"
                variant="light"
                leftSection={<IconArrowUp size={12} />}
                size="sm"
              >
                {stats?.rented.change}%
              </Badge>
              <Text size="xs" c="dimmed">
                from last week
              </Text>
            </div>
          </div>
        </Group>
      </Card>
      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="hover:shadow-lg transition-shadow duration-200"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconTool size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Bikes in maintenance
            </Text>

            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {stats?.maintenance.count} Bikes
              </Text>
            </Group>
            <div className="flex items-center justify-center mt-2 gap-1">
              <Badge
                color="green"
                variant="light"
                leftSection={<IconArrowUp size={12} />}
                size="sm"
              >
                {stats?.maintenance.count}%
              </Badge>
              <Text size="xs" c="dimmed">
                from last week
              </Text>
            </div>
          </div>
        </Group>
      </Card>

      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="hover:shadow-lg transition-shadow duration-200"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconBike size={20} />
          </div>
          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Total Revenue
            </Text>

            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {stats?.revenue.total} Birr
              </Text>
            </Group>
            <div className="flex items-center justify-center mt-2 gap-1">
              <Badge
                color="red"
                variant="light"
                leftSection={<IconArrowDown size={12} />}
                size="sm"
              >
                {stats?.revenue.change}%
              </Badge>
              <Text size="xs" c="dimmed">
                from last week
              </Text>
            </div>
          </div>
        </Group>
      </Card>

      <Card
        padding="md"
        withBorder
        shadow="sm"
        radius="md"
        className="hover:shadow-lg transition-shadow duration-200"
      >
        <Group align="flex-start" gap="md">
          <div className="bg-[#154B1B] text-white rounded-full p-1">
            <IconBike size={20} />
          </div>

          <div>
            <Text size="sm" c="dimmed" fw={500}>
              Available Bikes
            </Text>

            <Group gap="xs" mt={4}>
              <Text size="xl" fw={700}>
                {stats?.available.count} bikes
              </Text>
            </Group>
            <div className="flex items-center justify-center mt-2 gap-1">
              <Badge
                color="red"
                variant="light"
                leftSection={<IconArrowDown size={12} />}
                size="sm"
              >
                {stats?.available.change}%
              </Badge>
              <Text size="xs" c="dimmed">
                from last week
              </Text>
            </div>
          </div>
        </Group>
      </Card>
    </div>
  );
}
