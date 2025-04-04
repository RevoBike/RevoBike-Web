"use client";

import { useForm } from "@mantine/form";
import { Button, Group, Modal, Stack, Text, Select } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

const UpdateUserRoleModal = ({ opened, onClose, user, onUpdate }) => {
  const form = useForm({
    initialValues: { role: user?.role || "" },
    validate: {
      role: (value) => (!value ? "Role is required" : null),
    },
  });

  const handleSubmit = (values) => {
    onUpdate({ ...user, role: values.role });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Update Role: {user?.name}
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
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="lg">
          <Select
            label="Role"
            placeholder="Select user's role"
            required
            data={[
              { value: "admin", label: "Admin" },
              { value: "manager", label: "Manager" },
              { value: "user", label: "User" },
            ]}
            {...form.getInputProps("role")}
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
              leftSection={<IconEdit size={16} />}
              styles={{
                root: {
                  backgroundColor: "#212529",
                  "&:hover": { backgroundColor: "#343a40" },
                },
              }}
            >
              Update Role
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateUserRoleModal;
