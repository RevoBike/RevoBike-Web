"use client";

import React from "react";
import { Card, PasswordInput, Button, Stack, Modal } from "@mantine/core";
import { IconLock } from "@tabler/icons-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChangePassword, GetProfile } from "@/app/api/user";
import { notifications } from "@mantine/notifications";

interface PasswordModalProps {
  opened: boolean;
  onClose: () => void;
}

const PasswordModal = ({ opened, onClose }: PasswordModalProps) => {
  const [previousPassword, setPreviousPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetProfile,
  });

  const passwordMutation = useMutation({
    mutationFn: ChangePassword,
    onSuccess: () => {
      notifications.show({
        title: "Success",
        message: "Password changed successfully",
        color: "green",
        autoClose: 1000,
        withCloseButton: true,
        position: "top-right",
      });
      setPreviousPassword("");
      setNewPassword("");
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
  });

  const onSave = () => {
    passwordMutation.mutate({
      email: profile?.email || "",
      oldPassword: previousPassword,
      newPassword,
    });
  };
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Change Password"
      centered
      size="sm"
      radius="md"
      styles={{
        title: {
          color: "#111827",
          fontWeight: 600,
        },
      }}
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 0.5,
      }}
    >
      <Card withBorder radius="md" p="lg">
        <Stack gap="md">
          <PasswordInput
            label="Previous Password"
            placeholder="Enter previous password"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.currentTarget.value)}
            radius="md"
            leftSection={<IconLock size={16} />}
            styles={{
              label: { color: "gray.7", fontWeight: 500 },
              input: {
                borderColor: "gray.3",
                "&:focus": {
                  borderColor: "#154B1B",
                  boxShadow: `0 0 0 2px #154B1B40`,
                },
              },
            }}
          />
          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.currentTarget.value)}
            radius="md"
            leftSection={<IconLock size={16} />}
            styles={{
              label: { color: "gray.7", fontWeight: 500 },
              input: {
                borderColor: "gray.3",
                "&:focus": {
                  borderColor: "#154B1B",
                  boxShadow: `0 0 0 2px #154B1B40`,
                },
              },
            }}
          />
          <Button
            color="#154B1B"
            radius="md"
            onClick={onSave}
            className="bg-[#154B1B] hover:bg-green-600 w-full"
          >
            Change Password
          </Button>
        </Stack>
      </Card>
    </Modal>
  );
};

export default PasswordModal;
