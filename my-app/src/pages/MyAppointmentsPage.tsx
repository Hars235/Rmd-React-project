import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

// Reuse types (should ideally be shared)
type Doctor = {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  clinic: string;
  fee: string;
  availability: string;
  image: string;
  slots: { date: string; times: string[] }[];
};

type BookingSlot = {
  date: string;
  time: string;
};

type Booking = {
  id: number;
  doctor: Doctor;
  slot: BookingSlot;
  patientName: string;
  bookedOn: string;
};

const MyAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('RMD_APPOINTMENTS');
    if (saved) {
      setBookings(JSON.parse(saved).reverse()); // Newest first
    }
  }, []);

  return (
    <div className="rmd-page">
      <main className="rmd-main" style={{paddingTop: '20px'}}>
        <section className="rmd-section">
          <h2>My Appointments</h2>
          <p className="rmd-section-sub">Your scheduled consultations</p>

          {bookings.length === 0 ? (
            <div style={{
              textAlign: 'center', 
              padding: '60px', 
              background: 'white', 
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
              <h3 style={{color: '#334155', marginBottom: '8px'}}>No Appointments Yet</h3>
              <p style={{color: '#64748b', marginBottom: '24px'}}>Find a doctor and book your first consultation.</p>
              <button className="btn-primary" onClick={() => navigate('/appointments')}>Book an Appointment</button>
            </div>
          ) : (
            <div className="doctor-list">
              {bookings.map(booking => (
                <div key={booking.id} className="doctor-card" style={{borderLeft: '4px solid #10b981'}}>
                  <div className="doctor-info">
                    <div className="doctor-img-wrapper">
                      <img src={booking.doctor.image} alt={booking.doctor.name} />
                    </div>
                    <div className="doctor-details">
                      <h3>{booking.doctor.name}</h3>
                      <p className="doc-specialty">{booking.doctor.specialty}</p>
                      <p className="doc-loc"><strong>{booking.doctor.clinic}</strong> • {booking.doctor.location}</p>
                      
                      <div style={{marginTop: '12px', padding: '12px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0'}}>
                        <div style={{display: 'flex', gap: '20px', marginBottom: '4px'}}>
                            <div>
                                <span style={{fontSize: '12px', color: '#166534', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Date & Time</span>
                                <span style={{color: '#15803d', fontWeight: 500}}>{booking.slot.date} at {booking.slot.time}</span>
                            </div>
                            <div>
                                <span style={{fontSize: '12px', color: '#166534', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px'}}>Patient</span>
                                <span style={{color: '#15803d', fontWeight: 500}}>{booking.patientName}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="doctor-actions" style={{justifyContent: 'flex-start'}}>
                    <button className="btn-secondary" style={{
                      background: '#dcfce7', 
                      color: '#15803d', 
                      border: 'none',
                      cursor: 'default',
                      fontWeight: 600
                    }}>
                      ✓ Confirmed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MyAppointmentsPage;
