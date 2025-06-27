"use client";

import { useEffect } from "react";
import { Modal, Stack, Text, Group, Badge, Title, Card } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Station } from "@/app/interfaces/station";
import formatDate from "@/app/_utils/format-date";

interface StationDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  station: Station | null;
  setSelectedStation: (station: Station | null) => void;
}

const StationDetailsModal: React.FC<StationDetailsModalProps> = ({
  opened,
  onClose,
  station,
}) => {
  const defaultPosition: [number, number] = [
    8.885430393300563, 38.809710479708315,
  ];
  const position: [number, number] = station?.location?.coordinates
    ? [station.location.coordinates[0], station.location.coordinates[1]]
    : defaultPosition;

  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
      ._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text fw={700} size="lg" className="text-gray-900">
          Station: {station?.name}
        </Text>
      }
      centered
      size="lg"
      radius="lg"
      styles={{
        header: {
          padding: "20px 24px",
          background: "linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%)",
          borderBottom: "none",
        },
        body: {
          padding: "24px",
          backgroundColor: "#ffffff",
          maxHeight: "70vh",
          overflowY: "auto",
        },
        content: {
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          borderRadius: "12px",
        },
      }}
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 0.5,
      }}
    >
      <Stack gap="lg" className="text-gray-800">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Group>
              <Text size="sm" c="dimmed">
                Address:{" "}
                <Text span fw={600} c="dark">
                  {station?.address || "Unknown"}
                </Text>
              </Text>
              <Text size="sm" c="dimmed">
                Capacity:{" "}
                <Text span fw={600} c="dark">
                  {station?.totalSlots} slots
                </Text>
              </Text>
              <div>
                Status:{" "}
                <Badge
                  color={
                    station && station.totalSlots && station.totalSlots > 0
                      ? (station.available_bikes.length / station.totalSlots) *
                          100 >
                        80
                        ? "red"
                        : (station.available_bikes.length /
                            station.totalSlots) *
                            100 <
                          20
                        ? "yellow"
                        : "green"
                      : "gray"
                  }
                  size="lg"
                  radius="sm"
                  variant="light"
                  styles={{
                    root: {
                      textTransform: "none",
                      fontWeight: 600,
                    },
                  }}
                >
                  {station && station.totalSlots && station.totalSlots > 0
                    ? (station.available_bikes.length / station.totalSlots) *
                        100 >
                      80
                      ? "Overloaded"
                      : (station.available_bikes.length / station.totalSlots) *
                          100 <
                        20
                      ? "Underloaded"
                      : "Normal"
                    : "Unknown"}
                </Badge>
              </div>
            </Group>
          </Group>
          <Text size="sm" c="dimmed">
            Last Updated:{" "}
            <Text span fw={600} c="dark">
              {formatDate(station?.updatedAt || "")}
            </Text>
          </Text>
        </Card>
        <Stack>
          <Title order={4} c="gray.9">
            Location Map
          </Title>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <div
              style={{
                height: "300px",
                width: "100%",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <MapContainer
                center={position}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={position}>
                  <Popup>{station?.name || "Station"}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </Card>
        </Stack>
      </Stack>
    </Modal>
  );
};

export default StationDetailsModal;
