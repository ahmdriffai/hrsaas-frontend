import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

const customMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="display:flex;align-items:center;justify-content:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

export type MapViewProps = {
  lat: number;
  lng: number;
  zoom?: number;
  radius?: number;
  popupText?: string;
  height?: string;
  scrollWheelZoom?: boolean;
  rememberKey?: string; // unique key untuk localStorage
};

// 🔹 Komponen untuk menyimpan posisi terakhir di localStorage
function MapMemory({ rememberKey }: { rememberKey: string }) {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      localStorage.setItem(
        `map_center_${rememberKey}`,
        JSON.stringify({ lat: center.lat, lng: center.lng, zoom }),
      );
    },
  });
  return null;
}

// 🔹 Komponen untuk auto-center ketika prop lat/lng berubah
function RecenterMap({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapView({
  lat,
  lng,
  zoom = 500,
  radius = 0,
  popupText,
  height = "h-64",
  scrollWheelZoom = false,
  rememberKey = "default",
}: MapViewProps) {
  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat,
    lng,
  });
  const [currentZoom, setCurrentZoom] = useState<number>(zoom);

  // 🔹 Ambil posisi terakhir dari localStorage (jika ada)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(`map_center_${rememberKey}`);
    if (saved) {
      const { lat, lng, zoom } = JSON.parse(saved);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCenter({ lat, lng });
      setCurrentZoom(zoom);
    }
  }, [rememberKey]);

  return (
    <div className={`w-full rounded-lg overflow-hidden border ${height}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={currentZoom}
        scrollWheelZoom={scrollWheelZoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapMemory rememberKey={rememberKey} />
        <RecenterMap lat={lat} lng={lng} />

        <Circle
          center={[lat, lng]}
          radius={radius}
          pathOptions={{ color: "blue", fillOpacity: 0.2 }}
        />
        <Marker position={[lat, lng]} icon={customMarkerIcon}>
          {popupText && <Popup>{popupText}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
