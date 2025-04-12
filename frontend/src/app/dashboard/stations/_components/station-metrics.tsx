"use client";

import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import { IconHome, IconGlassFull } from "@tabler/icons-react";

export default function StationsMetrics() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "16px",
        marginBottom: "16px",
        maxWidth: "600px",
      }}
    >
      <Card
        padding="md"
        withBorder
        radius="md"
        shadow="sm"
        className="hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
        style={{
          backgroundColor: "#ffffff",
          transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        }}
      >
        <Group gap="md" align="flex-start">
          <ThemeIcon
            size={36}
            radius="xl"
            variant="gradient"
            gradient={{ from: "gray.9", to: "gray.7", deg: 45 }}
          >
            <IconHome size={20} color="white" />
          </ThemeIcon>
          <div>
            <Text size="sm" c="gray.6" fw={500} tt="uppercase" lh={1.2}>
              Total Stations
            </Text>
            <Text size="xl" fw={700} c="gray.9" mt={6}>
              10 Units
            </Text>
          </div>
        </Group>
      </Card>

      <Card
        padding="md"
        withBorder
        radius="md"
        shadow="sm"
        className="hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
        style={{
          backgroundColor: "#ffffff",
          transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
        }}
      >
        <Group gap="md" align="flex-start">
          <ThemeIcon
            size={36}
            radius="xl"
            variant="gradient"
            gradient={{ from: "gray.9", to: "gray.7", deg: 45 }}
          >
            <IconGlassFull size={20} color="white" />
          </ThemeIcon>
          <div>
            <Text size="sm" c="gray.6" fw={500} tt="uppercase" lh={1.2}>
              Max Station Capacity
            </Text>
            <Text size="xl" fw={700} c="gray.9" mt={6}>
              89 Units
            </Text>
          </div>
        </Group>
      </Card>
    </div>
  );
}
