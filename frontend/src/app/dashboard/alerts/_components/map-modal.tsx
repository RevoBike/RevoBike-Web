"use client";

import { Modal, Text, Box } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { GetAlertLocation } from "@/app/api/alerts";
import { useEffect } from "react";
interface MapModalProps {
  opened: boolean;
  onClose: () => void;
}

const MapModal = ({ opened, onClose }: MapModalProps) => {
  const { data: alerts } = useQuery({
    queryKey: ["alertsLocations"],
    queryFn: GetAlertLocation,
    refetchInterval: 5000,
  });

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
        <Text size="lg" fw={700} c="gray.9">
          Alerts
        </Text>
      }
      centered
      radius="md"
      size="lg"
      styles={{
        header: {
          padding: "16px 24px",
          borderBottom: "1px solid #e9ecef",
        },
        body: {
          padding: "24px",
        },
      }}
      fullScreen
      transitionProps={{ transition: "fade", duration: 200 }}
    >
      <Box>
        <MapContainer
          center={[8.885430393300563, 38.809710479708315]}
          zoom={15}
          style={{ height: "570px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          {alerts &&
            alerts.map((alert, index) => (
              <Marker
                key={index}
                position={[alert.coordinates[0], alert.coordinates[1]]}
              >
                <Popup>
                  {" "}
                  <Text>
                    <strong>Location:</strong> {alert.bikeId}
                  </Text>
                  <Text>
                    <strong>Coordinates:</strong> {alert.coordinates[0]},{" "}
                    {alert.coordinates[1]}
                  </Text>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </Box>
    </Modal>
  );
};

export default MapModal;
