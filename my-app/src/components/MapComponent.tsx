import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
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
  onBoundsChange?: (bounds: { south: number; west: number; north: number; east: number }) => void;
}

const RecenterOne = ({ center, zoom }: { center: { lat: number; lng: number }, zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([center.lat, center.lng], zoom);
    }, [center, zoom, map]);
    return null;
};

/* Icons */
const doctorIcon = new L.Icon({
    iconUrl: '/images/map-icons/doctor-green-pin.png',
    iconSize: [40, 56],
    iconAnchor: [20, 56], 
    popupAnchor: [0, -56],
});

const hospitalIcon = new L.Icon({
    iconUrl: '/images/map-icons/hospital-red-pin.png',
    iconSize: [40, 56],
    iconAnchor: [20, 56], 
    popupAnchor: [0, -56],
});

const pharmacyIcon = new L.Icon({
    iconUrl: '/images/map-icons/pharmacy-pin.png',
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
});

const labIcon = new L.Icon({
    iconUrl: '/images/map-icons/lab-pin.png',
    iconSize: [40, 56],
    iconAnchor: [20, 56],
    popupAnchor: [0, -56],
});

const getIconForType = (type?: string) => {
    if (!type) return doctorIcon;
    const t = type.toLowerCase();
    
    if (t.includes('pharmacy') || t.includes('chemist') || t.includes('medicine')) return pharmacyIcon;
    if (t.includes('lab') || t.includes('diagnostic') || t.includes('scan') || t.includes('mri') || t.includes('x-ray')) return labIcon;
    if (t.includes('hospital') || t.includes('institute') || t.includes('center') || t.includes('nursing')) return hospitalIcon;
    
    return doctorIcon; // Default
};

const MapEvents = ({ onBoundsChange }: { onBoundsChange?: MapProps['onBoundsChange'] }) => {
    const map = useMap();
    
    useMapEvents({
        moveend: () => {
            if (onBoundsChange) {
                const bounds = map.getBounds();
                onBoundsChange({
                    south: bounds.getSouth(),
                    west: bounds.getWest(),
                    north: bounds.getNorth(),
                    east: bounds.getEast(),
                });
            }
        },
    });
    return null;
};

const MapComponent: React.FC<MapProps> = ({ center, zoom = 13, activeLocation, locations = [], onMarkerClick, onBoundsChange }) => {
  const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bengaluru Default

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
      <MapContainer 
        center={[center.lat || defaultCenter.lat, center.lng || defaultCenter.lng]} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
            attribution='&copy; <a href="https://www.google.com/intl/en-US_US/help/terms_maps.html">Google Maps</a>'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
        />
        
        <RecenterOne center={center} zoom={zoom} />
        <MapEvents onBoundsChange={onBoundsChange} />

        {locations.map(loc => (
            <Marker 
                key={loc.id} 
                position={[loc.lat, loc.lng]}
                icon={getIconForType(loc.type)}
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
            <Marker position={[activeLocation.lat, activeLocation.lng]} icon={doctorIcon}>
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
