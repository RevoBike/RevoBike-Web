"use client";

import { Modal, Text, Box } from "@mantine/core";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Ride } from "@/app/interfaces/rides";

interface MapModalProps {
  opened: boolean;
  onClose: () => void;
  rental: Ride | null;
}

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
// const RentalMapModal = ({ opened, onClose, rental }: MapModalProps) => {
//   console.log("This", rental);
//   const {
//     data: stations,
//     // isLoading,
//     // error,
//   } = useQuery({
//     queryKey: ["stationLocations"],
//     queryFn: GetStationLocation,
//   });

//   //   if (isLoading) {
//   //     return <div>Loading...</div>;
//   //   }

//   //   if (error) {
//   //     return <div>Error: {error.message}</div>;
//   //   }

//   return (
//     <Modal
//       opened={opened}
//       onClose={onClose}
//       title={
//         <Text size="lg" fw={700} c="gray.9">
//           AASTU Stations
//         </Text>
//       }
//       centered
//       radius="md"
//       size="lg"
//       styles={{
//         header: {
//           padding: "16px 24px",
//           borderBottom: "1px solid #e9ecef",
//         },
//         body: {
//           padding: "24px",
//         },
//       }}
//       fullScreen
//       transitionProps={{ transition: "fade", duration: 200 }}
//     >
//       <Box>
//         <MapContainer
//           center={[8.885430393300563, 38.809710479708315]}
//           zoom={15}
//           style={{ height: "570px", width: "100%", borderRadius: "8px" }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//           />
//           {stations &&
//             stations.map((station, index) => (
//               <Marker
//                 key={index}
//                 position={[station.coordinates[0], station.coordinates[1]]}
//               >
//                 <Popup>
//                   {" "}
//                   <Text>
//                     <strong>Location:</strong> {station.name}
//                   </Text>
//                   <Text>
//                     <strong>Coordinates:</strong> {station.coordinates[0]},{" "}
//                     {station.coordinates[1]}
//                   </Text>
//                 </Popup>
//               </Marker>
//             ))}
//         </MapContainer>
//       </Box>
//     </Modal>
//   );
// };

// ...existing imports and code...

const RentalMapModal = ({ opened, onClose, rental }: MapModalProps) => {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Text size="lg" fw={700} c="gray.9">
          Bike Location
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

          {/* Rental Start Location */}
          {rental?.startLocation?.coordinates && (
            <Marker
              position={[
                rental.startLocation.coordinates[0],
                rental.startLocation.coordinates[1],
              ]}
            >
              <Popup>
                <Text>
                  <strong>Start Location</strong>
                </Text>
                <Text>
                  <strong>Coordinates:</strong>{" "}
                  {rental.startLocation.coordinates[0]},{" "}
                  {rental.startLocation.coordinates[1]}
                </Text>
              </Popup>
            </Marker>
          )}

          {rental?.endLocation?.coordinates && (
            <Marker
              position={[
                rental.endLocation.coordinates[0],
                rental.endLocation.coordinates[1],
              ]}
            >
              <Popup>
                <Text>
                  <strong>End Location</strong>
                </Text>
                <Text>
                  <strong>Coordinates:</strong>{" "}
                  {rental.endLocation.coordinates[0]},{" "}
                  {rental.endLocation.coordinates[1]}
                </Text>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </Box>
    </Modal>
  );
};

export default RentalMapModal;

// export default RentalMapModal;
