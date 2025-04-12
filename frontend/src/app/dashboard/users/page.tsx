"use client";

import { useState } from "react";
import { Button, Card, Group, Select, Table, Title } from "@mantine/core";
import { IconFilter, IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import UsersMetrics from "./_components/users-metrics";
import UserDetailsModal from "./_components/details-modal";
import DeleteUserModal from "./_components/delete-modal";
import UpdateUserRoleModal from "./_components/update-modal";
import AddUserModal from "./_components/add-modal";

export default function UserPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState("all");
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "John Doe",
      email: "john@example.com",
      role: "Admin",
      phoneNumber: "1234567890",
      address: "123 Main St, Cityville",
    },
    {
      id: 2,
      username: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      phoneNumber: "1234567890",
      address: "123 Main St, Cityville",
    },
    {
      id: 3,
      username: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      phoneNumber: "1234567890",
      address: "123 Main St, Cityville",
    },
  ]);

  const filteredUsers = users.filter((users) => {
    if (filter === "all") return true;
    if (filter === "user") return users.role === "User";
    if (filter === "admin") return users.role === "Admin";
    if (filter === "superadmin") return users.role === "SuperAdmin";
    return true;
  });

  interface User {
    id: number;
    username: string;
    email: string;
    role: string;
    phoneNumber: string;
    address: string;
  }

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setDetailsModalOpened(true);
  };

  const handleEditClick = (user, e) => {
    e.stopPropagation();
    selectedUser(user);
    setEditModalOpened(true);
  };

  const handleDeleteClick = (user, e) => {
    e.stopPropagation();
    setSelectedUser(user);
    setDeleteModalOpened(true);
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="space-between" mb="md">
        <Title order={3}>Users Management</Title>
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
          styles={{
            root: {
              backgroundColor: "#212529",
              "&:hover": { backgroundColor: "#343a40" },
            },
          }}
        >
          Add User
        </Button>
      </Group>
      <UsersMetrics />
      <Group mb="md">
        <Select
          label="Filter by role"
          placeholder="Select role"
          data={[
            { value: "all", label: "All" },
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
            { value: "superadmin", label: "SuperAdmin" },
          ]}
          value={filter}
          onChange={setFilter}
          leftSection={<IconFilter size={16} />}
          style={{ width: "200px" }}
          classNames={{
            input: "text-gray-800",
            dropdown: "bg-white",
            item: "hover:bg-gray-100",
          }}
        />
      </Group>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-red-100 text-gray-800">
            <Table.Th>ID</Table.Th>
            <Table.Th>UserName</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>PhoneNumber</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredUsers.map((user) => {
            return (
              <Table.Tr
                key={user.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(user)}
              >
                <Table.Td>{user.id}</Table.Td>
                <Table.Td>{user.username}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.phoneNumber}</Table.Td>
                <Table.Td>{user.address}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
                <Table.Td>
                  <Group>
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleEditClick(user, e)}
                    >
                      <IconEdit size={14} color="green" />
                    </Button>
                    |
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleDeleteClick(user, e)}
                    >
                      <IconTrash size={14} color="red" />
                    </Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <AddUserModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
        onAdd={(newUser) =>
          setUsers([...users, { id: users.length + 1, ...newUser }])
        }
      />
      <UpdateUserRoleModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        user={selectedUser}
        onUpdate={(updatedUser) =>
          setUsers(
            users.map((s) => (s.id === updatedUser.id ? updatedUser : s))
          )
        }
      />
      <DeleteUserModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        user={selectedUser}
        onDelete={() =>
          setUsers(users.filter((s) => s.id !== selectedUser?.id))
        }
      />

      <UserDetailsModal
        opened={detailsModalOpened}
        onClose={() => setDetailsModalOpened(false)}
        user={selectedUser}
      />
    </Card>
  );
}
