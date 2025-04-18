"use client";

import { useForm } from "@mantine/form";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStation } from "@/app/api/station-api";
import { notifications } from "@mantine/notifications";
import {
  EditStationModalProps,
  HandleSubmitProps,
} from "@/app/interfaces/station";

const EditStationModal: React.FC<EditStationModalProps> = ({
  opened,
  onClose,
  station,
}) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      name: station.name,
      address: station.address,
      capacity: station.capacity,
    },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      address: (value) =>
        value.length < 5 ? "Address must be at least 5 characters" : null,
      capacity: (value) =>
        !/^\d+$/.test(String(value)) || Number(value) < 1
          ? "Capacity must be a positive number"
          : null,
    },
  });

  const updateMutation = useMutation({
    mutationFn: UpdateStation,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Station updated successfully",
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
    },
  });

  const handleSubmit: HandleSubmitProps = (values) => {
    updateMutation.mutate(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Edit Station: {station?.name}
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
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <TextInput
            label="Station Name"
            placeholder="e.g., Central Park"
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
          <TextInput
            label="Address"
            placeholder="e.g., 123 Park Ave"
            required
            {...form.getInputProps("address")}
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
          <TextInput
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
              styles={{
                root: {
                  backgroundColor: "#212529",
                  "&:hover": { backgroundColor: "#343a40" },
                },
              }}
            >
              Update Station
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditStationModal;
