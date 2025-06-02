"use client";

import {
  Button,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TextInput,
  NumberInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateStation } from "@/app/api/station-api";
import { notifications } from "@mantine/notifications";
import { AddStationModalProps, FormValues } from "@/app/interfaces/station";
import stations from "@/app/_lib/stations";

const AddStationModal = ({ opened, onClose }: AddStationModalProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: { name: "", address: "", capacity: 1, location: [] },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      capacity: (value) =>
        value < 1 ? "Capacity must be a positive number" : null,
    },
  });

  const addMutation = useMutation({
    mutationFn: CreateStation,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Station added successfully",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
      form.reset();
      onClose();
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

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      queryClient.invalidateQueries({ queryKey: ["stationMetrics"] });
      queryClient.invalidateQueries({ queryKey: ["stationsList"] });
      queryClient.invalidateQueries({ queryKey: ["stationLocations"] });
    },
  });

  const handleSubmit = (values: FormValues): void => {
    const selectedStation = stations.find(
      (station) => station.value.toString() === values.address
    );
    if (selectedStation) {
      values.address = selectedStation.label;
    } else {
      values.address = "Unknown Address";
    }

    values.location = selectedStation?.value || [
      8.885462193542084, 38.809689022037034,
    ];

    addMutation.mutate(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Add New Station
        </Text>
      }
      centered
      radius="md"
      size="md"
      styles={{
        header: {
          padding: "16px 24px",
          borderBottom: "1px solid #e9ecef",
        },
        body: {
          padding: "24px",
        },
      }}
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 0.5,
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <TextInput
            label="Station Name"
            placeholder="e.g., Tuludimtu Station"
            required
            {...form.getInputProps("name")}
            radius="md"
            styles={{
              label: { color: "#495057", fontWeight: 500, marginBottom: "8px" },
              input: {
                backgroundColor: "#f8f9fa",
                borderColor: "#ced4da",
                "&:focus": {
                  borderColor: "#868e96",
                  boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
                },
              },
              error: { color: "#f03e3e" },
            }}
          />
          <Select
            label="Address"
            placeholder="Select address"
            required
            data={stations.map((station) => ({
              ...station,
              value: station.value.toString(),
            }))}
            {...form.getInputProps("address")}
            radius="md"
            classNames={{
              input: "text-gray-800",
              dropdown: "bg-white text-black",
              label: "text-gray-800 text-sm mb-2",
            }}
          />
          <NumberInput
            label="Capacity"
            placeholder="e.g., 20"
            required
            {...form.getInputProps("capacity")}
            radius="md"
            styles={{
              label: { color: "#495057", fontWeight: 500, marginBottom: "8px" },
              input: {
                backgroundColor: "#f8f9fa",
                borderColor: "#ced4da",
                "&:focus": {
                  borderColor: "#868e96",
                  boxShadow: "0 0 0 2px rgba(134, 142, 150, 0.2)",
                },
              },
              error: { color: "#f03e3e" },
            }}
          />
          <Group justify="flex-end" mt="lg" gap="xs">
            <Button
              variant="subtle"
              color="gray.6"
              size="md"
              radius="md"
              onClick={onClose}
              styles={{
                root: {
                  padding: "8px 16px",
                  "&:hover": { backgroundColor: "#f1f3f5" },
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="gray.9"
              size="sm"
              radius="md"
              className="bg-[#154B1B] text-white hover:bg-green-600"
            >
              {addMutation.isPending ? <Loader size={20} /> : <span>Add</span>}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddStationModal;
