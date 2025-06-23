"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { Bike } from "@/app/interfaces/bike";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteBikeMaintenance } from "@/app/api/maintenance-api";
import { notifications } from "@mantine/notifications";

interface DeleteBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bike: Bike | null;
}

const DeleteBikeModal = ({ opened, onClose, bike }: DeleteBikeModalProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteBikeMaintenance,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Maintenance schedule deleted successfully",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
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
      queryClient.invalidateQueries({ queryKey: ["bikesUnderMaintenance"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["bikesMetrics"] });
    },
  });
  const handleDelete = () => {
    deleteMutation.mutate({ bikeId: bike?._id || "" });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Confirm Deletion
        </Text>
      }
      centered
      radius="md"
      size="sm"
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
      <Stack gap="lg">
        <Text size="md" c="gray.7" lineClamp={2}>
          Are you sure you want to delete the maintenance schedule for bike{" "}
          <Text span fw={600} c="gray.9">
            {bike?.bikeId}
          </Text>{" "}
          ?
        </Text>
        <Text
          size="sm"
          c="red.6"
          fw={500}
          style={{
            backgroundColor: "rgba(254, 226, 226, 0.5)",
            padding: "8px 12px",
            borderRadius: "4px",
            borderLeft: "4px solid #f87171",
          }}
        >
          This action cannot be undone.
        </Text>
        <Group justify="flex-end" mt="md" gap="xs">
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
            color="red.7"
            size="md"
            radius="md"
            onClick={handleDelete}
            className="bg-[#154B1B] text-white  hover:bg-green-600"
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteBikeModal;
