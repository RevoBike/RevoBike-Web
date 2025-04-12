"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

interface DeleteUserModalProps {
  opened: boolean;
  onClose: () => void;
  user: { name: string; email: string } | null;
  onDelete: () => void;
}

const DeleteUserModal = ({
  opened,
  onClose,
  user,
  onDelete,
}: DeleteUserModalProps) => {
  const handleDelete = () => {
    onDelete();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
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
            leftSection={<IconTrash size={16} />}
            onClick={handleDelete}
            styles={{
              root: {
                padding: "8px 16px",
                "&:hover": { backgroundColor: "#e03131" },
              },
            }}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default DeleteUserModal;
