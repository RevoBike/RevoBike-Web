"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  Select,
  Loader,
} from "@mantine/core";
import { User } from "@/app/interfaces/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { UpdateRole } from "@/app/api/user";

interface UpdateUserRoleModalProps {
  opened: boolean;
  onClose: () => void;
  user: User | null;
}
interface FormValues {
  role: string;
}

const UpdateUserRoleModal: React.FC<UpdateUserRoleModalProps> = ({
  opened,
  onClose,
  user,
}) => {
  const queryClient = useQueryClient();
  const form = useForm({
    initialValues: { role: user?.role || "" },
    validate: {
      role: (value) => (!value ? "Role is required" : null),
    },
  });

  const updateMutation = useMutation({
    mutationFn: UpdateRole,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Role updated successfully",
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

  const handleSubmit = (values: FormValues): void => {
    updateMutation.mutate({
      role: values.role,
      id: user?._id || "",
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Update Role
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
              { value: "Admin", label: "Admin" },
              { value: "SuperAdmin", label: "Super Admin" },
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
              {updateMutation.isPending ? <Loader /> : "Update"}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateUserRoleModal;
