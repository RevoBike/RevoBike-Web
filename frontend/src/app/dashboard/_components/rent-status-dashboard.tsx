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
import { useQuery } from "@tanstack/react-query";
import { GetRentalStatus } from "@/app/api/stats";

export default function RentStatusDashboard() {
  const [timeframe, setTimeframe] = useState("this-week");

  const { data: rentalStatus } = useQuery({
    queryKey: ["rental-status", timeframe],
    queryFn: () => GetRentalStatus(timeframe),
  });

  return (
    <div className="w-full ">
      <Card shadow="sm" padding="lg" radius="md" withBorder className="p-10">
        <CardSection className="p-2">
          <div className="flex justify-between">
            <h2 className="w-2/3">Rent Status</h2>
            <Select
              value={timeframe}
              onChange={(value) => value && setTimeframe(value)}
              data={[
                { value: "this-week", label: "This Week" },
                { value: "this-month", label: "This Month" },
                { value: "this-year", label: "This Year" },
              ]}
              classNames={{
                dropdown: "text-black",
              }}
              size="xs"
              radius="md"
              placeholder="Select"
            />
          </div>
        </CardSection>
        <CardSection>
          <div className="flex justify-center py-">
            <DonutChart data={rentalStatus || []} />
          </div>

          <div className="flex flex-col justify-center text-sm p-2">
            <StatusItem
              color="#43B97F"
              label={
                (rentalStatus &&
                  rentalStatus.length > 0 &&
                  rentalStatus?.[0].label) ||
                "Rented"
              }
              percentage={
                (rentalStatus &&
                  rentalStatus?.length > 0 &&
                  rentalStatus?.[0].percentage) ||
                "0"
              }
            />
            <StatusItem
              color="#154B1B"
              label={
                (rentalStatus &&
                  rentalStatus?.length > 0 &&
                  rentalStatus?.[1].label) ||
                "Completed"
              }
              percentage={
                (rentalStatus &&
                  rentalStatus?.length > 1 &&
                  rentalStatus?.[1].percentage) ||
                "0"
              }
            />
          </div>
        </CardSection>
      </Card>
    </div>
  );
}

function DonutChart({
  data,
}: {
  data: { label: string; percentage: string | number; count: number }[];
}) {
  const colors = ["#43B97F", "#154B1B", "#43B97F", "#154B1B"];
  let cumulativeOffset = 0;

  type ChartData = {
    label: string;
    percentage: number;
    count: number;
    normalizedPercentage?: number;
  };

  const processedData: ChartData[] = data
    .map((item) => ({
      ...item,
      percentage: Number(item.percentage),
    }))
    .filter((item) => item.percentage > 0 && !isNaN(item.percentage));

  const totalPercentage = processedData.reduce(
    (sum, item) => sum + item.percentage,
    0
  );
  const normalizedData: (ChartData & { normalizedPercentage: number })[] =
    totalPercentage > 0
      ? processedData.map((item) => ({
          ...item,
          normalizedPercentage: (item.percentage / totalPercentage) * 100,
        }))
      : processedData.map((item) => ({
          ...item,
          normalizedPercentage: 0,
        }));
  return (
    <div className="relative w-40 h-40">
      <svg viewBox="0 0 36 36" className="w-full h-full">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          strokeWidth="3"
        />
        {normalizedData.map((item, idx) => {
          const dashLength = item.normalizedPercentage;
          const dashOffset = 100 - cumulativeOffset - dashLength;
          cumulativeOffset += dashLength;

          return (
            <path
              key={item.label}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke={
                item.label === "Rented"
                  ? "#43B97F"
                  : item.label === "Completed"
                  ? "#154B1B"
                  : colors[idx % colors.length]
              }
              strokeWidth="3"
              strokeDasharray={`${dashLength} ${100 - dashLength}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
    </div>
  );
}

function StatusItem({
  color,
  label,
  percentage,
}: {
  color: string;
  label: string;
  percentage: string;
}) {
  return (
    <>
      <Group className="p-1">
        <ThemeIcon size="sm" radius="sm" color={color} />
        <Text size="sm">{label}</Text>
        <Text size="sm">{percentage}%</Text>
      </Group>
    </>
  );
}
