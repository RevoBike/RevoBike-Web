"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Group,
  Select,
  Table,
  TextInput,
  Container,
} from "@mantine/core";
import {
  IconFilter,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSearch,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import UsersMetrics from "./_components/users-metrics";
import UserDetailsModal from "./_components/details-modal";
import DeleteUserModal from "./_components/delete-modal";
import UpdateUserRoleModal from "./_components/update-modal";
import AddUserModal from "./_components/add-modal";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phoneNumber: string;
  address: string;
}

export default function UserPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filter, setFilter] = useState<"all" | "user" | "admin" | "superadmin">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [detailsModalOpened, setDetailsModalOpened] = useState(false);
  const [addModalOpened, setAddModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
      phoneNumber: "1234567890",
      createdAt: "2023-01-01",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "User",
      phoneNumber: "1234567890",
      createdAt: "2023-01-02",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
      phoneNumber: "1234567890",
      createdAt: "2023-01-03",
    },
  ]);

  const filteredUsers = users.filter((users) => {
    if (filter === "all") return true;
    if (filter === "user") return users.role === "User";
    if (filter === "admin") return users.role === "Admin";
    if (filter === "superadmin") return users.role === "SuperAdmin";
    return true;
  });

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
      <Group justify="end" mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={() => setAddModalOpened(true)}
          className="bg-customBlue text-white hover:bg-blue-950"
        >
          Add User
        </Button>
      </Group>
      <UsersMetrics />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 px-2">
        <div className="w-full sm:w-auto">
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
              dropdown: "bg-white text-black",
              label: "text-gray-800 text-sm",
            }}
          />
        </div>
        <div className="w-full sm:w-auto md:mt-4">
          <TextInput
            placeholder="Search by name or phone"
            leftSection={<IconSearch color="#7E7E7E" size={20} />}
            // value={searchTerm}
            // onChange={(event) => {
            //   setSearchTerm(event.currentTarget.value);
            //   setCurrentPage(1);
            // }}
          />
        </div>
      </div>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr className="bg-customBlue text-white hover:bg-gray-400">
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>PhoneNumber</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>CreatedAt</Table.Th>
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
                <Table.Td>{user.name}</Table.Td>
                <Table.Td>{user.email}</Table.Td>
                <Table.Td>{user.phoneNumber}</Table.Td>
                <Table.Td>{user.role}</Table.Td>
                <Table.Td>{user.createdAt}</Table.Td>
                <Table.Td className="ml-auto">
                  <Button
                    size="xs"
                    variant="subtle"
                    // onClick={() =>
                    //   handleEditClick({
                    //     ...station,
                    //     _id: Number(station._id),
                    //   })
                    // }
                  >
                    <IconEdit size={20} color="green" />
                  </Button>
                  |
                  <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => handleDeleteClick(station)}
                  >
                    <IconTrash size={20} color="red" />
                  </Button>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-customBlue text-white w-fit h-fit p-2"
          variant="small"
          onClick={() => {
            setCurrentPage(Math.max(currentPage - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className={`bg-customBlue text-white w-fit h-fit p-2`}
          // onClick={() => {
          //   if (hasNextPage) {
          //     setCurrentPage((old) => old + 1);
          //   }
          // }}
          // disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>
      <AddUserModal
        opened={addModalOpened}
        onClose={() => setAddModalOpened(false)}
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
