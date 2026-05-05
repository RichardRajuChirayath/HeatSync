"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState, useCallback, useRef } from "react";
import { Navigation, Car as CarIconLucide } from "lucide-react";

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

// Car Marker Icon for Navigation
const CarIcon = typeof window !== 'undefined' ? L.divIcon({
  className: 'car-marker',
  html: `<div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_#00f2ff] border-2 border-white">
          <svg viewBox="0 0 24 24" class="w-6 h-6 text-black fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.5C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2m0 0c0 1.1.9 2 2 2s2-.9 2-2M4 17h10m0 0c0 1.1.9 2 2 2s2-.9 2-2M15 10l-2-3h-3l2 3h3z"/>
          </svg>
         </div>`,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
}) : null;

if (typeof window !== 'undefined' && DefaultIcon) {
  L.Marker.prototype.options.icon = DefaultIcon;
}

function MapController({ center, selectedId, markers, isNavigating }: { center: [number, number], selectedId: string | null, markers: any[], isNavigating: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (selectedId) {
      const selected = markers.find(m => m.id === selectedId);
      if (selected) {
        map.setView([selected.lat, selected.lng], isNavigating ? 17 : 15, { animate: true });
      }
    } else {
      map.setView(center, 13, { animate: true });
    }
  }, [selectedId, center, map, markers, isNavigating]);
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
  rating: number;
  distance: number;
}

interface MapProps {
  searchQuery?: string;
  selectedChargerId?: string | null;
  onChargersUpdate?: (chargers: Charger[]) => void;
  onBookNow?: (charger: Charger) => void;
  onArrival?: () => void;
  mapTheme?: "light" | "dark";
  isNavigating?: boolean;
  targetCharger?: Charger | null;
}

export default function Map({ 
  searchQuery, 
  selectedChargerId, 
  onChargersUpdate, 
  onBookNow, 
  onArrival,
  mapTheme = "dark",
  isNavigating = false,
  targetCharger = null
}: MapProps) {
  const [centerPos, setCenterPos] = useState<[number, number]>([37.7749, -122.4194]);
  const [userPos, setUserPos] = useState<[number, number]>([37.7749, -122.4194]);
  const [nearbyChargers, setNearbyChargers] = useState<Charger[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const markerRefs = useRef<{[key: string]: L.Marker}>({});
  
  const tileUrl = mapTheme === "dark" 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const generateRandomName = () => {
    const prefixes = ["Hyper", "Eco", "Volt", "Spark", "Green", "Direct", "Flow", "Apex", "Nova", "Flux"];
    const suffixes = ["Node", "Station", "Hub", "Plug", "Grid", "Point", "Link", "Core", "Nexus", "Port"];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]} ${Math.floor(100 + Math.random() * 899)}`;
  };

  const generateFakeChargers = useCallback((lat: number, lng: number, locationName?: string) => {
    const chargers: Charger[] = [];
    for (let i = 0; i < 8; i++) {
      const cLat = lat + (Math.random() - 0.5) * 0.06;
      const cLng = lng + (Math.random() - 0.5) * 0.06;
      const dist = Math.sqrt(Math.pow(cLat - lat, 2) + Math.pow(cLng - lng, 2)) * 111;

      chargers.push({
        id: `fake-${Math.random()}-${i}`,
        name: generateRandomName(),
        address: locationName || "Near focus area",
        lat: cLat,
        lng: cLng,
        speed: [7, 11, 22, 50, 150, 350][Math.floor(Math.random() * 6)],
        price: Number((0.2 + Math.random() * 0.4).toFixed(2)),
        isGreen: Math.random() > 0.4,
        load: Math.random(),
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        distance: Number(dist.toFixed(1)),
      });
    }
    setNearbyChargers(chargers);
    if (onChargersUpdate) onChargersUpdate(chargers);
  }, [onChargersUpdate]);

  // Fetch Route and Animate Car along Real Roads
  useEffect(() => {
    if (isNavigating && targetCharger) {
      const fetchRoute = async () => {
        try {
          // OSRM API for road routing: [lng,lat];[lng,lat]
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userPos[1]},${userPos[0]};${targetCharger.lng},${targetCharger.lat}?overview=full&geometries=geojson`);
          const data = await res.json();
          
          if (data.routes && data.routes.length > 0) {
            const coords = data.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]); // [lat, lng]
            setRouteCoords(coords);
            
            // Animation along the route
            let index = 0;
            const animate = () => {
              if (index < coords.length) {
                setUserPos(coords[index]);
                index++;
                setTimeout(() => requestAnimationFrame(animate), 100);
              } else {
                if (onArrival) onArrival();
              }
            };
            animate();
          }
        } catch (err) {
          console.error("Routing Error:", err);
        }
      };
      fetchRoute();
    } else {
      setRouteCoords([]);
    }
  }, [isNavigating, targetCharger, onArrival]);

  const findMe = useCallback(() => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCenterPos([latitude, longitude]);
      setUserPos([latitude, longitude]);
      generateFakeChargers(latitude, longitude, "Your location");
      setIsLocating(false);
    }, (error) => {
      console.error(error);
      generateFakeChargers(centerPos[0], centerPos[1], "Fallback area");
      setIsLocating(false);
    });
  }, [centerPos, generateFakeChargers]);

  useEffect(() => {
    findMe();
  }, []);

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
          setUserPos([lat, lon]);
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
          url={tileUrl}
        />
        <MapController center={centerPos} selectedId={isNavigating ? targetCharger?.id || null : selectedChargerId || null} markers={nearbyChargers} isNavigating={isNavigating} />
        
        {/* User / Car Marker */}
        <Marker position={userPos} icon={isNavigating ? CarIcon as any : UserIcon as any}>
          <Popup><div className="text-black font-bold text-xs">{isNavigating ? "En route to Node" : "Your Location"}</div></Popup>
        </Marker>

        {/* Real Road Polyline */}
        {routeCoords.length > 0 && (
          <Polyline 
            positions={routeCoords} 
            color="#00f2ff" 
            weight={6} 
            opacity={0.8} 
            lineCap="round"
            lineJoin="round"
            className="route-glow"
          />
        )}

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
                  <span className="px-2 py-0.5 bg-white/10 text-white text-[10px] font-bold rounded-full border border-white/20">⭐ {charger.rating}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="font-bold text-primary">₹{(charger.price * 80).toFixed(0)}/kWh</span>
                  <button 
                    onClick={() => onBookNow && onBookNow(charger)}
                    className="px-3 py-1.5 bg-primary text-black text-[10px] font-bold rounded-lg hover:bg-white transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {!isNavigating && (
        <button 
          onClick={findMe}
          disabled={isLocating}
          className="absolute bottom-6 right-6 z-[1000] w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_var(--primary-glow)] hover:scale-110 transition-transform cursor-pointer disabled:opacity-50"
        >
          <Navigation className={`text-black w-6 h-6 fill-current ${isLocating ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
}
