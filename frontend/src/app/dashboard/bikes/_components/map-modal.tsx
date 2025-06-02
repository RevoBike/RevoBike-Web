import { Modal, Text, Box } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useQuery } from "@tanstack/react-query";
import { GetBikeLocation } from "@/app/api/bikes-api";

interface MapModalProps {
  opened: boolean;
  onClose: () => void;
}

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BikeMapModal = ({ opened, onClose }: MapModalProps) => {
  const { data: bikes } = useQuery({
    queryKey: ["bikesLocations"],
    queryFn: GetBikeLocation,
    refetchInterval: 5000,
  });

  const offsetCoordinates = (coordinates: [number, number], index: number) => {
    const offset = 0.0001 * index;
    return [coordinates[0] + offset, coordinates[1] + offset];
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Bikes Location
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
          {bikes &&
            bikes.map((bike, index) => {
              const adjustedPosition = offsetCoordinates(
                [bike.coordinates[0], bike.coordinates[1]],
                index
              );
              return (
                <Marker
                  key={index}
                  position={adjustedPosition as [number, number]}
                >
                  <Popup>
                    <Text>
                      <strong>Bike ID:</strong> {bike.bikeId}
                    </Text>
                    <Text>
                      <strong>Coordinates:</strong> {bike.coordinates[0]},{" "}
                      {bike.coordinates[1]}
                    </Text>
                  </Popup>
                </Marker>
              );
            })}
        </MapContainer>
      </Box>
    </Modal>
  );
};

export default BikeMapModal;
