import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, User, CheckCircle, Trash2, Undo } from 'lucide-react';
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
    bookingDate?: string;
};

const MyAppointmentsPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    
    // -- Deletion State --
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [deletedItems, setDeletedItems] = useState<Appointment[]>([]);
    const [showToast, setShowToast] = useState(false);

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
        saveToLocalStorage(updated);
    };

    const saveToLocalStorage = (apps: Appointment[]) => {
        // Since we read reversed, we should probably un-reverse before saving if we care about append order.
        // Or just save the current list as is. Let's save the current display order to avoid confusion.
        // Actually, let's just save the array as is.
        localStorage.setItem('appointments', JSON.stringify(apps.slice().reverse())); 
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

    // -- Delete Logic --
    const toggleSelection = (id: number) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
        );
    };

    const deleteSelected = () => {
        if (selectedIds.length === 0) return;

        // Separate kept and deleted
        const kept = appointments.filter(app => !selectedIds.includes(app.id));
        const removed = appointments.filter(app => selectedIds.includes(app.id));

        setAppointments(kept);
        setDeletedItems(removed);
        saveToLocalStorage(kept); 
        
        setShowToast(true);
        setSelectedIds([]);

        // Hide toast after 5s
        setTimeout(() => setShowToast(false), 5000);
    };

    const undoDelete = () => {
        if (deletedItems.length === 0) return;

        // Restore items (and maybe sort them back by ID or date if needed? For now just append/prepend)
        // Since id is timestamp, sorting by id desc puts them back in correct chronological order (newest first)
        const restored = [...appointments, ...deletedItems].sort((a, b) => b.id - a.id);
        
        setAppointments(restored);
        saveToLocalStorage(restored);
        
        setDeletedItems([]);
        setShowToast(false);
    };

    return (
        <div className="history-container">
            <header className="history-header">
                <div className="history-header-content">
                    <h1>Appointment Booked History</h1>
                    <p>Manage your booked appointments and track their status.</p>
                </div>
                
                {selectedIds.length > 0 && (
                    <button className="delete-btn" onClick={deleteSelected}>
                        <Trash2 size={18} />
                        Delete ({selectedIds.length})
                    </button>
                )}
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
                                <div className="card-select-container">
                                    <input 
                                        type="checkbox" 
                                        className="card-checkbox"
                                        checked={selectedIds.includes(app.id)}
                                        onChange={() => toggleSelection(app.id)}
                                    />
                                </div>

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

            {/* Undo Toast */}
            {showToast && (
                <div className="undo-toast">
                    <span>{deletedItems.length} appointment(s) deleted</span>
                    <button className="undo-btn" onClick={undoDelete}>
                        <Undo size={14} />
                        Undo
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyAppointmentsPage;
