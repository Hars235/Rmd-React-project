import React, { useState, useMemo } from 'react';

import '../App.css';
import AdvancedSearchBar from '../components/AdvancedSearchBar';

// Types
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

// Logo URL for the map marker
const LOGO_URL = "/images/consult/logo.png";

const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Anjali Desai",
    specialty: "Dentist",
    experience: "12 years experience",
    location: "Jubilee Hills, Hyderabad",
    clinic: "Apollo Dental, Road No 92",
    fee: "₹500",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png", 
    slots: [
      { date: "Today", times: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
      { date: "Tomorrow", times: ["09:00 AM", "11:00 AM", "3:00 PM"] }
    ]
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "15 years experience",
    location: "Kondapur, Hyderabad",
    clinic: "Kims Hospital, Kondapur Main Road",
    fee: "₹600",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["05:00 PM", "06:30 PM", "08:00 PM"] },
      { date: "Tomorrow", times: ["10:30 AM", "12:30 PM", "05:30 PM"] }
    ]
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist/Obstetrician",
    experience: "9 years experience",
    location: "Banjara Hills, Hyderabad",
    clinic: "Rainbow Children's Hospital, Road No 2",
    fee: "₹700",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
       { date: "Tomorrow", times: ["11:00 AM", "01:00 PM", "04:00 PM"] }
    ]
  },
  {
    id: 4,
    name: "Dr. Vikram Singh",
    specialty: "Dermatologist",
    experience: "8 years experience",
    location: "Madhapur, Hyderabad",
    clinic: "Skin & Hair Clinic, Hitech City Rd",
    fee: "₹800",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
     slots: [
      { date: "Today", times: ["02:00 PM", "03:30 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "04:30 PM"] }
    ]
  },
  {
    id: 5,
    name: "Dr. Siddalinga Swamy",
    specialty: "Urologist",
    experience: "10 years experience",
    location: "Ramachandrapuram, Hyderabad",
    clinic: "Shree Veda Multispeciality Hospital, NH 65, Ashok Nagar",
    fee: "₹800",
    availability: "Available Today",
    image: "/images/dr_siddalinga_swamy.png",
    slots: [
      { date: "Today", times: ["10:00 AM", "01:00 PM", "06:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "02:00 PM", "05:00 PM"] }
    ]
  },

  // Bangalore Doctors
  {
    id: 6,
    name: "Dr. Rajesh Kumar",
    specialty: "Dentist",
    experience: "8 years experience",
    location: "Indiranagar, Bangalore",
    clinic: "Apollo Dental, 100 Feet Road",
    fee: "₹600",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["10:00 AM", "05:00 PM"] }
    ]
  },
  {
    id: 7,
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    experience: "12 years experience",
    location: "Koramangala, Bangalore",
    clinic: "Skin Care Clinic, 80 Feet Road",
    fee: "₹900",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["11:00 AM", "03:00 PM"] }
    ]
  },
  // Chennai Doctors
  {
    id: 8,
    name: "Dr. Suresh Reddy",
    specialty: "General Physician",
    experience: "15 years experience",
    location: "Adyar, Chennai",
    clinic: "Apollo Hospital, Greams Road",
    fee: "₹700",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
        { date: "Today", times: ["09:00 AM", "01:00 PM"] }
    ]
  },
  // Mumbai Doctors
  {
    id: 9,
    name: "Dr. Anita Desai",
    specialty: "Gynecologist/Obstetrician",
    experience: "9 years experience",
    location: "Bandra West, Mumbai",
    clinic: "Lilavati Hospital, Bandra Reclamation",
    fee: "₹1200",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
        { date: "Tomorrow", times: ["10:00 AM", "02:00 PM"] }
    ]
  },
  // New Bangalore Doctors
  {
    id: 10,
    name: "Dr. Suresh Gupta",
    specialty: "Cardiologist",
    experience: "18 years experience",
    location: "Whitefield, Bangalore",
    clinic: "Manipal Hospital, Whitefield Main Rd",
    fee: "₹900",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["09:00 AM", "11:00 AM"] },
      { date: "Tomorrow", times: ["10:00 AM", "01:00 PM"] }
    ]
  },
  {
    id: 11,
    name: "Dr. Meena Iyer",
    specialty: "Gynecologist/Obstetrician",
    experience: "14 years experience",
    location: "Jayanagar, Bangalore",
    clinic: "Cloudnine Hospital, 3rd Block",
    fee: "₹750",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["02:00 PM", "04:30 PM", "06:00 PM"] }
    ]
  },
  {
    id: 12,
    name: "Dr. Amit Patil",
    specialty: "Orthopedic",
    experience: "10 years experience",
    location: "HSR Layout, Bangalore",
    clinic: "Narayana Hrudayalaya Clinic, Sector 2",
    fee: "₹650",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["05:00 PM", "07:30 PM"] }
    ]
  },
  {
    id: 13,
    name: "Dr. Sneha Reddy",
    specialty: "Pediatrician",
    experience: "7 years experience",
    location: "Malleshwaram, Bangalore",
    clinic: "Columbia Asia Referral Hospital, Gateway",
    fee: "₹600",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["10:00 AM", "01:00 PM"] },
      { date: "Tomorrow", times: ["09:30 AM", "12:00 PM"] }
    ]
  },
  // New Hyderabad Doctors
  {
    id: 14,
    name: "Dr. Ravi Varma",
    specialty: "Cardiologist",
    experience: "20 years experience",
    location: "Gachibowli, Hyderabad",
    clinic: "Continental Hospitals, Financial District",
    fee: "₹1000",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["11:00 AM", "02:00 PM"] }
    ]
  },
  {
    id: 15,
    name: "Dr. Latika Rao",
    specialty: "Dermatologist",
    experience: "6 years experience",
    location: "Kukatpally, Hyderabad",
    clinic: "Oliva Skin & Hair Clinic, KPHB Colony",
    fee: "₹550",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["03:00 PM", "05:00 PM", "07:00 PM"] }
    ]
  }
];

const FindDoctorsPage: React.FC = () => {

    const [city, setCity] = useState("Hyderabad");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [area, setArea] = useState("");
    const [type, setType] = useState("");
    
    // Booking State
    const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
    const [bookingSlot, setBookingSlot] = useState<BookingSlot | null>(null);
    const [patientName, setPatientName] = useState("");
    const [isBooked, setIsBooked] = useState(false);

    // Map State
    const [viewMapDoctor, setViewMapDoctor] = useState<Doctor | null>(null);

    // Derived State
    const filteredDoctors = useMemo(() => {
        let docs = MOCK_DOCTORS;
        
        // Filter by City
        if (city) {
            docs = docs.filter(d => d.location.toLowerCase().includes(city.toLowerCase()));
        }

        if (selectedSpecialty) {
            docs = docs.filter(d => d.specialty === selectedSpecialty);
        }
        
        if (area) {
            docs = docs.filter(d => d.location.toLowerCase().includes(area.toLowerCase()));
        }

        if (type) {
            // Check if the selected type matches a specialty (e.g. from the dropdown)
            // Doctors have strict specialty names like "Dentist", "Urologist", "Gynecologist/Obstetrician"
            const isSpecialty = docs.some(d => d.specialty === type);
            if (isSpecialty) {
                 docs = docs.filter(d => d.specialty === type);
            } else {
                 // Otherwise treat it as a clinic name filter (e.g. "Hospital", "Clinic")
                 docs = docs.filter(d => d.clinic.toLowerCase().includes(type.toLowerCase()));
            }
        }

        return docs;
    }, [selectedSpecialty, area, type, city]);

    const handleBookClick = (doctor: Doctor) => {
        setBookingDoctor(doctor);
        setBookingSlot(null);
        setIsBooked(false);
    };

    const confirmBooking = () => {
        if (bookingDoctor && bookingSlot) {
            setIsBooked(true);
        }
    };

    const resetBooking = () => {
        setBookingDoctor(null);
        setBookingSlot(null);
        setPatientName("");
        setIsBooked(false);
    };

    // Callback for search to avoid infinite loops
    const handleSearch = React.useCallback((filters: { specialty: string; city: string; area: string; type: string }) => {
        setCity(filters.city);
        if (filters.specialty && filters.specialty !== "Search by Speciality") {
            setSelectedSpecialty(filters.specialty);
        }
        setArea(filters.area);
        setType(filters.type);
    }, []);

    return (
        <div className="rmd-page">
            <main className="rmd-main" style={{paddingTop: '20px'}}>
                {/* Search Section */}
                <section className="rmd-section">
                    <AdvancedSearchBar 
                        locations={["Hyderabad", "Bangalore", "Chennai", "Mumbai"]}
                        areas={["Uttarahalli", "Jayanagar", "Indiranagar", "Koramangala", "Whitefield", "Banjara Hills", "Jubilee Hills", "Madhapur", "Kondapur"]}
                        onSearch={handleSearch}
                        initialFilters={{
                            city: city, 
                            specialty: selectedSpecialty || '',
                            area: area,
                            type: type
                        }}
                    />
                </section>



                {/* Listing Section */}
                <section className="rmd-section">
                    <h2>{selectedSpecialty ? `${selectedSpecialty}s in ${city}` : `Doctors in ${city}`}</h2>
                    <p className="rmd-section-sub">{filteredDoctors.length} matches found</p>
                    
                    <div className="doctor-list">
                        {filteredDoctors.map(doctor => (
                            <div key={doctor.id} className="doctor-card">
                                <div className="doctor-info">
                                    <div className="doctor-img-wrapper">
                                        <img src={doctor.image} alt={doctor.name} />
                                    </div>
                                    <div className="doctor-details">
                                        <h3>{doctor.name}</h3>
                                        <p className="doc-specialty">{doctor.specialty}</p>
                                        <p className="doc-exp">{doctor.experience}</p>
                                        <p className="doc-loc"><strong>{doctor.location}</strong> • {doctor.clinic}</p>
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px'}}>
                                            <span 
                                                className="doc-map-link" 
                                                style={{color: '#3b82f6', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                                onClick={() => setViewMapDoctor(doctor)}
                                            >
                                               📍 View on Map
                                            </span>
                                        </div>
                                        <p className="doc-fee">{doctor.fee} Consultation fee</p>
                                        <span className="doc-avail">{doctor.availability}</span>
                                    </div>
                                </div>
                                <div className="doctor-actions">
                                    <button 
                                        className="btn-primary" 
                                        onClick={() => handleBookClick(doctor)}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Map Modal */}
            {viewMapDoctor && (
                <div className="booking-modal-backdrop" onClick={() => setViewMapDoctor(null)}>
                    <div className="booking-modal" style={{maxWidth: '800px', width: '95%', height: '80vh', display: 'flex', flexDirection: 'column'}} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Location: {viewMapDoctor.name}</h3>
                            <button className="close-btn" onClick={() => setViewMapDoctor(null)}>&times;</button>
                        </div>
                        <div style={{flex: 1, position: 'relative', width: '100%', background: '#f0f0f0'}}>
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{border: 0}}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(viewMapDoctor.clinic + ", " + viewMapDoctor.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                            {/* Logo Overlay Point */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -100%)', // Center and place tip at center
                                pointerEvents: 'none',
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <img 
                                    src={LOGO_URL} 
                                    alt="Point" 
                                    style={{
                                        width: '80px', 
                                        height: 'auto',
                                        filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.3))',
                                        background: 'white',
                                        padding: '4px',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <div style={{
                                    width: 0, 
                                    height: 0, 
                                    borderLeft: '10px solid transparent',
                                    borderRight: '10px solid transparent',
                                    borderTop: '10px solid white',
                                    filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal (Simplified) */}
            {bookingDoctor && !viewMapDoctor && (
                <div className="booking-modal-backdrop" onClick={resetBooking}>
                    <div className="booking-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Book Appointment</h3>
                            <button className="close-btn" onClick={resetBooking}>&times;</button>
                        </div>
                        
                        {!isBooked ? (
                            <>
                                <div className="doctor-summary">
                                    <img src={bookingDoctor.image} alt={bookingDoctor.name} />
                                    <div>
                                        <h4>{bookingDoctor.name}</h4>
                                        <p>{bookingDoctor.specialty}</p>
                                        <p>{bookingDoctor.clinic}</p>
                                    </div>
                                </div>
                                
                                <div className="booking-field" style={{marginBottom: '20px'}}>
                                    <label style={{display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:500, color:'#475569'}}>Patient Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter patient name"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', fontSize:'14px'}}
                                    />
                                </div>

                                <div className="slots-section">
                                    {bookingDoctor.slots.map((daySlot, index) => (
                                        <div key={index} className="day-slots">
                                            <h5>{daySlot.date}</h5>
                                            <div className="time-slots">
                                                {daySlot.times.map(time => (
                                                    <button 
                                                        key={time} 
                                                        className={`slot-btn ${bookingSlot?.date === daySlot.date && bookingSlot?.time === time ? 'selected' : ''}`}
                                                        onClick={() => setBookingSlot({ date: daySlot.date, time })}
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="modal-footer">
                                    <button 
                                        className="btn-primary" 
                                        disabled={!bookingSlot || !patientName}
                                        onClick={confirmBooking}
                                        style={{width: '100%'}}
                                    >
                                        Confirm Booking
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="booking-success">
                                <div className="success-icon">
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" stroke="#16a34a" fill="#16a34a" fillOpacity="0.1"/>
                                        <path d="M8 12L11 15L16 9" stroke="#16a34a" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                                <h3>Appointment Confirmed!</h3>
                                <p>Your appointment has been successfully scheduled.</p>
                                
                                <div className="confirmation-details">
                                    <div className="detail-row">
                                        <span>Doctor</span>
                                        <strong>{bookingDoctor.name}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Specialty</span>
                                        <strong>{bookingDoctor.specialty}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Patient</span>
                                        <strong>{patientName}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Date & Time</span>
                                        <strong>{bookingSlot?.date} at {bookingSlot?.time}</strong>
                                    </div>
                                </div>

                                <button className="btn-primary" style={{width:'100%'}} onClick={resetBooking}>Done</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindDoctorsPage;
