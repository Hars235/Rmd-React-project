import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  activeLocation?: { lat: number; lng: number; name: string } | null;
  locations?: Array<{
      id: string;
      lat: number;
      lng: number;
      name: string;
      type?: string;
  }>;
  onMarkerClick?: (id: string) => void;
}

const RecenterOne = ({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);
    return null;
};

const MapComponent: React.FC<MapProps> = ({ center, zoom = 13, activeLocation, locations = [], onMarkerClick }) => {
  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bengaluru Default

  // RMD Logo Marker Icon
  // RMD Logo Marker Icon
  // RMD Logo Marker Icon
  const customIcon = new L.Icon({
      iconUrl: '/images/rmd-pin.png', // New vertical pin image
      iconSize: [50, 70], // Vertical pin dimensions (adjust based on actual ratio, 5:7 approx)
      iconAnchor: [25, 70], // Bottom center tip
      popupAnchor: [0, -70], // Popup above the pin
      properties: {
        className: 'rmd-custom-marker'
      }
  });

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={[center.lat || defaultCenter.lat, center.lng || defaultCenter.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <RecenterOne center={center} zoom={zoom} />

        {locations.map(loc => (
            <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]}
                icon={customIcon}
                eventHandlers={{
                    click: () => {
                        if (onMarkerClick) onMarkerClick(loc.id);
                    }
                }}
            >
                <Popup>
                    <strong>{loc.name}</strong><br />
                    {loc.type}
                </Popup>
            </Marker>
        ))}

        {/* Fallback or specific active marker if not in list */}
        {activeLocation && !locations.find(l => l.lat === activeLocation.lat && l.lng === activeLocation.lng) && (
            <Marker position={[activeLocation.lat, activeLocation.lng]} icon={customIcon}>
                <Popup>
                    <strong>{activeLocation.name}</strong>
                </Popup>
            </Marker>
        )}

      </MapContainer>
    </div>
  );
};

export default MapComponent;
