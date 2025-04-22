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
  Text,
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
import { useDisclosure } from "@mantine/hooks";
import { User } from "@/app/interfaces/user";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { GetAllUsers } from "@/app/api/user";
import formatDate from "@/app/_utils/format-date";

export default function UserPage() {
  const limit = 5;
  const [filter, setFilter] = useState<"all" | "User" | "Admin" | "SuperAdmin">(
    "all"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
    useDisclosure(false);

  const [
    detailsModalOpened,
    { open: openDetailsModal, close: closeDetailsModal },
  ] = useDisclosure(false);

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [
    updateModalOpened,
    { open: openUpdateModal, close: closeUpdateModal },
  ] = useDisclosure(false);

  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users", currentPage, limit, searchTerm, filter],
    queryFn: () => GetAllUsers(currentPage, limit, searchTerm, filter),

    placeholderData: keepPreviousData,
  });

  const hasNextPage = users && users.length === limit;

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

  const handleRowClick = (user: User): void => {
    setSelectedUser(user);
    setDetailsModalOpened(true);
  };

  const handleEditClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    openUpdateModal();
  };

  const handleDeleteClick = (user: User, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedUser(user);
    openDeleteModal();
  };

  return (
    <Card padding="lg" withBorder radius="md" shadow="sm">
      <Group justify="end" mb="md">
        <Button
          leftSection={<IconPlus size={16} />}
          onClick={openAddModal}
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
              { value: "User", label: "User" },
              { value: "Admin", label: "Admin" },
              { value: "SuperAdmin", label: "SuperAdmin" },
            ]}
            value={filter}
            onChange={(value) => {
              setFilter(
                (value as "all" | "Admin" | "User" | "SuperAdmin") || "all"
              );
              setCurrentPage(1);
            }}
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
            onChange={(event) => {
              setSearchTerm(event.currentTarget.value);
              setCurrentPage(1);
            }}
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
          {users &&
            users.map((user) => {
              return (
                <Table.Tr
                  key={user._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(user)}
                >
                  <Table.Td>{user._id}</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.email}</Table.Td>
                  <Table.Td>{user.phone_number}</Table.Td>
                  <Table.Td>{user.role}</Table.Td>
                  <Table.Td>{formatDate(user.createdAt)}</Table.Td>
                  <Table.Td className="ml-auto">
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleEditClick(user, e)}
                    >
                      <IconEdit size={18} color="green" />
                    </Button>
                    |
                    <Button
                      size="xs"
                      variant="subtle"
                      onClick={(e) => handleDeleteClick(user, e)}
                    >
                      <IconTrash size={18} color="red" />
                    </Button>
                  </Table.Td>
                </Table.Tr>
              );
            })}
        </Table.Tbody>
      </Table>
      <Container className="flex flex-row justify-center items-center gap-2 mt-5">
        <Button
          className="bg-customBlue text-white w-fit h-fit p-1"
          variant="small"
          onClick={() => {
            setCurrentPage(Math.max(currentPage - 1, 1));
          }}
          disabled={currentPage === 1}
        >
          <IconArrowLeft />
        </Button>
        <Button
          className={`bg-customBlue text-white w-fit h-fit p-1`}
          onClick={() => {
            if (hasNextPage) {
              setCurrentPage((old) => old + 1);
            }
          }}
          disabled={!hasNextPage}
        >
          <IconArrowRight />
        </Button>
      </Container>
      <AddUserModal opened={addModalOpened} onClose={closeAddModal} />
      {/* <UpdateUserRoleModal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        user={selectedUser}
        onUpdate={(updatedUser) =>
          setUsers(
            users.map((s) => (s.id === updatedUser.id ? updatedUser : s))
          )
        }
      /> */}
      {/* <DeleteUserModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        user={selectedUser}
        onDelete={() =>
          setUsers(users.filter((s) => s.id !== selectedUser?.id))
        }
      /> */}

      {/* <UserDetailsModal
        opened={detailsModalOpened}
        onClose={() => setDetailsModalOpened(false)}
        user={selectedUser}
      /> */}
    </Card>
  );
}
