"use client";

import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { IconTool } from "@tabler/icons-react";
import { useForm } from "@mantine/form";

const MaintenanceBikeModal = ({ opened, onClose, bike, onSchedule }) => {
  const form = useForm({
    initialValues: {
      description: "",
    },
    validate: {
      description: (value) =>
        value.trim().length < 5
          ? "Description must be at least 5 characters long"
          : null,
    },
  });

  const handleSchedule = () => {
    if (form.validate().hasErrors) return;
    onSchedule({ description: form.values.description });
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Schedule Maintenance
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
      <form onSubmit={(e) => e.preventDefault()}>
        <Stack gap="lg">
          <Text size="md" c="gray.7" lineClamp={2}>
            Are you sure you want to schedule maintenance for the bike{" "}
            <Text span fw={600} c="gray.9">
              {bike?.model}
            </Text>{" "}
            of type{" "}
            <Text span fw={600} c="gray.9">
              {bike?.type}
            </Text>
            ?
          </Text>
          <Text
            size="sm"
            c="blue.6"
            fw={500}
            style={{
              backgroundColor: "rgba(219, 234, 254, 0.5)",
              padding: "8px 12px",
              borderRadius: "4px",
              borderLeft: "4px solid #3b82f6",
            }}
          >
            This action will mark the bike as "Under Maintenance."
          </Text>

          {/* Maintenance Description Input */}
          <TextInput
            label="Maintenance Description"
            placeholder="Enter details about the maintenance"
            required
            {...form.getInputProps("description")}
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
              color="blue.7"
              size="md"
              radius="md"
              leftSection={<IconTool size={16} />}
              onClick={handleSchedule}
              styles={{
                root: {
                  padding: "8px 16px",
                  "&:hover": { backgroundColor: "#2563eb" },
                },
              }}
            >
              Schedule
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default MaintenanceBikeModal;
