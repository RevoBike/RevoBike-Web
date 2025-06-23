"use client";

import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Select,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateAdmin } from "@/app/api/user";
import { notifications } from "@mantine/notifications";

interface AddUserModalProps {
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  phone_number: string;
  role: string;
}

const AddUserModal = ({ opened, onClose }: AddUserModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: { name: "", email: "", role: "", phone_number: "" },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "Name must be at least 2 characters" : null,
      email: (value) =>
        /^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email address",
      phone_number: (value) =>
        /^\d{10}$/.test(value) ? null : "Phone number must be 10 digits",
      role: (value) => (!value ? "Role is required" : null),
    },
  });

  const createMutation = useMutation({
    mutationFn: CreateAdmin,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "User added successfully",
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
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["userMetrics"] });
    },
  });

  const handleSubmit = (values: FormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Add New User
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
            label="Name"
            placeholder="Enter user's name"
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
            label="Email"
            placeholder="Enter user's email"
            required
            {...form.getInputProps("email")}
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
            label="Phone"
            placeholder="Enter user's phone number"
            required
            {...form.getInputProps("phone_number")}
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
            label="Role"
            placeholder="Select user's role"
            required
            data={[
              { value: "Admin", label: "Admin" },
              { value: "SuperAdmin", label: "Superadmin" },
              // { value: "User", label: "User" },
            ]}
            {...form.getInputProps("role")}
            radius="md"
            classNames={{
              input: "text-gray-800",
              dropdown: "bg-white text-black",
              label: "text-gray-800 text-sm mb-2",
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
              {createMutation.isPending ? <Loader /> : "Add"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddUserModal;
