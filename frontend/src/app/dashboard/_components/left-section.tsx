"use client";
import { useState } from "react";
import { TextInput, Stack, Title, Paper } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { CheckBike } from "@/app/api/bikes-api";

export default function CarAvailability() {
  const [carType, setCarType] = useState("");

  const checkMutation = useMutation({
    mutationFn: CheckBike,
    onSuccess: (data) => {
      notifications.show({
        title: "Bike Status",
        message: `Bike ID: ${data.data.bikeId} is ${
          data.data.status ? "available" : "not available"
        }`,
        color: data.data.status ? "green" : "red",
        autoClose: 2000,
        withCloseButton: true,
        position: "top-right",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error?.message || "An error occurred",
        color: "red",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
    },
  });

  const handleCheck = () => {
    checkMutation.mutate(carType);
    setCarType("");
  };

  return (
    <div className="h-fit p-2">
      <Stack>
        <Title order={4} className="text-gray-700">
          Bike Availability
        </Title>{" "}
        <Paper radius="md" p="md" withBorder>
          <Stack>
            <TextInput
              placeholder="Bike ID"
              leftSection={<IconSearch size={16} />}
              value={carType}
              onChange={(e) => setCarType(e.currentTarget.value)}
              radius="md"
              size="md"
              styles={{
                input: {
                  fontSize: "14px",
                },
              }}
            />

            <button
              className="bg-[#154B1B] hover:bg-green-600 text-white text-sm p-2"
              onClick={handleCheck}
            >
              Check
            </button>
          </Stack>
        </Paper>
      </Stack>
    </div>
  );
}
