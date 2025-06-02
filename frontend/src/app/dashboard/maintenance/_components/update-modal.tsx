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
import { UpdateBikeUnderMaintenance } from "@/app/api/maintenance-api";
import { DatePickerInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { Bike } from "@/app/interfaces/bike";

interface MaintenanceBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bike: Bike | null;
}

const UpdateMaintenanceModal = ({
  opened,
  onClose,
  bike,
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
    // validate: {
    //   description: (value) =>
    //     value.trim().length < 5
    //       ? "Description must be at least 5 characters long"
    //       : null,
    //   // cost: (value) => (value <= 0 ? "Cost must be greater than 0" : null),
    //   // technician: (value) =>
    //   //   value.trim().length < 3 ? "Technician name is required" : null,
    // },
  });

  const maintainMutation = useMutation({
    mutationFn: UpdateBikeUnderMaintenance,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Bike maintenance updated successfully",
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
      queryClient.invalidateQueries({ queryKey: ["bikesUnderMaintenance"] });
      queryClient.invalidateQueries({ queryKey: ["bikes"] });
      queryClient.invalidateQueries({ queryKey: ["bikesMetrics"] });
    },
  });

  const handleSubmit = () => {
    if (form.validate().hasErrors) return;
    const { date, description, type, technician, cost } = form.values;
    maintainMutation.mutate({
      bikeId: bike?._id || "",
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
        <Text size="lg" fw={700} c="gray.9">
          Update Maintenance
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
            label="Maintenance type"
            placeholder="e.g., Battery change, etc."
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
                <span>Update</span>
              )}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default UpdateMaintenanceModal;
