"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Group,
  Text,
  Image,
  Table,
  Progress,
  Badge,
  Grid,
  Card,
  Paper,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { io } from "socket.io-client";
import { GetBike } from "@/app/api/bikes-api";
import { format } from "date-fns";
import QRCode from "react-qr-code";

interface BikeDetailsModalProps {
  opened: boolean;
  onClose: () => void;
  bikeId: string | null;
}

interface FormatDate {
  (date: string | null | undefined): string;
}

const bikeIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapCenter({ coordinates }: { coordinates: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (coordinates[0] !== 0 && coordinates[1] !== 0) {
      map.setView([coordinates[1], coordinates[0]], 15);
    }
  }, [coordinates, map]);
  return null;
}

const BikeDetailsModal: React.FC<BikeDetailsModalProps> = ({
  opened,
  onClose,
  bikeId,
}) => {
  const [location, setLocation] = useState<[number, number]>([0, 0]);

  const {
    data: bike,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bike", bikeId],
    queryFn: () => GetBike(bikeId),
    enabled: !!bikeId,
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
      size="xl"
      styles={{
        body: { maxHeight: "80vh", overflowY: "auto" },
        title: { color: "#1A202C" },
      }}
    >
      <Grid>
        <Grid.Col>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
              <Image
                src={
                  `http://localhost:5000/${bike?.data?.imgUrl}` ||
                  "https://via.placeholder.com/300"
                }
                height={200}
                alt={bike?.data?.model}
              />
            </Card.Section>
            <Text size="lg" mt="md">
              Bike Image
            </Text>
          </Card>
        </Grid.Col>
        <Grid.Col>
          <Card
            shadow="sm"
            padding="lg"
            radius="md"
            withBorder
            style={{ height: "100%" }}
          >
            <Card.Section>
              <MapContainer
                center={[9.0141, 38.7054]}
                zoom={15}
                style={{ height: "200px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {location[0] !== 0 && location[1] !== 0 && (
                  <Marker position={[location[1], location[0]]} icon={bikeIcon}>
                    <Popup>
                      <Text>{bike?.data.model}</Text>
                      <Text size="sm">Status: {bike?.data?.status}</Text>
                      <Text size="sm">
                        Location: {location[1].toFixed(4)},{" "}
                        {location[0].toFixed(4)}
                      </Text>
                    </Popup>
                  </Marker>
                )}
                <MapCenter coordinates={location} />
              </MapContainer>
            </Card.Section>
            <Text size="lg" mt="md">
              Real-Time Location
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={12}>
          <div className=" shadow-lg p-4 bg-customBlue rounded-md text-white">
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
            <Group>
              <div className="mt-6">
                <Text size="sm" className="text-gray-400 mb-2">
                  QR Code
                </Text>
                {bike?.data?.qrCode && (
                  <QRCode value={bike.data.qrCode} size={128} />
                )}
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
          <div className=" shadow-lg p-4 bg-customBlue rounded-md text-white">
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
            {bike && bike?.data?.maintenanceHistory?.length > 0 && (
              <>
                <Text size="md" mb="sm">
                  Maintenance History
                </Text>
                <Table highlightOnHover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Technician</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bike?.data?.maintenanceHistory &&
                      bike?.data?.maintenanceHistory.map((entry, index) => (
                        <tr key={index}>
                          <td>{formatDate(entry.date)}</td>
                          <td>{entry.type || "N/A"}</td>
                          <td>{entry.description || "N/A"}</td>
                          <td>{entry.technician || "N/A"}</td>
                          <td>{entry.cost ? `$${entry.cost}` : "N/A"}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </>
            )}
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
          <div className=" shadow-lg p-4 bg-customBlue rounded-md text-white">
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
