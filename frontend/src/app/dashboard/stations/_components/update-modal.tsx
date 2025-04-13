"use client";

import { useForm } from "@mantine/form";
import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

interface Station {
  name: string;
  address: string;
  capacity: string;
}

interface EditStationModalProps {
  opened: boolean;
  onClose: () => void;
  station: Station;
  onUpdate: (updatedStation: Station) => void;
}

const EditStationModal: React.FC<EditStationModalProps> = ({
  opened,
  onClose,
  station,
  onUpdate,
}) => {
  const form = useForm({
    initialValues: station || { name: "", address: "", capacity: "" },
    validate: {
      name: (value) =>
        value.length < 2 ? "Name must be at least 2 characters" : null,
      address: (value) =>
        value.length < 5 ? "Address must be at least 5 characters" : null,
      capacity: (value) =>
        !/^\d+$/.test(value) || value < 1
          ? "Capacity must be a positive number"
          : null,
    },
  });

  const handleSubmit = (values) => {
    onUpdate({ ...station, ...values, capacity: parseInt(values.capacity) });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Edit Station: {station?.name}
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
            label="Station Name"
            placeholder="e.g., Central Park"
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
            label="Address"
            placeholder="e.g., 123 Park Ave"
            required
            {...form.getInputProps("address")}
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
            label="Capacity"
            placeholder="e.g., 20"
            required
            {...form.getInputProps("capacity")}
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
              Update Station
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditStationModal;
