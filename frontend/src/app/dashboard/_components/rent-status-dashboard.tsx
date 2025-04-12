"use client";
import { useState } from "react";
import {
  Card,
  CardSection,
  Group,
  Text,
  Select,
  ThemeIcon,
} from "@mantine/core";

export default function RentStatusDashboard() {
  const [timeframe, setTimeframe] = useState("this-week");

  return (
    <div className="w-full ">
      <Card shadow="sm" padding="lg" radius="md" withBorder className="p-10">
        <CardSection className="p-2">
          <div position="apart" mb="md" className="flex justify-between">
            <h2 className="w-2/3">Rent Status</h2>
            <Select
              value={timeframe}
              onChange={setTimeframe}
              data={[
                { value: "this-week", label: "This Week" },
                { value: "this-month", label: "This Month" },
                { value: "this-year", label: "This Year" },
              ]}
              size="xs"
              radius="md"
              placeholder="Select"
            />
          </div>
        </CardSection>
        <CardSection>
          <div className="flex justify-center py-">
            <DonutChart />
          </div>

          <div className="flex flex-col justify-center text-sm p-2">
            <StatusItem color="gray" label="Rented" percentage="58%" />
            <StatusItem color="red" label="Pending" percentage="24%" />
            <StatusItem color="blue" label="Cancelled" percentage="18%" />
          </div>
        </CardSection>
      </Card>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eaeaea"
          strokeWidth="3"
        />

        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eaeaea"
          strokeWidth="3"
          strokeDasharray="18, 100"
          strokeDashoffset="0"
        />

        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="24, 100"
          strokeDashoffset="18"
        />

        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#1e293b"
          strokeWidth="3"
          strokeDasharray="58, 100"
          strokeDashoffset="42"
        />
      </svg>
    </div>
  );
}

function StatusItem({ color, label, percentage, icon }) {
  return (
    <>
      <Group spacing="xs" className="p-1">
        <ThemeIcon size="sm" radius="sm" color={color} />
        <Text size="sm">{label}</Text>
        <Text align="center" size="sm">
          {percentage}
        </Text>
      </Group>
    </>
  );
}
