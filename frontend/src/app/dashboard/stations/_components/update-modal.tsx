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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateStation } from "@/app/api/station-api";
import { notifications } from "@mantine/notifications";
import { Station, FormValues } from "@/app/interfaces/station";

interface UpdateStationProps {
  opened: boolean;
  onClose: () => void;
  station: Station | null;
}

const UpdateStationModal = ({
  opened,
  onClose,
  station,
}: UpdateStationProps) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: {
      name: station?.name || "",
      address: station?.address || "",
      capacity: station?.totalSlots ? Number(station.totalSlots) : 0,
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
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["stationMetrics"] });
    },
  });

  const handleSubmit = (values: FormValues): void => {
    if (form.validate().hasErrors) return;
    const { name, address, capacity } = values;
    updateMutation.mutate({
      id: station?._id || "",
      name,
      address,
      capacity: Number(capacity),
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Update Station
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
            placeholder={station?.name}
            value={station?.name}
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
            placeholder={station?.address}
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
          <NumberInput
            label="Capacity"
            placeholder="e.g., 20"
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
              {updateMutation.isPending ? (
                <Loader size={20} />
              ) : (
                <span>Update</span>
              )}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateStationModal;
