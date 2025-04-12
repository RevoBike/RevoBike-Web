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

const Remainder = () => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder className="mt-2">
      <CardSection className="p-2">
        <div position="apart" mb="md" className="flex flex-row justify-between">
          <Title order={5}>Alerts</Title>
          <Button variant="subtle" size="xs" radius="md">
            <IconPlus size={16} />
          </Button>
        </div>
      </CardSection>
      <CardSection>
        <Stack spacing="sm" className="p-2">
          <ReminderItem
            text="Inspect and service the fleet vehicles."
            date="2028-08-10"
          />
          <ReminderItem
            text="Update the car rental pricing plans for the upcoming season."
            date="2028-08-12"
          />
          <ReminderItem
            text="Review customer feedback and implement improvements."
            date="2028-08-15"
          />
        </Stack>
      </CardSection>
    </Card>
  );
};

function ReminderItem({ text, date }) {
  return (
    <div className="bg-blue-100 flex flex-row p-2 gap-2 justify-center rounded-lg shadow-sm">
      <ThemeIcon size="sm" radius="xl" color="red">
        <IconAlertCircle size={12} />
      </ThemeIcon>
      <div>
        <Text size="sm">{text}</Text>
        <Text size="xs">{date}</Text>
      </div>
    </div>
  );
}

export default Remainder;
