"use client";

import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBike } from "@tabler/icons-react";

const AddBikeModal = ({ opened, onClose, onAdd }) => {
  const form = useForm({
    initialValues: { type: "", station: "" },
    validate: {
      type: (value) =>
        value.length < 3 ? "Type must be at least 3 characters" : null,
      station: (value) => (!value ? "Status is required" : null),
    },
  });

  const handleSubmit = (values) => {
    onAdd(values);
    form.reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Add New Bike
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
            label="Bike Type"
            placeholder="e.g., Road, Mountain, Hybrid"
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
          <Select
            label="Bike Status"
            placeholder="Select status"
            required
            data={[
              { value: "tuludimtu", label: "Tuludimtu" },
              { value: "akaki", label: "Akaki" },
              { value: "piasa", label: "Piyasa" },
            ]}
            {...form.getInputProps("status")}
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
              leftSection={<IconBike size={16} />}
              styles={{
                root: {
                  backgroundColor: "#212529",
                  "&:hover": { backgroundColor: "#343a40" },
                },
              }}
            >
              Add Bike
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default AddBikeModal;
