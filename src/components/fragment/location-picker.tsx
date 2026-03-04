/* eslint-disable @typescript-eslint/no-explicit-any */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin } from "lucide-react";

const customMarkerIcon = L.divIcon({
  className: "",
  html: `
    <div style="display:flex;align-items:center;justify-content:center;transform:translateY(-6px);">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#ef4444" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -30],
});

type LatLng = { lat: number; lng: number };
type Location = { lat: number; lng: number; display_name?: string };
type LocationPickerProps = {
  value?: Location | null;
  onChange?: (val: Location | null) => void;
  initialPosition?: LatLng;
  mapHeight?: string;
};

function useDebounced<T>(value: T, delay = 300) {
  const [state, setState] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setState(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return state;
}

function RecenterMap({ center }: { center: LatLng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng]);
  }, [center, map]);
  return null;
}

function MapClickHandler({ onSelect }: { onSelect: (pos: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({
  value = null,
  onChange,
  initialPosition = { lat: -6.2, lng: 106.816666 },
  mapHeight = "h-64",
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Location | null>(value);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 400);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setSelected(value), [value]);

  const center = selected
    ? { lat: selected.lat, lng: selected.lng }
    : initialPosition;

  // Fetch reverse geocoding (untuk klik map)
  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await res.json();
      return (
        data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`
      );
    } catch {
      return `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
    }
  };

  // Fetch search results (Nominatim autocomplete)
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }
    setLoading(true);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        debouncedQuery,
      )}&addressdetails=1&limit=6`,
    )
      .then((r) => r.json())
      .then((data) => setResults(data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  const handleSelect = (r: any) => {
    const loc = {
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      display_name: r.display_name,
    };
    setSelected(loc);
    onChange?.(loc);
  };

  const handleMapClick = async (pos: LatLng) => {
    const name = await fetchLocationName(pos.lat, pos.lng);
    const loc = { lat: pos.lat, lng: pos.lng, display_name: name };
    setSelected(loc);
    onChange?.(loc);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation)
      return alert("Geolocation not supported by your browser");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const name = await fetchLocationName(lat, lng);
        const loc = { lat, lng, display_name: name };
        setSelected(loc);
        onChange?.(loc);
      },
      (err) => alert("Failed to get location: " + err.message),
    );
  };

  return (
    <div className="w-full z-[999]">
      <Label className="mb-2">Cari Lokasi</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex w-full justify-start gap-2">
            <MapPin className="w-4 h-4" />
            <span className="truncate">
              {selected?.display_name || "Select a location"}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[500px] p-2">
          <Card>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Search address or place"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button onClick={handleUseMyLocation} variant="secondary">
                  My Location
                </Button>
              </div>

              {/* Search results */}
              {results.length > 0 && (
                <div className="border rounded max-h-40 overflow-auto">
                  {results.map((r) => (
                    <button
                      key={r.place_id}
                      onClick={() => handleSelect(r)}
                      className="block w-full text-left px-2 py-1 hover:bg-muted"
                    >
                      <div className="font-medium text-sm truncate">
                        {r.display_name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {r.type}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="border rounded max-h-40 overflow-auto">
                  <div className="block w-full text-left px-2 py-1 hover:bg-muted">
                    <div className="font-medium text-sm truncate">
                      Loading...
                    </div>
                  </div>
                </div>
              )}

              {/* Map */}
              <div className={`rounded overflow-hidden border ${mapHeight}`}>
                <MapContainer
                  center={[center.lat, center.lng]}
                  zoom={16}
                  style={{ height: "100%", minHeight: 200 }}
                >
                  <RecenterMap center={center} />
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <MapClickHandler onSelect={handleMapClick} />

                  {selected && (
                    <Marker
                      position={[selected.lat, selected.lng]}
                      icon={customMarkerIcon}
                    >
                      <Popup>{selected.display_name}</Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              {selected && (
                <div className="text-xs text-muted-foreground">
                  <b>Lat:</b> {selected.lat.toFixed(5)} | <b>Lng:</b>{" "}
                  {selected.lng.toFixed(5)}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelected(null);
                    onChange?.(null);
                  }}
                >
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}
