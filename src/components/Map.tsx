"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import { Navigation } from "lucide-react";

// Fix for default marker icons
const DefaultIcon = typeof window !== 'undefined' ? L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
}) : null;

// User Location Icon (Cyan Pulse)
const UserIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'user-location-marker',
  html: `<div class="w-4 h-4 bg-[#00f2ff] rounded-full border-2 border-white shadow-[0_0_10px_#00f2ff] animate-pulse"></div>`,
  iconSize: [16, 16],
}) : null;

if (typeof window !== 'undefined' && DefaultIcon) {
  L.Marker.prototype.options.icon = DefaultIcon;
}

function MapController({ center, selectedId, markers }: { center: [number, number], selectedId: string | null, markers: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (selectedId) {
      const selected = markers.find(m => m.id === selectedId);
      if (selected) {
        map.setView([selected.lat, selected.lng], 15, { animate: true });
      }
    } else {
      map.setView(center, 13, { animate: true });
    }
  }, [selectedId, center, map, markers]);
  return null;
}

export interface Charger {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  speed: number;
  price: number;
  isGreen: boolean;
  load: number;
}

interface MapProps {
  searchQuery?: string;
  selectedChargerId?: string | null;
  onChargersUpdate?: (chargers: Charger[]) => void;
}

export default function Map({ searchQuery, selectedChargerId, onChargersUpdate }: MapProps) {
  const [centerPos, setCenterPos] = useState<[number, number]>([37.7749, -122.4194]);
  const [nearbyChargers, setNearbyChargers] = useState<Charger[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const markerRefs = useRef<{[key: string]: L.Marker}>({});

  const generateRandomName = () => {
    const prefixes = ["Hyper", "Eco", "Volt", "Spark", "Green", "Direct", "Flow", "Apex", "Nova", "Flux"];
    const suffixes = ["Node", "Station", "Hub", "Plug", "Grid", "Point", "Link", "Core", "Nexus", "Port"];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${Math.floor(100 + Math.random() * 899)}`;
  };

  const generateFakeChargers = useCallback((lat: number, lng: number, locationName?: string) => {
    const chargers: Charger[] = [];
    for (let i = 0; i < 6; i++) {
      chargers.push({
        id: `fake-${Math.random()}-${i}`,
        name: generateRandomName(),
        address: locationName || "Near your location",
        lat: lat + (Math.random() - 0.5) * 0.04,
        lng: lng + (Math.random() - 0.5) * 0.04,
        speed: [7, 11, 22, 50, 150, 350][Math.floor(Math.random() * 6)],
        price: Number((0.2 + Math.random() * 0.4).toFixed(2)),
        isGreen: Math.random() > 0.4,
        load: Math.random(),
      });
    }
    setNearbyChargers(chargers);
    if (onChargersUpdate) onChargersUpdate(chargers);
  }, [onChargersUpdate]);

  const findMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCenterPos([latitude, longitude]);
      generateFakeChargers(latitude, longitude, "Your current location");
      setIsLocating(false);
    }, (error) => {
      console.error(error);
      generateFakeChargers(centerPos[0], centerPos[1], "San Francisco (Fallback)");
      setIsLocating(false);
    });
  }, [centerPos, generateFakeChargers]);

  useEffect(() => {
    findMe();
  }, []); // Only on mount

  useEffect(() => {
    if (selectedChargerId && markerRefs.current[selectedChargerId]) {
      markerRefs.current[selectedChargerId].openPopup();
    }
  }, [selectedChargerId]);

  useEffect(() => {
    if (!searchQuery) return;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          const name = data[0].display_name.split(',')[0];
          setCenterPos([lat, lon]);
          generateFakeChargers(lat, lon, `Near ${name}`);
        }
      } catch (err) {
        console.error(err);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [searchQuery, generateFakeChargers]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-0">
      <MapContainer
        center={centerPos}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={centerPos} selectedId={selectedChargerId || null} markers={nearbyChargers} />
        <Marker position={centerPos} icon={UserIcon as any}>
          <Popup><div className="text-black font-bold text-xs">Search Focus</div></Popup>
        </Marker>
        {nearbyChargers.map((charger) => (
          <Marker 
            key={charger.id} 
            position={[charger.lat, charger.lng]}
            ref={(ref) => { if (ref) markerRefs.current[charger.id] = ref; }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px] bg-[#1a1a1a] text-white">
                <h3 className="font-bold text-lg mb-1">{charger.name}</h3>
                <div className="flex flex-wrap gap-2 mb-4 mt-2">
                  <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-bold rounded-full border border-primary/30">{charger.speed} kW</span>
                  {charger.isGreen && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded-full border border-green-500/30">☀️ Solar</span>}
                  {charger.load > 0.8 && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded-full border border-red-500/30">⚡ High Load</span>}
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="font-bold text-primary">${charger.price}/kWh</span>
                  <button className="px-3 py-1.5 bg-primary text-black text-[10px] font-bold rounded-lg hover:bg-white transition-colors">Book Now</button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button 
        onClick={findMe}
        disabled={isLocating}
        className="absolute bottom-6 right-6 z-[1000] w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)] hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
      >
        <Navigation className={`text-black w-6 h-6 fill-current ${isLocating ? 'animate-spin' : ''}`} />
      </button>
    </div>
  );
}
