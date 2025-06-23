"use client";

import { Button, Group, Loader, Modal, Stack, Text } from "@mantine/core";
import { User } from "@/app/interfaces/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteUser } from "@/app/api/user";
import { notifications } from "@mantine/notifications";

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}

const DeleteUserModal = ({ opened, onClose, user }: DeleteUserModalProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteUser,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "User deleted successfully",
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userMetrics"] });
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate({ id: user?._id || "" });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Confirm User Deletion
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
          Are you sure you want to delete the user{" "}
          <Text span fw={600} c="gray.9">
            {user?.name}
          </Text>{" "}
          with email{" "}
          <Text span fw={600} c="gray.9">
            {user?.email}
          </Text>
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
            className="bg-[#154B1B] text-white hover:bg-green-600"
          >
            {deleteMutation.isPending ? <Loader /> : "Delete"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteUserModal;
