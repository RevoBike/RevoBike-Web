"use client";
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
import { useQuery } from "@tanstack/react-query";
import { GetRentalStats } from "@/app/api/stats";

export default function BookingsOverview() {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const { data: rentalStats = [] } = useQuery({
    queryKey: ["rentalStats"],
    queryFn: GetRentalStats,
  });

  const maxValue =
    rentalStats.length > 0
      ? Math.max(...rentalStats.map((item) => item.active + item.completed))
      : 0;

  const currentMonth = months[new Date().getMonth()];
  let currentValue = 0;
  if (rentalStats) {
    const currentMonthIndex = new Date().getMonth() + 1;
    const currentMonthStats = rentalStats.find(
      (item) => item.month === currentMonthIndex
    );
    if (currentMonthStats) {
      currentValue =
        (currentMonthStats.active ?? 0) + (currentMonthStats.completed ?? 0);
    }
  }

  return (
    <div className="bg-white shadow-lg p-4 rounded-lg">
      <Group justify="space-between" mb="xl">
        <Title order={4} className="text-gray-500">
          Bookings Overview
        </Title>
        <Menu position="bottom-end">
          <Menu.Target>
            <Button
              variant="outline"
              rightSection={<IconChevronDown size={16} />}
              bg="green.0"
              c="green.7"
            >
              This Year{" "}
            </Button>
          </Menu.Target>
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
              {rentalStats &&
                rentalStats.map((item, index) => (
                  <Box
                    key={index}
                    w="calc(100%/12 - 8px)"
                    display="flex"
                    style={{ flexDirection: "column", alignItems: "center" }}
                  >
                    <Box
                      w="100%"
                      style={{
                        height: `${
                          ((item.active + item.completed) / maxValue) * 100
                        }%`,
                        minHeight: "10px",
                        backgroundColor:
                          item.month === new Date().getMonth() + 1
                            ? "#fa5252"
                            : "#1a365d",
                        borderRadius: "9999px",
                      }}
                    />
                  </Box>
                ))}
            </Flex>
          </Box>

          <Flex justify="space-between" mt="xs">
            {rentalStats &&
              rentalStats.map((item, index) => (
                <Box key={index} w="calc(100%/12)" ta="center">
                  <Text fz="xs" c="gray.6">
                    {months[item.month - 1]}
                  </Text>
                </Box>
              ))}
          </Flex>
        </Box>
      </Box>
    </div>
  );
}
