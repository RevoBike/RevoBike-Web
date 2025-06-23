import React from "react";
import {
  Card,
  TextInput,
  Button,
  Stack,
  Avatar,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { IconUser, IconPhone, IconEdit, IconMail } from "@tabler/icons-react";

interface ProfileModalProps {
  opened: boolean;
  onClose: () => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  setUser: (user: { name: string; email: string; phone: string }) => void;
  onSave: () => void;
}

const ProfileModal = ({
  opened,
  onClose,
  isEditing,
  setIsEditing,
  user,
  setUser,
  onSave,
}: ProfileModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Profile"
      centered
      size="md"
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
        <div className="flex items-center justify-between mb-4">
          <div>
            <Avatar size="lg" radius="xl" className="bg-[#154B1B] text-white">
              {user && user.name && user.name
                ? user.name.charAt(0).toUpperCase()
                : "U"}
            </Avatar>
          </div>
          <div className="">
            <ActionIcon
              variant="light"
              className="bg-[#154B1B] text-white"
              onClick={() => setIsEditing((prev: boolean) => !prev)}
            >
              <IconEdit size={20} />
            </ActionIcon>
          </div>
        </div>
        <Stack gap="md">
          <TextInput
            label="Name"
            placeholder="Enter your name"
            value={user?.name}
            onChange={(e) => setUser({ ...user, name: e.currentTarget.value })}
            radius="md"
            disabled={!isEditing}
            leftSection={<IconUser size={16} />}
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
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={user?.email}
            onChange={(e) => setUser({ ...user, email: e.currentTarget.value })}
            type="email"
            radius="md"
            disabled={!isEditing}
            leftSection={<IconMail size={16} />}
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
          <TextInput
            label="Phone"
            placeholder="Enter your phone number"
            value={user?.phone}
            onChange={(e) => setUser({ ...user, phone: e.currentTarget.value })}
            type="tel"
            radius="md"
            disabled={!isEditing}
            leftSection={<IconPhone size={16} />}
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
          {isEditing && (
            <Button
              radius="md"
              onClick={onSave}
              className="bg-[#154B1B] text-white hover:bg-green-600 w-full"
            >
              Save Profile
            </Button>
          )}
        </Stack>
      </Card>
    </Modal>
  );
};

export default ProfileModal;
