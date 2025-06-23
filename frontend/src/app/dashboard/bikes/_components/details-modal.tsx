"use client";

import { useState, useEffect } from "react";
import { Modal, Group, Text, Progress, Badge, Grid, Card } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { io } from "socket.io-client";
import { GetBike } from "@/app/api/bikes-api";
import { format } from "date-fns";
import L from "leaflet";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface BikeDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  bikeId: string | null;
}

interface FormatDate {
  (date: string | null | undefined): string;
}

const BikeDetailsModal: React.FC<BikeDetailsModalProps> = ({
  opened,
  onClose,
  bikeId,
}) => {
  const [location, setLocation] = useState<[number, number]>([
    8.885430393300563, 38.809710479708315,
  ]);
  const { data: bike } = useQuery({
    queryKey: ["bike", bikeId],
    queryFn: () => GetBike(bikeId),
    enabled: !!bikeId,
    refetchInterval: 5000,
  });

  useEffect(() => {
    const socket = io("http://localhost:5000", { reconnection: true });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("bikeLocationUpdated", (update) => {
      if (update.bikeId === bikeId) {
        setLocation([update.coordinates[1], update.coordinates[0]]);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [bikeId]);

  useEffect(() => {
    if (bike?.data?.currentLocation?.coordinates) {
      setLocation(bike.data.currentLocation.coordinates);
    }
  }, [bike]);

  const formatDate: FormatDate = (date) =>
    date ? format(new Date(date), "PPp") : "N/A";

  // if (isLoading) {
  //   return <Text>Loading bike details...</Text>;
  // }

  // if (error) {
  //   return <Text color="red">Error: {error?.message || "Bike not found"}</Text>;
  // }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Bike Details: ${bike?.data?.model}`}
      size="lg"
      styles={{
        body: { maxHeight: "80vh", overflowY: "auto" },
        title: { color: "#1A202C", fontWeight: 700 },
      }}
      overlayProps={{
        backgroundOpacity: 0.7,
        blur: 0.5,
      }}
    >
      <Grid>
        <Grid.Col>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ height: "100%" }}
          >
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
                  center={location}
                  zoom={15}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={location}>
                    <Popup>
                      <Text>
                        <strong>Bike ID:</strong> {bike?.data.bikeId}
                      </Text>
                      <Text>
                        <strong>Coordinates:</strong>{" "}
                        {bike?.data.currentLocation.coordinates[0]},{" "}
                        {bike?.data.currentLocation.coordinates[1]}
                      </Text>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </Card>
            <Text size="lg" mt="md">
              Real-Time Location
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-[#154B1B] rounded-md text-white">
            <Text size="lg" mb="md">
              General Information
            </Text>
            <Group>
              <div>
                <Text size="sm" className="text-gray-400">
                  Model
                </Text>
                <Text>{bike?.data.model}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Status
                </Text>
                <Badge
                  color={bike?.data.status === "available" ? "green" : "red"}
                >
                  {bike?.data?.status}
                </Badge>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Current Station
                </Text>
                <Text>{bike?.data?.currentStation}</Text>
              </div>
            </Group>

            <Group mt="md">
              <div>
                <Text size="sm" className="text-gray-400">
                  Geofence Status
                </Text>
                <Text>{bike?.data?.geofenceStatus}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Manufacturer
                </Text>
                <Text>{bike?.data?.manufacturer || "N/A"}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Year
                </Text>
                <Text>{formatDate(bike?.data?.createdAt) || "N/A"}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Color
                </Text>
                <Text>{bike?.data?.color || "N/A"}</Text>
              </div>
            </Group>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-white rounded-md text-gray-800">
            <Text size="lg" mb="md">
              Battery and Power
            </Text>
            <Group>
              <div>
                <Text size="sm">Battery Level</Text>
                <Progress
                  value={bike?.data?.batteryLevel || 0}
                  size="lg"
                  color="blue"
                  style={{ width: 200 }}
                />
                <Text>{bike?.data?.batteryLevel}%</Text>
              </div>
              <div>
                <Text size="sm">Battery Health</Text>
                <Progress
                  value={bike?.data?.batteryHealth || 0}
                  size="lg"
                  color="green"
                  style={{ width: 200 }}
                />
                <Text>{bike?.data?.batteryHealth}%</Text>
              </div>
              <div>
                <Text size="sm">Last Charged</Text>
                <Text>{formatDate(bike?.data?.lastCharged)}</Text>
              </div>
            </Group>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-[#154B1B] rounded-md text-white">
            <Text size="lg" mb="md">
              Maintenance
            </Text>
            <Group mb="md">
              <div>
                <Text size="sm" className="text-gray-400">
                  Last Maintenance
                </Text>
                <Text>{formatDate(bike?.data?.lastMaintenance)}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Next Maintenance
                </Text>
                <Text>{formatDate(bike?.data?.nextMaintenance)}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Maintenance Notes
                </Text>
                <Text>{bike?.data?.maintenanceNotes || "None"}</Text>
              </div>
            </Group>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-white rounded-md text-gray-800">
            <Text size="lg" mb="md">
              Usage Statistics
            </Text>
            <Group>
              <div>
                <Text size="sm" className="text-gray-400">
                  Total Rides
                </Text>
                <Text>{bike?.data?.totalRides}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Total Distance
                </Text>
                <Text>{bike?.data?.totalDistance} km</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Last Ride
                </Text>
                <Text>{formatDate(bike?.data?.lastRide)}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Average Speed
                </Text>
                <Text>{bike?.data?.averageSpeed} km/h</Text>
              </div>
            </Group>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-[#154B1B] rounded-md text-white">
            <Text size="lg" mb="md">
              Safety Features
            </Text>
            <Group>
              <div>
                <Text size="sm">Lock Status</Text>
                <Badge
                  color={bike?.data?.lockStatus === "locked" ? "green" : "red"}
                >
                  {bike?.data?.lockStatus}
                </Badge>
              </div>
              <div>
                <Text size="sm">Alarm Status</Text>
                <Badge
                  color={bike?.data?.alarmStatus === "active" ? "green" : "red"}
                >
                  {bike?.data?.alarmStatus}
                </Badge>
              </div>
            </Group>
          </div>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-white rounded-md text-gray-800">
            <Text size="lg" mb="md">
              Insurance and Compliance
            </Text>
            <Group>
              <div>
                <Text size="sm" className="text-gray-400">
                  Insurance Expiry
                </Text>
                <Text>{formatDate(bike?.data?.insuranceExpiry)}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Last Inspection
                </Text>
                <Text>{formatDate(bike?.data?.lastInspection) || "NA"}</Text>
              </div>
              <div>
                <Text size="sm" className="text-gray-400">
                  Next Inspection
                </Text>
                <Text>{formatDate(bike?.data?.nextInspection) || "NA"}</Text>
              </div>
            </Group>
          </div>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};

export default BikeDetailsModal;
