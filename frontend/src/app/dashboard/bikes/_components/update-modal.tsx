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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GetStationsList } from "@/app/api/station-api";
import { notifications } from "@mantine/notifications";
import { Bike } from "@/app/interfaces/bike";
import { UpdateBike } from "@/app/api/bikes-api";

interface UpdateBikeModalProps {
  opened: boolean;
  onClose: () => void;
  bike: Bike | null;
}

interface FormValues {
  model: string;
  station: string | null;
}

const UpdateBikeModal = ({ opened, onClose, bike }: UpdateBikeModalProps) => {
  const queryClient = useQueryClient();

  const form = useForm({
    initialValues: {
      model: bike?.model || "",
      station: bike?.currentStation ?? null,
      image: null,
    },
  });

  const {
    data: stations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stationsList"],
    queryFn: GetStationsList,
  });

  const updateMutation = useMutation({
    mutationFn: UpdateBike,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Bike updated successfully",
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
      queryClient.invalidateQueries({ queryKey: ["stations"] });
      queryClient.invalidateQueries({ queryKey: ["bikesLocations"] });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>Loading...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <Text>{(error as Error).message}</Text>
      </div>
    );
  }
  const handleSubmit = (values: FormValues): void => {
    if (form.validate().hasErrors) return;
    const { model, station } = values;
    updateMutation.mutate({
      id: bike?._id || "",
      model,
      station,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="md" fw={700} c="gray.9">
          Update Bike
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
            label="Bike Model"
            placeholder={bike?.model}
            {...form.getInputProps("model")}
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
            label="Bike Station"
            placeholder={bike?.currentStation}
            data={stations?.data}
            {...form.getInputProps("station")}
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
              className="bg-[#154B1B] text-white  hover:bg-green-600"
            >
              {updateMutation.isPending ? (
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

export default UpdateBikeModal;
