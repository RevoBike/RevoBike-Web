import { useState } from "react";
import {
  Table,
  Group,
  Text,
  Badge,
  Select,
  Pagination,
  TextInput,
  Card,
  Stack,
} from "@mantine/core";
import { IconSearch, IconFilter } from "@tabler/icons-react";

export default function BikeBookings() {
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(10);

  const bookings = [
    {
      id: "BK-W2001",
      bookingDate: "Aug 1, 2028",
      clientName: "Alice Johnson",
      bikeType: "Sedan",
      payment: {
        amount: 50,
        status: "Paid",
      },
      status: "Returned",
    },
    {
      id: "BK-W2002",
      bookingDate: "Aug 1, 2028",
      clientName: "Bob Smith",
      bikeType: "Sedan",
      paymentType: "Sedan",
      payment: {
        amount: 350,
        status: "Pending",
      },
      status: "Ongoing",
    },
  ];

  const rows = bookings.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.id}</Table.Td>
      <Table.Td>{element.bookingDate}</Table.Td>
      <Table.Td>{element.clientName}</Table.Td>
      <Table.Td>{element.bikeType}</Table.Td>
      <Table.Td>
        <div spacing={0} className="flex flex-row items-center gap-2">
          <Text size="sm">${element.payment.amount}</Text>
          <Text
            size="sm"
            color={element.payment.status === "Paid" ? "green" : "yellow"}
          >
            {element.payment.status}
          </Text>
        </div>
      </Table.Td>
      <Table.Td>
        <Badge
          color={
            element.status === "Ongoing"
              ? "blue"
              : element.status === "Returned"
              ? "gray"
              : "red"
          }
        >
          {element.status}
        </Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack spacing="lg">
        <div className="flex flex-row justify-between items-center">
          <Text size="xl" weight={600}>
            Bike Bookings
          </Text>
          <Group spacing="sm">
            <TextInput
              rightSection={<IconSearch size={16} />}
              placeholder="Search"
              radius="md"
              size="sm"
              style={{ width: 250 }}
            />
            <Select
              placeholder="Filters"
              radius="md"
              size="sm"
              data={["Scooter", "Pending", "Paid"]}
              rightSection={<IconFilter size={16} />}
            />
          </Group>
        </div>

        <Table highlightOnHover>
          <Table.Thead verticalSpacing="xs">
            <Table.Tr>
              <Table.Th>Booking ID</Table.Th>
              <Table.Th>Booking Date</Table.Th>
              <Table.Th>Client Name</Table.Th>
              <Table.Th>Bike Type</Table.Th>
              <Table.Th>Payment</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>

        <Group position="apart">
          <Group spacing="xs">
            <Text size="sm">Results per page:</Text>
            <Select
              value={resultsPerPage.toString()}
              onChange={(value) => setResultsPerPage(Number(value))}
              data={["5", "10", "20", "50"]}
              radius="md"
              size="sm"
            />
          </Group>
          <Pagination
            total={5}
            page={currentPage}
            onChange={setCurrentPage}
            radius="md"
            size="sm"
          />
        </Group>
      </Stack>
    </Card>
  );
}
