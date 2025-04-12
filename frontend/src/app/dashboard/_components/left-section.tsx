"use client";
import { useState } from "react";
import {
  TextInput,
  Button,
  Group,
  Stack,
  Title,
  Paper,
  Text,
  Box,
  Timeline,
  rem,
} from "@mantine/core";
import { IconSearch, IconCircle, IconCircleDot } from "@tabler/icons-react";

export default function CarAvailability() {
  const [carType, setCarType] = useState("");

  const recentActivity = [
    {
      user: "John Johnson",
      action: "completed a booking",
      details: "Toyota Camry (SILVER)",
      time: "1 hour ago",
      day: "Today",
    },
    {
      user: "Bob Smith",
      action: "booked a",
      details: "Mercedes-Benz C300 (BLACK)",
      time: "3 hours ago",
      day: "Today",
    },
    {
      user: "Charlie Davis",
      action: "booked a monthly rental",
      details: "",
      time: "5 hours ago",
      day: "Today",
    },
    {
      user: "Emma White",
      action: "returned a",
      details: "Chevrolet Impala (SILVER)",
      time: "Yesterday",
      day: "Yesterday",
    },
    {
      user: "Steven Wilson",
      action: "booked a",
      details: "Nissan Altima (WHITE)",
      time: "Yesterday",
      day: "Yesterday",
    },
  ];

  return (
    <div className="h-fit p-2">
      <Stack spacing="lg">
        <Group position="apart" align="center">
          <Title order={4} weight={600}>
            Bike Availability
          </Title>
          <Box
            sx={{ width: rem(20), height: rem(20) }}
            className="bg-blue-500 rounded-full"
          ></Box>
        </Group>

        <Paper radius="md" p="md" withBorder>
          <Stack spacing="md">
            <TextInput
              placeholder="Bike ID"
              icon={<IconSearch size={16} />}
              value={carType}
              onChange={(e) => setCarType(e.currentTarget.value)}
              radius="md"
              size="md"
            />

            <Button fullWidth color="gray" size="md">
              Check
            </Button>
          </Stack>
        </Paper>
        <div
          p="md"
          radius="md"
          withBorder
          className="bg-gray-50 p-2 rounded-lg shadow-lg"
        >
          <Group position="apart" mb="md">
            <Title order={5}>Recent Activity</Title>
            <Text size="xs" color="dimmed">
              See all
            </Text>
          </Group>

          <Timeline active={-1} bulletSize={20} lineWidth={2}>
            {recentActivity.map((activity, index) => {
              const dayDivider =
                index === 0 ||
                (index > 0 &&
                  activity.day !== recentActivity[index - 1].day) ? (
                  <Text size="xs" color="dimmed" weight={500} mt="xs" mb="xs">
                    {activity.day}
                  </Text>
                ) : null;

              return (
                <Box key={index}>
                  {dayDivider}
                  <Timeline.Item
                    bullet={
                      index === 0 ? (
                        <IconCircleDot size={12} />
                      ) : (
                        <IconCircle size={12} />
                      )
                    }
                    title={
                      <Text size="sm" weight={500}>
                        {activity.user}{" "}
                        <Text span color="dimmed" weight={400}>
                          {activity.action}
                        </Text>{" "}
                        {activity.details && (
                          <Text span weight={500}>
                            {activity.details}
                          </Text>
                        )}
                      </Text>
                    }
                  >
                    <Text size="xs">{activity.time}</Text>
                  </Timeline.Item>
                </Box>
              );
            })}
          </Timeline>
        </div>
      </Stack>
    </div>
  );
}
