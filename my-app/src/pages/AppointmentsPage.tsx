import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  Stethoscope, 
  Smile, 
  Heart, 
  Brain, 
  Bone, 
  Baby, 
  Ear,
  Eye,
  Syringe,
  Activity,
  Pill,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import './AppointmentsPage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Doctor, BookingSlot, MOCK_DOCTORS, LOGO_URL } from '../data/mockData';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import ReachMyDoctorApi from '../services/reachMyDoctorApi';

interface Category {
  id: string;
  name: string;
  filterValue: string;
  icon: React.ReactNode;
}

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  // State for Search Params
  const [city] = useState("Bengaluru");
  const [area, setArea] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  // Data State for Areas
  const [availableAreas, setAvailableAreas] = useState<string[]>([]);

  // Booking State
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [bookingSlot, setBookingSlot] = useState<BookingSlot | null>(null);
  const [patientName, setPatientName] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [viewMapDoctor, setViewMapDoctor] = useState<Doctor | null>(null);
  // const [apiSlots, setApiSlots] = useState<any[]>([]);

  const location = useLocation();

  // -- Fetch Areas Logic --
  const fetchAreas = useCallback(async (query: string) => {
    if (!city) return;
    try {
        const localities = await ReachMyDoctorApi.getLocalities(city, query);
        setAvailableAreas(localities.map(l => l.locality));
    } catch (err) {
        console.error("Failed to fetch areas", err);
    }
  }, [city]);

  // Initial fetch of areas
  useEffect(() => {
    fetchAreas("");
  }, [fetchAreas]);

  // Handle Input Change for Area
  const handleAreaInputChange = (query: string) => {
    setArea(query);
    // Debounce fetch effectively managed by logic or simple call
    // Note: In FindDoctorsPage there's a debounce useEffect. Let's add it if we want live typing results.
    fetchAreas(query); 
  };


  const categories: Category[] = [
    { id: 'general', name: 'General Physician', filterValue: 'General Physician', icon: <Stethoscope size={32} /> },
    { id: 'skin', name: 'Skin & Hair', filterValue: 'Dermatologist', icon: <Smile size={32} /> },
    { id: 'women', name: "Women's Health", filterValue: 'Gynecologist/Obstetrician', icon: <Heart size={32} /> },
    { id: 'dental', name: 'Dental Care', filterValue: 'Dentist', icon: <Smile size={32} /> },
    { id: 'child', name: 'Child Specialist', filterValue: 'Pediatrician', icon: <Baby size={32} /> },
    { id: 'ent', name: 'Ear, Nose, Throat', filterValue: 'ENT', icon: <Ear size={32} /> },
    { id: 'mental', name: 'Mental Wellness', filterValue: 'Psychiatrist', icon: <Brain size={32} /> },
    { id: 'ortho', name: 'Bones & Joints', filterValue: 'Orthopedic', icon: <Bone size={32} /> },
    { id: 'eye', name: 'Eye Specialist', filterValue: 'Ophthalmologist', icon: <Eye size={32} /> },
    { id: 'gas', name: 'Gastroenterology', filterValue: 'Gastroenterologist', icon: <Activity size={32} /> },
    { id: 'surg', name: 'General Surgery', filterValue: 'General Surgeon', icon: <Syringe size={32} /> },
    { id: 'ure', name: 'Urology', filterValue: 'Urologist', icon: <Activity size={32} /> },
    { id: 'cardio', name: 'Heart', filterValue: 'Cardiologist', icon: <Heart size={32} /> },
    { id: 'med', name: 'Medicines', filterValue: 'Medicines', icon: <Pill size={32} /> },
  ];

  const handleCategoryClick = (filterValue: string) => {
    setSelectedSpecialty(filterValue);
    setSearchTerm(filterValue); 
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialty && !searchTerm && !area) return [];
    
    let docs = MOCK_DOCTORS;
    
    // Filter by Specialty
    if (selectedSpecialty) {
        docs = docs.filter(d => d.specialty === selectedSpecialty);
    } 
    
    // Filter by Area/SearchTerm
    const effectiveSearch = area || searchTerm;
    if (effectiveSearch) {
        const lowerSearch = effectiveSearch.toLowerCase();
        docs = docs.filter(d => 
            d.specialty.toLowerCase().includes(lowerSearch) || 
            d.name.toLowerCase().includes(lowerSearch) ||
            d.clinic.toLowerCase().includes(lowerSearch) ||
            d.location.toLowerCase().includes(lowerSearch) // Added location check
        );
    }
    return docs;
  }, [selectedSpecialty, searchTerm, area]);

  /* Booking Logic */
  
  // Handle incoming navigation from FindDoctorsPage
  useEffect(() => {
     if (location.state && location.state.doctorId) {
         const { doctorId, doctorName, preSelectedSlot } = location.state;
         
         // Create a temporary doctor object to open the modal
         setBookingDoctor({
             id: doctorId,
             name: doctorName || "Doctor",
             specialty: "Specialist", // Placeholder
             clinic: "Clinic", // Placeholder
             location: city,
             image: "https://reachmydoctor.in/pages/images/icons/stethoscope.png", // Default
             experience: "",
             fee: "",
             availability: "",
             slots: [] // Will be populated by API
         });

         // If a slot was already picked, set it
         if (preSelectedSlot) {
             setBookingSlot({
                 date: new Date().toLocaleDateString(),
                 time: preSelectedSlot
             });
         }
     }
  }, [location.state, city]);

  // Fetch Slots when booking doctor is set (and has an ID)
  useEffect(() => {
      const fetchSlots = async () => {
          if (bookingDoctor && bookingDoctor.id) {
             console.log("Fetching slots for doctor:", bookingDoctor.id);
             let slotsData: any[] = [];
             
             try {
                 const response = await ReachMyDoctorApi.getClinicSlots(String(bookingDoctor.id), new Date().toISOString().split('T')[0]);
                 console.log("Slots Response:", response);
                 
                 // Adapt API response to UI format
                 if (response && response.RESPONSE === "SUCCESS") {
                     slotsData = response.SLOTS || response.data || []; 
                 }
             } catch (err) {
                 console.error("Failed to fetch slots", err);
             }

             // Independent Fallback (Always runs if slotsData is empty)
             if (!slotsData || slotsData.length === 0) {
                 console.log("Using Mock Slots Fallback");
                 slotsData = ["10:00 am", "10:30 am", "11:00 am", "11:30 am", "04:00 pm", "04:30 pm", "05:00 pm"];
             }

             // setApiSlots(slotsData); // Store raw for reference if needed
             
             // If slotsData is a flat array of strings ["10:00", ...], map to today
             if (Array.isArray(slotsData) && typeof slotsData[0] === 'string') {
                 setBookingDoctor(prev => prev ? ({
                     ...prev,
                     slots: [{
                         date: new Date().toLocaleDateString(),
                         times: slotsData
                     }]
                 }) : null);
             } 
             // If it's already structured, use as is (with validation)
             else if (Array.isArray(slotsData)) {
                  // Assume it matches DaySlot or map it
                  setBookingDoctor(prev => prev ? ({
                      ...prev,
                      slots: slotsData
                  }) : null);
             }
          }
      };
      
      fetchSlots();
      // eslint-disable-next-line
  }, [bookingDoctor?.id]); 


  const handleBookClick = (doctor: Doctor) => {
    setBookingDoctor(doctor);
    setBookingSlot(null);
    setIsBooked(false);
  };

  const confirmBooking = () => {
    if (bookingDoctor && bookingSlot) {
        const newBooking = {
            id: Date.now(),
            doctor: bookingDoctor,
            slot: bookingSlot,
            patientName: patientName,
            bookedOn: new Date().toISOString()
        };

        const existingBookings = JSON.parse(localStorage.getItem('RMD_APPOINTMENTS') || '[]');
        localStorage.setItem('RMD_APPOINTMENTS', JSON.stringify([...existingBookings, newBooking]));
        
        setIsBooked(true);
    }
  };

  const resetBooking = () => {
    setBookingDoctor(null);
    setBookingSlot(null);
    setPatientName("");
    setIsBooked(false);
  };

  return (
    <div className="appointments-page">
      {/* Mock Data Frozen/Hidden by default unless specific search/action */}
      {false && !selectedSpecialty && filteredDoctors.length === 0 ? (
        <>
          <div className="appointments-header">
            <h1>Book an Appointment</h1>
            <p>Find the best doctors and specialists near you</p>
          </div>

          <div className="appointments-search-wrapper" style={{maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 100}}>
             <AdvancedSearchBar 
                locations={["Bengaluru", "Mysore", "Mumbai", "Delhi"]} 
                areas={availableAreas} 
                onAreaInputChange={handleAreaInputChange}
                onSearch={(filters) => {
                    // Update Page State when Search Bar triggers search
                    if (filters.specialty && filters.specialty !== "Search by Specialty") {
                         setSelectedSpecialty(filters.specialty);
                    } else {
                         setSelectedSpecialty(null);
                    }
                    
                    if (filters.area && filters.area !== 'All Areas') {
                        setArea(filters.area);
                        setSearchTerm(filters.area);
                    } else {
                        setArea("");
                        if (!filters.specialty || filters.specialty === "Search by Specialty") {
                            setSearchTerm("");
                        }
                    }
                }}
             />
          </div>

          <div className="categories-section">
            <h2>Consult with Top Specialists</h2>
            <div className="categories-grid">
              {filteredCategories.map((category) => (
                <div 
                  key={category.id} 
                  className="category-card"
                  onClick={() => handleCategoryClick(category.filterValue)}
                >
                  <div className="category-icon-wrapper">
                    {category.icon}
                  </div>
                  <h3>{category.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Doctor Listing View */
        <div style={{padding: '20px', maxWidth: '1200px', margin: '0 auto'}}>
            <button 
                onClick={() => {setSelectedSpecialty(null); setSearchTerm(''); setArea('');}}
                style={{display:'flex', alignItems:'center', gap:'8px', border:'none', background:'transparent', color:'#3b82f6', fontSize:'16px', fontWeight:600, marginBottom:'20px', cursor:'pointer'}}
            >
                <ArrowLeft size={20} /> Back to Categories
            </button>

            <h2>
                {selectedSpecialty 
                    ? `${selectedSpecialty}s` 
                    : `Doctors${area ? ` in ${area}` : ''}${searchTerm && searchTerm !== area ? ` matching "${searchTerm}"` : ''}`}
            </h2>
            <p className="rmd-section-sub">{filteredDoctors.length} matches found</p>
            
            <div className="doctor-list" style={{marginTop:'20px'}}>
                {filteredDoctors.map(doctor => (
                    <div key={doctor.id} className="doctor-card" style={{display:'flex', justifyContent:'space-between', padding:'20px', background:'white', borderRadius:'12px', border:'1px solid #e2e8f0', marginBottom:'16px', alignItems:'flex-start'}}>
                        <div className="doctor-info" style={{display:'flex', gap:'20px'}}>
                            <div className="doctor-img-wrapper" style={{width:'100px', height:'100px', borderRadius:'50%', overflow:'hidden', flexShrink:0}}>
                                <img src={doctor.image} alt={doctor.name} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                            </div>
                            <div className="doctor-details">
                                <h3 style={{fontSize:'18px', color:'#1e293b', marginBottom:'4px'}}>{doctor.name}</h3>
                                <p className="doc-specialty" style={{color:'#0ea5e9', fontWeight:600, fontSize:'14px', marginBottom:'4px'}}>{doctor.specialty}</p>
                                <p className="doc-exp" style={{fontSize:'13px', color:'#64748b', marginBottom:'8px'}}>{doctor.experience}</p>
                                <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'14px', color:'#334155', marginBottom:'8px'}}>
                                    <MapPin size={16} className="text-gray-400" />
                                    <span><strong>{doctor.clinic}</strong> • {doctor.location}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px'}}>
                                    <span 
                                        className="doc-map-link" 
                                        style={{color: '#3b82f6', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                        onClick={() => setViewMapDoctor(doctor)}
                                    >
                                        📍 View on Map
                                    </span>
                                </div>
                                <p className="doc-fee" style={{fontWeight:600, color:'#1e293b', marginTop:'8px'}}>{doctor.fee} Consultation fee</p>
                                <div style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'13px', color:'#16a34a', marginTop:'4px', background:'#dcfce7', width:'fit-content', padding:'2px 8px', borderRadius:'4px'}}>
                                    <Clock size={14} />
                                    <span>{doctor.availability}</span>
                                </div>
                            </div>
                        </div>
                        <div className="doctor-actions" style={{display:'flex', flexDirection:'column', justifyContent:'center', height:'100%'}}>
                            <button 
                                className="btn-primary" 
                                onClick={() => handleBookClick(doctor)}
                                style={{whiteSpace:'nowrap'}}
                            >
                                Book Appointment
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

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

      {/* Booking Modal */}
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

<button className="btn-primary" style={{width:'100%', marginBottom: '10px'}} onClick={() => navigate('/my-appointments')}>Go to My Appointments</button>
                        <button className="btn-secondary" style={{width:'100%', background: '#f1f5f9', color: '#475569', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600}} onClick={resetBooking}>Close</button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
