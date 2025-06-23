"use client";

import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Textarea,
  Loader,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddBikeUnderMaintenance } from "@/app/api/maintenance-api";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";

interface MaintenanceBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bikeId: string;
}

const MaintenanceBikeModal = ({
  opened,
  onClose,
  bikeId,
}: MaintenanceBikeModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      description: "",
      date: new Date(),
      type: "",
      cost: 1,
      technician: "",
    },
    validate: {
      description: (value) =>
        value.trim().length < 5
          ? "Description must be at least 5 characters long"
          : null,
      date: (value) => (!value ? "Date is required" : null),
      cost: (value) => (value < 1 ? "Cost must be at least 1" : null),
    },
  });

  const maintainMutation = useMutation({
    mutationFn: AddBikeUnderMaintenance,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Bike added to maintenance successfully",
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
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["bikesMetrics"] });
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    const { date, description, type, technician, cost } = form.values;
    maintainMutation.mutate({
      bikeId,
      date,
      description,
      type,
      technician,
      cost,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Schedule Maintenance
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
            label="Maintenance type"
            placeholder="e.g., Battery change, etc."
            required
            {...form.getInputProps("type")}
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
            label="Technician"
            placeholder="e.g., John Doe"
            {...form.getInputProps("technician")}
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
          <div className="flex gap-4 w-full">
            <TextInput
              label="Cost"
              placeholder="e.g., 20"
              {...form.getInputProps("cost")}
              radius="md"
              styles={{
                label: {
                  color: "#495057",
                  fontWeight: 500,
                  marginBottom: "8px",
                },
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
              style={{ width: "50%" }}
            />
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              required
              {...form.getInputProps("date")}
              minDate={new Date()}
              radius="md"
              styles={{
                label: {
                  color: "#495057",
                  fontWeight: 500,
                  marginBottom: "6px",
                },
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
              style={{ width: "50%" }}
            />
          </div>

          <Textarea
            label="Description"
            placeholder="e.g., A brief description of the maintenance, etc."
            required
            {...form.getInputProps("description")}
            radius="md"
            styles={{
              label: { color: "#495057", fontWeight: 500, marginBottom: "6px" },
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
              className="bg-[#154B1B] text-white  hover:bg-green-600"
            >
              {maintainMutation.isPending ? (
                <Loader size={20} />
              ) : (
                <span>Schedule</span>
              )}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default MaintenanceBikeModal;
