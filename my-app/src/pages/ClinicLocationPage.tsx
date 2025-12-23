import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Navigation } from 'lucide-react';
import MapComponent from '../components/MapComponent';

const ClinicLocationPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { doctor, eta, distance } = location.state || {}; // Expecting doctor object and calculated distance/eta
    
    // Debug logging
    console.log("ClinicLocationPage details:", { doctor, eta, distance });

    // Fallback data for testing if navigated directly or data missing
    const fallbackDoctor = {
        name: "Sankalpa Clinic", 
        locality: "Chamarajapete", 
        city: "Bengaluru", 
        lat: 12.9601, 
        lng: 77.5621,
        timings: "Mon - Sat: 10:00 AM - 08:30 PM"
    };

    const effectiveDoctor = doctor || fallbackDoctor;
    const effectiveDistance = distance || "26.7 km";
    const effectiveEta = eta || "45 mins";

    // Coordinates
    const center = { 
        lat: parseFloat(effectiveDoctor.lat || "12.9716"), 
        lng: parseFloat(effectiveDoctor.lng || "77.5946") 
    };

    const handleGetDirections = () => {
        // Open Google Maps Directions
        const url = `https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`;
        window.open(url, '_blank');
    };

    return (
        <div className="clinic-location-page" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh', background: '#f8fafc' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
                    <ArrowLeft size={24} color="#334155" />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Route & Location</h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Info Card */}
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '22px', color: '#f97316', margin: '0 0 8px 0' }}>{effectiveDoctor.name}</h2>
                    <p style={{ color: '#64748b', margin: '0 0 16px 0' }}>{effectiveDoctor.locality}, {effectiveDoctor.city}</p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px', marginBottom: '6px' }}>
                                <Clock size={16} />
                                <span style={{ fontWeight: 600 }}>Timings</span>
                            </div>
                            <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500 }}>{effectiveDoctor.timings || "Mon - Sat: 10:00 AM - 08:30 PM"}</div>
                        </div>

                        <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '14px', marginBottom: '6px' }}>
                                <MapPin size={16} />
                                <span style={{ fontWeight: 600 }}>Distance & ETA</span>
                            </div>
                            <div style={{ fontSize: '18px', color: '#1e40af', fontWeight: 700 }}>
                                {effectiveDistance} <span style={{ fontSize: '14px', fontWeight: 400, color: '#64748b' }}>(~{effectiveEta})</span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleGetDirections}
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '24px', padding: '14px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#16a34a', color: 'white', border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
                    >
                        <Navigation size={18} />
                        Get Directions (Google Maps)
                    </button>
                </div>

                {/* Map Section */}
                <div style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', position: 'relative' }}>
                    <MapComponent 
                        center={center} 
                        zoom={15} 
                        activeLocation={{ lat: center.lat, lng: center.lng, name: effectiveDoctor.name }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ClinicLocationPage;
