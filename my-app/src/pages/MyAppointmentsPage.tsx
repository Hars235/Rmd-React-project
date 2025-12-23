import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, CheckCircle } from 'lucide-react';
import './MyAppointmentsPage.css';

type Appointment = {
    id: number;
    doctorName: string;
    specialty: string;
    clinic: string;
    location: string;
    date: string;
    time: string;
    patientName: string;
    status: 'Attending' | 'Attended' | 'Attend Later' | 'Missed';
};

const MyAppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('appointments');
        if (stored) {
            try {
                // Reverse to show newest booking first
                setAppointments(JSON.parse(stored).reverse());
            } catch (e) {
                console.error("Failed to parse appointments", e);
            }
        }
    }, []);

    const updateStatus = (id: number, newStatus: Appointment['status']) => {
        const updated = appointments.map(app => 
            app.id === id ? { ...app, status: newStatus } : app
        );
        setAppointments(updated);
        // Save back reversed (or handle the order correctly)
        // Since we read reversed, we should probably un-reverse before saving if we care about append order? 
        // Or just save this list. Saving this list means next load will reverse again.
        // Better: Find the item in the original storage? 
        // Simplest: Just save the current list.
        localStorage.setItem('appointments', JSON.stringify(updated.slice().reverse())); 
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Attending': return 'status-attending';
            case 'Attended': return 'status-attended';
            case 'Attend Later': return 'status-later';
            case 'Missed': return 'status-missed';
            default: return '';
        }
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <h1>Appointment Booked History</h1>
                <p>Manage your booked appointments and track their status.</p>
            </header>

            <div className="history-content">
                <div className="status-summary">
                    <div className="summary-card">
                        <h3>Total Booked</h3>
                        <div className="count">{appointments.length}</div>
                    </div>
                </div>

                <div className="appointments-list">
                    {appointments.length === 0 ? (
                        <div className="no-history">
                            <Calendar size={48} color="#cbd5e1" />
                            <p>No appointments found.</p>
                        </div>
                    ) : (
                        appointments.map(app => (
                            <div key={app.id} className="history-card">
                                <div className="card-header">
                                    <div>
                                        <h2>{app.doctorName}</h2>
                                        <div className="specialty">{app.specialty}</div>
                                    </div>
                                    <div className="status-control">
                                        <select 
                                            value={app.status || 'Attending'} 
                                            onChange={(e) => updateStatus(app.id, e.target.value as any)}
                                            className={`status-select ${getStatusColor(app.status || 'Attending')}`}
                                        >
                                            <option value="Attending">Attending</option>
                                            <option value="Attended">Attended</option>
                                            <option value="Attend Later">Attend Later</option>
                                            <option value="Missed">Missed</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <div className="info-row">
                                        <div className="info-item">
                                            <CheckCircle size={16} className="icon" />
                                            <span>{app.clinic}</span>
                                        </div>
                                        <div className="info-item">
                                            <MapPin size={16} className="icon" />
                                            <span>{app.location}</span>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <div className="info-item">
                                            <Calendar size={16} className="icon" />
                                            <span>{app.date}</span>
                                        </div>
                                        <div className="info-item">
                                            <Clock size={16} className="icon" />
                                            <span>{app.time}</span>
                                        </div>
                                    </div>
                                    <div className="patient-info">
                                        <User size={16} className="icon" />
                                        <span>Patient: {app.patientName}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyAppointmentsPage;
