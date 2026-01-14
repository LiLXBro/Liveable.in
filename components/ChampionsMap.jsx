'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import L from 'leaflet';

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// India Center
const POSITION = [20.5937, 78.9629];

export default function ChampionsMap({ champions }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="h-[500px] w-full bg-slate-100 animate-pulse rounded-xl"></div>;

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 z-0">
            <MapContainer center={POSITION} zoom={4} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* 
               In a real scenario, we map champions to coords. 
               Here we randomly jitter them around India center if coords unavailable, 
               or use a mapped coordinate lookup for the city. 
               For Demo: We will show a marker for the "New Delhi" default or similar.
            */}
                {champions && champions.map((champ, idx) => (
                    // Since we don't have Geocoding API, we'll just not render markers that don't have coords.
                    // Or we could mock. For now, let's place a sample marker.
                    <Marker key={idx} position={POSITION} icon={icon}>
                        <Popup>
                            ClIC HQ <br /> {champ.city}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
