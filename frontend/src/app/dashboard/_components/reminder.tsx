"use client";
import {
  Card,
  CardSection,
  Title,
  Button,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { IconPlus, IconAlertCircle } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { GetRecentAlerts } from "@/app/api/alerts";
import { keepPreviousData } from "@tanstack/react-query";

const Remainder = () => {
  const { data: recentAlerts } = useQuery({
    queryKey: ["recentAlerts"],
    queryFn: GetRecentAlerts,
    placeholderData: keepPreviousData,
    refetchInterval: 5000,
  });
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-2">
      <CardSection className="p-2">
        <div className="flex flex-row justify-between">
          <Title order={5}>Alerts</Title>
          <Button variant="subtle" size="xs" radius="md">
            <IconPlus size={16} />
          </Button>
        </div>
      </CardSection>
      <CardSection>
        <Stack className="p-2">
          {recentAlerts && recentAlerts?.length > 0 ? (
            recentAlerts.map((alert) => (
              <ReminderItem
                key={alert._id}
                alertType={alert.alertType}
                text={
                  alert.alertType === "Theft Alert"
                    ? `Possible theft detected for ${alert.bike.bikeId}`
                    : `${alert.bike.bikeId} exited geofence`
                }
                date={new Date(alert.timestamp).toLocaleDateString()}
              />
            ))
          ) : (
            <Text size="sm" color="dimmed">
              No recent alerts.
            </Text>
          )}
        </Stack>
      </CardSection>
    </Card>
  );
};

function ReminderItem({
  alertType,
  text,
  date,
}: {
  alertType?: string;
  text: string;
  date: string;
}) {
  return (
    <div className="bg-blue-100 flex flex-row p-2 gap-2 rounded-lg shadow-sm">
      <ThemeIcon size="sm" radius="xl" color="red">
        <IconAlertCircle size={12} />
      </ThemeIcon>
      <div>
        <Text size="sm">{alertType}</Text>
        <Text size="sm">{text}</Text>
        <Text size="xs">{date}</Text>
      </div>
    </div>
  );
}

export default Remainder;
