import { useState } from "react";
import {
  Box,
  Title,
  Group,
  Menu,
  Button,
  Text,
  Stack,
  Flex,
} from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";

export default function BookingsOverview() {
  const [timeframe, setTimeframe] = useState("This Year");

  const bookingsData = [
    { month: "Jan", value: 600 },
    { month: "Feb", value: 900 },
    { month: "Mar", value: 700 },
    { month: "Apr", value: 950 },
    { month: "May", value: 800 },
    { month: "Jun", value: 985 },
    { month: "Jul", value: 750 },
    { month: "Aug", value: 850 },
    { month: "Sep", value: 1000 },
    { month: "Oct", value: 900 },
    { month: "Nov", value: 750 },
    { month: "Dec", value: 950 },
  ];

  const maxValue = Math.max(...bookingsData.map((item) => item.value));
  const highlightedMonth = "Jun";
  const currentMonth = "April 2028";
  const currentValue = 985;

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg mt-10">
      <Group justify="space-between" mb="xl">
        <Title order={5}>Bookings Overview</Title>
        <Menu position="bottom-end">
          <Menu.Target>
            <Button
              variant="outline"
              rightSection={<IconChevronDown size={16} />}
              bg="gray.0"
              c="gray.7"
            >
              {timeframe}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => setTimeframe("This Year")}>
              This Year
            </Menu.Item>
            <Menu.Item onClick={() => setTimeframe("Last Year")}>
              Last Year
            </Menu.Item>
            <Menu.Item onClick={() => setTimeframe("Last 6 Months")}>
              Last 6 Months
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Box pos="relative">
        <Stack
          pos="absolute"
          left={0}
          top={0}
          h="100%"
          justify="space-between"
          py="xs"
          c="gray.6"
          fz="xs"
        >
          <Text>1.2k</Text>
          <Text>900</Text>
          <Text>600</Text>
          <Text>300</Text>
          <Text>0</Text>
        </Stack>
        <Box ml={40} style={{ borderTop: "1px solid #e9ecef" }}>
          <Box pos="relative" h={200} mt="md">
            <Box
              pos="absolute"
              top={-40}
              left="calc(5/12*100%)"
              ta="center"
              w="calc(100%/12)"
            >
              <Text fz="sm" c="gray.6">
                {currentMonth}
              </Text>
              <Text fz="xl" fw={700}>
                {currentValue}
              </Text>
            </Box>

            <Flex justify="space-between" h="100%" align="flex-end">
              {bookingsData.map((item, index) => (
                <Box
                  key={index}
                  w="calc(100%/12 - 8px)"
                  display="flex"
                  style={{ flexDirection: "column", alignItems: "center" }}
                >
                  <Box
                    w="100%"
                    style={{
                      height: `${(item.value / maxValue) * 100}%`,
                      minHeight: "10px",
                      backgroundColor:
                        item.month === highlightedMonth ? "#fa5252" : "#1a365d",
                      borderRadius: "9999px",
                    }}
                  />
                </Box>
              ))}
            </Flex>
          </Box>

          <Flex justify="space-between" mt="xs">
            {bookingsData.map((item, index) => (
              <Box key={index} w="calc(100%/12)" ta="center">
                <Text fz="xs" c="gray.6">
                  {item.month}
                </Text>
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>
    </div>
  );
}
