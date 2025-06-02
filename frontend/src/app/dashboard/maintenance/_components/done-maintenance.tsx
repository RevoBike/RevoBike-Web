"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DoneBikeMaintenance } from "@/app/api/maintenance-api";
import { notifications } from "@mantine/notifications";
import { Bike } from "@/app/interfaces/bike";

interface MaintenanceBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bike: Bike | null;
}

const DoneBikeMaintenanceModal = ({
  opened,
  onClose,
  bike,
}: MaintenanceBikeModalProps) => {
  const queryClient = useQueryClient();

  const doneMutation = useMutation({
    mutationFn: DoneBikeMaintenance,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Bike status updated successfully",
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
    doneMutation.mutate(bike?._id || "");
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Confirm Maintenance Completion
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
          Are you sure you want to mark the maintenance of bike{" "}
          <Text span fw={600} c="gray.9">
            {bike?.bikeId}
          </Text>{" "}
          done ?
        </Text>
        <Text
          size="sm"
          c="blue.6"
          fw={500}
          style={{
            backgroundColor: "rgba(0, 0, 251, 0.2)",
            padding: "8px 12px",
            borderRadius: "4px",
            borderLeft: "4px solid blue",
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
            Done
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DoneBikeMaintenanceModal;
