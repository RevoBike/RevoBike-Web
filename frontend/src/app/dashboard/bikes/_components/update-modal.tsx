"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Select,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";

interface EditBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bike: { model: string; station: string; type: string } | null;
  onUpdate: (updatedBike: {
    model?: string;
    station: string;
    type: string;
  }) => void;
}

const EditBikeModal: React.FC<EditBikeModalProps> = ({
  opened,
  onClose,
  bike,
  onUpdate,
}) => {
  const form = useForm({
    initialValues: bike || { station: "", type: "" },
    validate: {
      station: (value) => (!value ? "Status is required" : null),

      type: (value) =>
        value.length < 3 ? "Type must be at least 3 characters" : null,
    },
  });

  const handleSubmit = (values) => {
    onUpdate({ ...bike, ...values });
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Edit Bike: {bike?.model}
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
          <Select
            label="Station"
            placeholder="Tuludimtu"
            required
            data={[
              { value: "tuludimtu", label: "Tuludimtu" },
              { value: "akaki", label: "Akaki" },
              { value: "piasa", label: "Piyasa" },
            ]}
            {...form.getInputProps("station")}
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
              Update Bike
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
};

export default EditBikeModal;
