"use client";

import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import { IconHome, IconGlassFull } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { GetStationStats } from "@/app/api/station-api";
import LoadingPage from "@/app/loading";

export default function StationsMetrics() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["stationMetrics"],
    queryFn: GetStationStats,
  });

  if (isLoading) {
    return <LoadingPage />;
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>{(error as Error).message}</Text>
      </div>
    );
  }

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
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group gap="md" align="flex-start">
          <ThemeIcon className="bg-[#154B1B]" size={36} radius="xl">
            <IconHome size={20} color="white" />
          </ThemeIcon>
          <div>
            <Text size="sm" c="gray.6" fw={500} tt="uppercase" lh={1.2}>
              Total Number of Stations
            </Text>
            <Text size="xl" fw={700} c="gray.9" mt={6}>
              {data?.totalStations || 0}{" "}
              <span className="text-sm">Stations</span>
            </Text>
          </div>
        </Group>
      </Card>

      <Card
        padding="md"
        withBorder
        radius="md"
        shadow="sm"
        className="rounded-xl hover:shadow-lg hover:transform hover:translate-y-1 transition-transform duration-200 ease-in-out"
      >
        <Group gap="md" align="flex-start">
          <ThemeIcon size={36} radius="xl" className="bg-[#154B1B]">
            <IconGlassFull size={20} color="white" />
          </ThemeIcon>
          <div>
            <Text size="sm" c="gray.6" fw={500} tt="uppercase" lh={1.2}>
              Maximum Station Capacity
            </Text>
            <Text size="xl" fw={700} c="gray.9" mt={6}>
              {data?.maxCapacity || 0} <span className="text-sm">Bikes</span>
            </Text>
          </div>
        </Group>
      </Card>
    </div>
  );
}
