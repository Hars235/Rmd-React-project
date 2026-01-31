import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Calendar, Phone, Mail, Globe, Share2, Clock, X } from 'lucide-react';
import '../App.css';
import './FindDoctorsPage.css';
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import MapComponent from '../components/MapComponent';
import ReachMyDoctorApi, { ClinicListResponse } from '../services/reachMyDoctorApi';

/* ================= TYPES ================= */

type BookingSlot = {
  date: string;
  time: string;
};

type AppointmentStatus =
  | 'Attending'
  | 'Attended'
  | 'Attend Later'
  | 'Missed'
  | 'Later attending';

type Appointment = {
  id: number;
  doctorName: string;
  specialty: string;
  clinic: string;
  location: string;
  date: string;
  time: string;
  patientName: string;
  status: AppointmentStatus;
  bookingDate?: string; // Date when the booking was made
};

type MockDoctor = {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  location: string;
  clinic: string;
  clinicAddress?: string;
  fee: string;
  availability: string;
  image: string;
  phone?: string;
  email?: string;
  website?: string;
  timings?: string;
  lat?: string;
  lng?: string;
  slots: { date: string; times: string[] }[];
};

const LOGO_URL = "/images/consult/logo.png";

const MOCK_DOCTORS: MockDoctor[] = [
  {
    id: 1,
    name: "Dr. Anjali Desai",
    specialty: "Dentist",
    experience: "12 years experience",
    location: "Jubilee Hills, Hyderabad",
    clinic: "Apollo Dental",
    clinicAddress: "Road No 92, Jubilee Hills, Hyderabad, Telangana 500033",
    phone: "040-2360-7777",
    email: "contact@apollodental.com",
    website: "https://www.apollodental.com",
    timings: "Open: 9:00 AM to 1:00 PM & 4:00 PM to 8:30 PM",
    fee: "₹500",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png", 
    slots: [
      { date: "Today", times: ["10:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"] },
      { date: "Tomorrow", times: ["09:00 AM", "11:00 AM", "3:00 PM"] }
    ],
    lat: "12.9345",
    lng: "77.5345"
  },
  {
    id: 2,
    name: "Dr. Rajesh Kumar",
    specialty: "General Physician",
    experience: "15 years experience",
    location: "Kondapur, Hyderabad",
    clinic: "Kims Hospital",
    clinicAddress: "Kondapur Main Road, Hyderabad, Telangana 500084",
    phone: "040-4488-5000",
    email: "info@kimshospitals.com",
    website: "https://www.kimshospitals.com",
    timings: "Open: 24 Hours",
    fee: "₹600",
    availability: "Available Today",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Today", times: ["05:00 PM", "06:30 PM", "08:00 PM"] },
      { date: "Tomorrow", times: ["10:30 AM", "12:30 PM", "05:30 PM"] }
    ],
    lat: "12.9350",
    lng: "77.5360"
  },
  {
    id: 3,
    name: "Dr. Priya Sharma",
    specialty: "Gynecologist/Obstetrician",
    experience: "9 years experience",
    location: "Banjara Hills, Hyderabad",
    clinic: "Rainbow Children's Hospital",
    clinicAddress: "Road No 2, Banjara Hills, Hyderabad, Telangana 500034",
    phone: "1800-2122",
    email: "info@rainbowhospitals.in",
    website: "https://www.rainbowhospitals.in",
    timings: "Open: 24 Hours",
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
    clinic: "Skin & Hair Clinic",
    clinicAddress: "Hitech City Rd, Madhapur, Hyderabad, Telangana 500081",
    phone: "040-1234-5678",
    email: "contact@skinclinic.com",
    website: "https://www.skinclinic.com",
    timings: "Open: 10:00 AM to 7:00 PM",
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
    clinic: "Shree Veda Multispeciality Hospital",
    clinicAddress: "NH 65, Ashok Nagar, Ramachandrapuram, Hyderabad, Telangana 502032",
    phone: "040-2303-1234",
    email: "info@shreevedahospital.com",
    website: "https://www.shreevedahospital.com",
    timings: "Open: 09:00 AM to 09:00 PM",
    fee: "₹800",
    availability: "Available Today",
    image: "/images/dr_siddalinga_swamy.png",
    slots: [
      { date: "Today", times: ["10:00 AM", "01:00 PM", "06:00 PM"] },
      { date: "Tomorrow", times: ["10:00 AM", "02:00 PM", "05:00 PM"] }
    ]
  },
  {
    id: 6,
    name: "Dr. Ravi Varma",
    specialty: "Cardiologist",
    experience: "20 years experience",
    location: "Gachibowli, Hyderabad",
    clinic: "Continental Hospitals",
    clinicAddress: "Financial District, Gachibowli, Hyderabad, Telangana 500032",
    timings: "Open: 24 Hours",
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
    clinic: "Oliva Skin & Hair Clinic",
    clinicAddress: "KPHB Colony, Kukatpally, Hyderabad, Telangana 500072",
    timings: "Open: 10:00 AM to 8:00 PM",
    fee: "₹550",
    availability: "Available Tomorrow",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    slots: [
      { date: "Tomorrow", times: ["03:00 PM", "05:00 PM", "07:00 PM"] }
    ]
  }
];

/* ================= COMPONENT ================= */

const FindDoctorsPage: React.FC = () => {
    const location = useLocation();

    // -- Search State --
    const [city, setCity] = useState("Bengaluru");
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(() => {
        return new URLSearchParams(location.search).get('category') || null;
    });
    const [area, setArea] = useState("");
    const [type, setType] = useState("Clinic");
    
    // Booking State
    const [bookingDoctor, setBookingDoctor] = useState<MockDoctor | null>(null);
    const [bookingSlot, setBookingSlot] = useState<BookingSlot | null>(null);
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [isBooked, setIsBooked] = useState(false);
    const [myAppointments, setMyAppointments] = useState<Appointment[]>([]);
    const [showAppointments, setShowAppointments] = useState(false);

    // -- Overlay State --
    const [overlayDoctor, setOverlayDoctor] = useState<MockDoctor | null>(null);

    // -- Data State --
    const [doctors, setDoctors] = useState<ClinicListResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableAreas, setAvailableAreas] = useState<string[]>([]);
    
    // -- Map State --
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });
    const [currentBounds, setCurrentBounds] = useState<{ south: number; west: number; north: number; east: number } | null>(null);
    const [activeDoctor, setActiveDoctor] = useState<ClinicListResponse | null>(null);
    const [mapSelectedDoctorId, setMapSelectedDoctorId] = useState<string | null>(null);
    const [viewMapDoctor, setViewMapDoctor] = useState<ClinicListResponse | null>(null);

    // -- Location & Distance State --
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude
                    });
                },
                (err) => console.error("Location access denied or failed", err)
            );
        }
    }, []);

    // -- Helpers --
    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radius of the earth in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in km
        return d;
    };

    const getCoordinatesForArea = (areaVal: string) => {
        const a = (areaVal || "").toLowerCase();
        if (a.includes("banashankari")) {
            return { south: 12.9341, west: 77.5428, north: 12.9382, east: 77.5792 }; 
        }
        if (a.includes("jayanagar")) {
            return { south: 12.9263, west: 77.5428, north: 12.9460, east: 77.5792 };
        }
        if (a.includes("uttarahalli")) {
            return { south: 12.8900, west: 77.5300, north: 12.9200, east: 77.5700 };
        }
        return null;
    };

    const getCityBounds = (cityVal: string) => {
        const c = (cityVal || "Bengaluru").toLowerCase();
        if (c.includes("hyd")) {
            return { south: 17.1, west: 78.2, north: 17.6, east: 78.7 };
        }
        // Default Bengaluru
        return { south: 12.8, west: 77.4, north: 13.2, east: 77.8 };
    };

    const calculateBoundsFromDoctors = (docs: ClinicListResponse[]) => {
        if (docs.length === 0) return null;
        let south = 90, west = 180, north = -90, east = -180;
        let valid = false;

        docs.forEach(d => {
            const lat = parseFloat(d.lat);
            const lng = parseFloat(d.lng);
            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
                if (lat < south) south = lat;
                if (lat > north) north = lat;
                if (lng < west) west = lng;
                if (lng > east) east = lng;
                valid = true;
            }
        });

        if (!valid) return null;

        const padLat = (north - south) * 0.1 || 0.01;
        const padLng = (east - west) * 0.1 || 0.01;

        return {
            south: south - padLat,
            north: north + padLat,
            west: west - padLng,
            east: east + padLng
        };
    };

    const normalizeSearchTerm = (term: string | null): string => {
        if (!term) return "";
        const lower = term.toLowerCase();
        if (lower.includes("ent")) return "ENT";
        if (lower.includes("gynecologist")) return "Gynecologist";
        if (lower.includes("dermatologist")) return "Dermatologist";
        if (lower.includes("general physician")) return "General Physician";
        if (lower.includes("pediatrician")) return "Pediatrician";
        if (lower.includes("orthopedic")) return "Orthopedic";
        if (lower.includes("cardiologist")) return "Cardiologist";
        if (lower.includes("dentist")) return "Dentist";
        
        return term.charAt(0).toUpperCase() + term.slice(1);
    };

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

    useEffect(() => {
        const timeoutId = setTimeout(() => {
           fetchAreas("");
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [city, fetchAreas]);
    
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (area) fetchAreas(area);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [area, fetchAreas]);

    // Force re-fetch trigger
    const [searchTrigger, setSearchTrigger] = useState(0);

    // -- Fetch Doctors Logic --
    useEffect(() => {
        const fetchData = async () => {
             setLoading(true);
             setError(null);
             try {
                 const rawType = type || selectedSpecialty || "Doctor"; 
                 const searchType = normalizeSearchTerm(rawType); 
                 const searchArea = (area === "All Areas" || area === "") ? "" : area;
                 
                 let results: ClinicListResponse[] = [];
                 
                 try {
                     if (currentBounds) {
                         const mapDetails = await ReachMyDoctorApi.getMapBasicDetails(
                             searchType, 
                             city, 
                             "", 
                             currentBounds 
                         );
                         
                         if (mapDetails.length > 0) {
                            results = mapDetails.map(d => ({
                                id: d.id,
                                name: d.name,
                                address: d.city, 
                                city: d.city,
                                locality: d.name.includes(",") ? d.name.split(",")[1] : d.city,
                                lat: d.lat,
                                lng: d.lng,
                                logo: d.icon,
                                specializations: d.timingStatus || searchType 
                            }));
                         }
                     } 
                     
                     if (results.length === 0) {
                         const defaultCoords = getCoordinatesForArea(searchArea);
                         if (defaultCoords) {
                             const mapDetails = await ReachMyDoctorApi.getMapBasicDetails(
                                 searchType, 
                                 city, 
                                 searchArea, 
                                 defaultCoords 
                             );
                             if (mapDetails.length > 0) {
                                results = mapDetails.map(d => ({
                                    id: d.id,
                                    name: d.name,
                                    address: d.city, 
                                    city: d.city,
                                    locality: searchArea || d.city,
                                    lat: d.lat,
                                    lng: d.lng,
                                    logo: d.icon,
                                    specializations: d.timingStatus || searchType 
                                }));
                                if (searchArea && searchArea !== "All Areas") {
                                    setCurrentBounds(defaultCoords);
                                }
                             }
                         } else if (searchArea && searchArea !== "All Areas") {
                             const cityBounds = getCityBounds(city);
                             const mapDetails = await ReachMyDoctorApi.getMapBasicDetails(
                                 searchType,
                                 city,
                                 searchArea,
                                 cityBounds
                             );

                             if (mapDetails.length > 0) {
                                 results = mapDetails.map(d => ({
                                    id: d.id,
                                    name: d.name,
                                    address: d.city, 
                                    city: d.city,
                                    locality: searchArea,
                                    lat: d.lat,
                                    lng: d.lng,
                                    logo: d.icon,
                                    specializations: d.timingStatus || searchType 
                                }));
                                
                                const newBounds = calculateBoundsFromDoctors(results);
                                if (newBounds) {
                                    setCurrentBounds(newBounds);
                                }
                             }
                         }
                     }
                 } catch (apiErr) {
                     console.warn("API failed, falling back to local data", apiErr);
                 }

                 setDoctors(results);
                 
                 if (results.length > 0 && !currentBounds) {
                      const first = results[0];
                      if (first.lat && first.lng) {
                          setMapCenter({ lat: parseFloat(first.lat), lng: parseFloat(first.lng) });
                      }
                 }
 
             } catch (err) {
                 console.error("Error fetching doctors:", err);
                 if (doctors.length === 0) setError("Failed to load doctors. Please try again.");
             } finally {
                 setLoading(false);
             }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [city, selectedSpecialty, area, type, currentBounds, searchTrigger]);

    // -- Handlers --
    const handleMarkerClick = useCallback((id: string) => {
        setMapSelectedDoctorId(id);
        const doc = doctors.find(d => d.id === id);
        if (doc) {
            setActiveDoctor(doc);
        }
    }, [doctors]);

    const handleBoundsChange = useCallback((bounds: { south: number; west: number; north: number; east: number }) => {
        setCurrentBounds(prev => {
             if (prev && 
                 prev.south === bounds.south && 
                 prev.west === bounds.west && 
                 prev.north === bounds.north && 
                 prev.east === bounds.east) {
                 return prev;
             }
             return bounds;
        });
    }, []);

    const handleSearch = useCallback((filters: { specialty: string; city: string; area: string; type: string }) => {
        setCity(filters.city);
        if (filters.specialty && filters.specialty !== "Search by Speciality") {
            setSelectedSpecialty(filters.specialty);
        } else {
             setSelectedSpecialty(null);
        }
        setArea(filters.area);
        setType(filters.type);
        setCurrentBounds(null);
        setMapSelectedDoctorId(null);
        setSearchTrigger(prev => prev + 1);
    }, []);

    const handleAreaInputChange = (query: string) => {
        setArea(query);
    };

    const handleCardClick = (doc: ClinicListResponse) => {
        setActiveDoctor(doc);
        const mockDoc = MOCK_DOCTORS.find(m => String(m.id) === doc.id);
        if (mockDoc) {
             setOverlayDoctor(mockDoc);
        } else {
             setOverlayDoctor({
                id: Number(doc.id),
                name: doc.name,
                specialty: doc.specializations || "Specialist",
                experience: "10+ years",
                location: doc.locality,
                clinic: doc.address || doc.name + " Clinic",
                clinicAddress: doc.address + ", " + doc.locality,
                fee: "₹500",
                availability: "Available Today",
                image: doc.logo || LOGO_URL,
                slots: [
                    { date: "Today", times: ["10:00 AM", "11:30 AM", "2:00 PM", "2:30 PM"] },
                    { date: "Tomorrow", times: ["09:00 AM", "11:00 AM"] }
                ],
                timings: "Open: 9:00 AM - 6:00 PM"
             });
        }
    };

    const handleBookClick = (e: React.MouseEvent, doc: ClinicListResponse) => {
        e.stopPropagation();
        
        const mockDoc = MOCK_DOCTORS.find(m => String(m.id) === doc.id);
        if (mockDoc) {
             setBookingDoctor(mockDoc);
        } else {
             setBookingDoctor({
                 id: Number(doc.id),
                 name: doc.name,
                 specialty: doc.specializations || "Specialist",
                 experience: "10+ years",
                 location: doc.locality,
                 clinic: doc.address,
                 fee: "₹500",
                 availability: "Available Today",
                 image: doc.logo || LOGO_URL,
                 slots: [
                   { date: "Today", times: ["10:00 AM", "11:30 AM", "2:00 PM"] },
                   { date: "Tomorrow", times: ["09:00 AM", "11:00 AM"] }
                 ]
             });
        }
        setIsBooked(false);
        setBookingSlot(null);
        setPatientName("");
        setPatientPhone("");
    };

    const handleBookFromOverlay = () => {
         if (overlayDoctor) {
             setBookingDoctor(overlayDoctor);
             setOverlayDoctor(null);
             setIsBooked(false);
             setBookingSlot(null);
             setPatientName("");
             setPatientPhone("");
         }
    };

    const confirmBooking = () => {
        if (bookingDoctor && bookingSlot && patientName && patientPhone) {
            const newApp: Appointment = {
                id: Date.now(),
                doctorName: bookingDoctor.name,
                specialty: bookingDoctor.specialty,
                clinic: bookingDoctor.clinic,
                location: bookingDoctor.location,
                date: bookingSlot.date,
                time: bookingSlot.time,
                patientName: patientName,
                status: 'Attending',
                bookingDate: new Date().toISOString()
            };
            
            setMyAppointments(prev => [...prev, newApp]);
            
            try {
                const stored = localStorage.getItem('appointments');
                const existingApps = stored ? JSON.parse(stored) : [];
                localStorage.setItem('appointments', JSON.stringify([...existingApps, newApp]));
            } catch (err) {
                console.error("Failed to save appointment", err);
            }

            setIsBooked(true);
        }
    };

    const handleViewAppointments = () => {
        setBookingDoctor(null);
        setBookingSlot(null);
        setPatientName("");
        setPatientPhone("");
        setIsBooked(false);
        setShowAppointments(true);
    };

    const resetBooking = () => {
        setBookingDoctor(null);
        setBookingSlot(null);
        setPatientName("");
        setPatientPhone("");
        setIsBooked(false);
    };

    const handleViewMapClick = (e: React.MouseEvent, doc: ClinicListResponse) => {
        e.stopPropagation();
        setViewMapDoctor(doc);
    };

    return (
        <div className="find-doctors-container">
            {/* Header / Search Bar */}
            <div className="fd-header">
                <AdvancedSearchBar 
                    locations={["Bengaluru", "Hyderabad", "Chennai", "Mumbai", "Delhi"]}
                    areas={availableAreas} 
                    onSearch={handleSearch}
                    onAreaInputChange={handleAreaInputChange}
                    initialFilters={{
                        city, 
                        specialty: selectedSpecialty || '',
                        area,
                        type
                    }}
                />
            </div>

            {/* Content: Map + List */}
            <div className="fd-content-wrapper">
                
                {/* Left: Map View */}
                <div className="fd-map-container">
                    <MapComponent 
                        center={mapCenter} 
                        zoom={13} 
                        onBoundsChange={handleBoundsChange}
                        locations={doctors
                            .filter(d => d.lat && d.lng && !isNaN(parseFloat(d.lat)) && !isNaN(parseFloat(d.lng)))
                            .map(d => ({
                                id: d.id,
                                lat: parseFloat(d.lat),
                                lng: parseFloat(d.lng),
                                name: d.name,
                                type: d.name + " " + (d.specializations || "")
                            }))
                        }
                        activeLocation={(activeDoctor && activeDoctor.lat && activeDoctor.lng && !isNaN(parseFloat(activeDoctor.lat)) && !isNaN(parseFloat(activeDoctor.lng))) ? { 
                            lat: parseFloat(activeDoctor.lat), 
                            lng: parseFloat(activeDoctor.lng), 
                            name: activeDoctor.name 
                        } : null}
                        onMarkerClick={handleMarkerClick}
                    />
                </div>

                {/* Right: Doctor List */}
                <div className="fd-list-container">
                    <div className="fd-list-header-panel">
                        <h2>{type.toUpperCase()} IN {area ? area.toUpperCase() : city.toUpperCase()}</h2>
                        {error && <div style={{ color: 'red', fontSize: '12px', marginBottom: '8px' }}>{error}</div>}
                        <div className="fd-inner-search">
                           <input 
                              type="text" 
                              placeholder="Search..." 
                              className="fd-inner-search-input"
                              onChange={(e) => {
                                  const val = e.target.value.toLowerCase();
                                  const items = document.querySelectorAll('.fd-doctor-card');
                                  items.forEach((item) => {
                                      const text = item.textContent?.toLowerCase() || "";
                                      (item as HTMLElement).style.display = text.includes(val) ? "flex" : "none";
                                  });
                              }}
                           />
                           <Search size={16} className="fd-inner-search-icon" /> 
                        </div>
                    </div>

                    {/* Show Reset Filter Option if map selection is active */}
                    {mapSelectedDoctorId && (
                        <div style={{ padding: '0 16px 12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                                Showing 1 result for selected clinic
                            </span>
                            <button 
                                onClick={() => setMapSelectedDoctorId(null)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#2563eb', 
                                    cursor: 'pointer', 
                                    fontSize: '13px', 
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}
                            >
                                <X size={14} /> Show All
                            </button>
                        </div>
                    )}

                    <div className="fd-list-scroll">
                        {loading && <div style={{textAlign:'center', padding:'20px'}}>Loading...</div>}
                        
                        {!loading && doctors.length === 0 && (
                            <div className="fd-no-results">
                                <p>No results found.</p>
                            </div>
                        )}

                        {doctors
                            .filter(doc => !mapSelectedDoctorId || doc.id === mapSelectedDoctorId)
                            .map((doc, index) => {
                            const isOpen = index % 3 !== 0; 
                            const statusColor = isOpen ? '#28a745' : '#dc3545';
                            const statusText = isOpen ? 'Open' : 'Closed';
                            const statusIcon = isOpen ? '🕒' : '🚫'; 

                            return (
                                <div 
                                    key={doc.id} 
                                    className={`fd-doctor-card ${activeDoctor?.id === doc.id ? 'active' : ''}`}
                                    onClick={() => handleCardClick(doc)}
                                >
                                    <div className="fd-card-left">
                                        <div className="fd-card-name-row">
                                            <h3 className="fd-card-name">{doc.name}</h3>
                                            <span className="fd-verified-check">✔</span> 
                                        </div>
                                        <div className="fd-card-status" style={{color: statusColor}}>
                                            <span className="fd-status-icon">{statusIcon}</span>
                                            <span className="fd-status-text">{statusText}</span>
                                        </div>
                                        <div className="fd-card-meta">
                                            <span className="fd-meta-text">{doc.locality}</span>
                                        </div>
                                        
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px'}}>
                                            <span 
                                                className="doc-map-link" 
                                                style={{color: '#3b82f6', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center'}}
                                                onClick={(e) => handleViewMapClick(e, doc)}
                                            >
                                               📍 View on Map
                                            </span>
                                        </div>

                                        <button 
                                            className="fd-btn-book-text"
                                            onClick={(e) => handleBookClick(e, doc)}
                                        >
                                            Book Appointment
                                        </button>
                                    </div>

                                    <div className="fd-card-right">
                                        <div className="fd-type-icon-circle">
                                            <img src="https://reachmydoctor.in/pages/images/icons/stethoscope.png" alt="icon" className="fd-steth-icon" 
                                                 onError={(e) => (e.target as HTMLImageElement).src = LOGO_URL}
                                            /> 
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Clinic Details Overlay */}
            {overlayDoctor && (
                <div className="clinic-overlay-backdrop" onClick={() => setOverlayDoctor(null)}>
                    <div className="clinic-overlay-card" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="co-header">
                            <button className="co-close-btn" onClick={() => setOverlayDoctor(null)}>
                                <X size={24} />
                            </button>
                            <div className="co-header-content">
                                <span className="co-subtitle">Clinic</span>
                                <h2 className="co-title">{overlayDoctor.name}</h2>
                                <p className="co-location">{overlayDoctor.location || (overlayDoctor as any).locality}</p>
                            </div>
                            {(() => {
                                const docLat = (overlayDoctor as any).lat ? parseFloat((overlayDoctor as any).lat) : 0;
                                const docLng = (overlayDoctor as any).lng ? parseFloat((overlayDoctor as any).lng) : 0;
                                
                                if (userLocation && docLat && docLng) {
                                    const dist = calculateDistance(userLocation.lat, userLocation.lng, docLat, docLng);
                                    const etaMins = Math.round((dist * 60) / 30);
                                    return (
                                        <div 
                                            className="co-distance-badge" 
                                            style={{cursor: 'pointer'}}
                                            onClick={() => {
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${docLat},${docLng}`, '_blank');
                                            }}
                                            title="Click for Directions"
                                        >
                                            📍 {dist.toFixed(1)} km • ~{etaMins} mins
                                        </div>
                                    );
                                } else if (docLat && docLng) {
                                     return (
                                        <div 
                                            className="co-distance-badge" 
                                            style={{cursor: 'pointer'}}
                                            onClick={() => {
                                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${docLat},${docLng}`, '_blank');
                                            }}
                                        >
                                            📍 Order: Get Directions
                                        </div>
                                     );
                                } else {
                                     return (
                                        <div 
                                            className="co-distance-badge"
                                            style={{cursor: 'pointer'}}
                                            onClick={() => {
                                                const query = encodeURIComponent(`${overlayDoctor.name} ${overlayDoctor.location || ""}`);
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                                            }}
                                            title="Search on Google Maps"
                                        >
                                            📍 View on Map
                                        </div>
                                     );
                                }
                            })()}
                        </div>
                        
                        {/* Action Bar */}
                        <div className="co-actions-row">
                            <div className="co-action-item" onClick={handleBookFromOverlay}>
                                <div className="co-action-icon"><Calendar size={20} /></div>
                                <span>Book Appointment</span>
                            </div>
                            <div className="co-action-item">
                                <div className="co-action-icon"><Phone size={20} /></div>
                                <span>Call</span>
                            </div>
                            <div className="co-action-item">
                                <div className="co-action-icon"><Share2 size={20} /></div>
                                <span>Share</span>
                            </div>
                            <div className="co-action-item">
                                <div className="co-action-icon"><Globe size={20} /></div>
                                <span>Whatsapp</span>
                            </div>
                             <div className="co-action-item">
                                <div className="co-action-icon"><Mail size={20} /></div>
                                <span>Email</span>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="co-details-body">
                           <div className="co-detail-row">
                               <div className="co-icon-col"><MapPin size={18} /></div>
                               <div className="co-info-col">
                                   <strong>Address</strong>
                                   <p>{overlayDoctor.clinicAddress || overlayDoctor.clinic}</p>
                                   <p>{overlayDoctor.location}</p>
                               </div>
                           </div>
                           
                           <div className="co-detail-row">
                               <div className="co-icon-col"><Phone size={18} /></div>
                               <div className="co-info-col">
                                   <strong>Phone</strong>
                                   <p>{overlayDoctor.phone || "Not Available"}</p>
                               </div>
                           </div>

                             <div className="co-detail-row">
                               <div className="co-icon-col"><Mail size={18} /></div>
                               <div className="co-info-col">
                                   <strong>Email</strong>
                                   <p>{overlayDoctor.email || "Not Available"}</p>
                               </div>
                           </div>

                           <div className="co-detail-row">
                               <div className="co-icon-col"><Globe size={18} /></div>
                               <div className="co-info-col">
                                   <strong>Website</strong>
                                   <p>{overlayDoctor.website || "Not Available"}</p>
                               </div>
                           </div>

                            <div className="co-detail-row">
                               <div className="co-icon-col"><Clock size={18} /></div>
                               <div className="co-info-col">
                                   <strong>Hours</strong>
                                   <p>{overlayDoctor.timings || "Open today"}</p>
                               </div>
                           </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Map Modal */}
            {viewMapDoctor && !overlayDoctor && (
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
                                src={`https://maps.google.com/maps?q=${encodeURIComponent((viewMapDoctor.address || "") + ", " + viewMapDoctor.locality)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {bookingDoctor && !viewMapDoctor && !overlayDoctor && (
                <div className="booking-modal-backdrop" onClick={resetBooking}>
                    <div className="booking-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Book Appointment</h3>
                            <button className="close-btn" onClick={resetBooking}>&times;</button>
                        </div>
                        
                        {!isBooked ? (
                            <>
                                <div className="doctor-summary">
                                    <img src={bookingDoctor.image} alt={bookingDoctor.name} onError={(e) => (e.target as HTMLImageElement).src = LOGO_URL} />
                                    <div>
                                        <h4>{bookingDoctor.name}</h4>
                                        <p>{bookingDoctor.specialty} • {bookingDoctor.experience}</p>
                                        <p style={{fontWeight: 500}}>{bookingDoctor.clinic}</p>
                                        <p style={{fontSize: '12px', color: '#64748b'}}>{bookingDoctor.clinicAddress || bookingDoctor.location}</p>
                                    </div>
                                </div>
                                
                                <div className="booking-field" style={{marginBottom: '20px'}}>
                                    <label style={{display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:500, color:'#475569'}}>Patient Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="Enter patient name"
                                        value={patientName}
                                        onChange={(e) => setPatientName(e.target.value)}
                                        className="booking-input"
                                    />
                                </div>

                                <div className="booking-field" style={{marginBottom: '20px'}}>
                                    <label style={{display:'block', marginBottom:'8px', fontSize:'14px', fontWeight:500, color:'#475569'}}>Phone Number</label>
                                    <input 
                                        type="tel" 
                                        placeholder="Enter phone number"
                                        value={patientPhone}
                                        onChange={(e) => setPatientPhone(e.target.value)}
                                        className="booking-input"
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
                                        disabled={!bookingSlot || !patientName || !patientPhone}
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
                                <h3 style={{color: '#16a34a', marginBottom: '8px'}}>Appointment Booked!</h3>
                                <p style={{marginBottom: '24px'}}>Your appointment has been confirmed.</p>
                                
                                <div className="confirmation-details" style={{textAlign: 'left'}}>
                                    <div style={{borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '12px', display: 'flex', gap: '12px', alignItems: 'center'}}>
                                        <img src={bookingDoctor.image} alt={bookingDoctor.name} 
                                            style={{width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover'}} 
                                            onError={(e) => (e.target as HTMLImageElement).src = LOGO_URL}
                                        />
                                        <div>
                                            <div style={{fontWeight: 600, color: '#1e293b'}}>{bookingDoctor.name}</div>
                                            <div style={{fontSize: '13px', color: '#64748b'}}>{bookingDoctor.specialty} • {bookingDoctor.experience}</div>
                                            <div style={{fontSize: '13px', color: '#64748b'}}>{bookingDoctor.clinic}</div>
                                            <div style={{fontSize: '12px', color: '#94a3b8'}}>{bookingDoctor.location}</div>
                                        </div>
                                    </div>

                                    <div className="detail-row">
                                        <span>Patient Name</span>
                                        <strong>{patientName}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Phone Number</span>
                                        <strong>{patientPhone}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Date</span>
                                        <strong>{bookingSlot?.date}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Time</span>
                                        <strong>{bookingSlot?.time}</strong>
                                    </div>
                                    <div className="detail-row">
                                        <span>Clinic Address</span>
                                        <strong style={{textAlign: 'right', maxWidth: '60%'}}>{bookingDoctor.clinicAddress || bookingDoctor.location}</strong>
                                    </div>
                                </div>

                                <button className="btn-primary" style={{width:'100%'}} onClick={handleViewAppointments}>View Appointments</button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* My Appointments Modal */}
            {showAppointments && (
                <div className="booking-modal-backdrop" onClick={() => setShowAppointments(false)}>
                    <div className="booking-modal" style={{maxWidth: '600px'}} onClick={e => e.stopPropagation()}>
                         <div className="modal-header">
                            <h3>My Appointments</h3>
                            <button className="close-btn" onClick={() => setShowAppointments(false)}>&times;</button>
                        </div>
                        <div style={{padding: '20px', overflowY: 'auto', maxHeight: '70vh'}}>
                            {myAppointments.length === 0 ? (
                                <p style={{textAlign: 'center', color: '#64748b'}}>No appointments booked yet.</p>
                            ) : (
                                <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                                    {myAppointments.map(app => (
                                        <div key={app.id} style={{border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', background: '#f8fafc'}}>
                                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                                                <h4 style={{margin: 0, color: '#1e293b'}}>{app.doctorName}</h4>
                                                <span style={{
                                                    fontSize: '12px', 
                                                    padding: '4px 8px', 
                                                    borderRadius: '12px', 
                                                    background: app.status === 'Attending' ? '#dcfce7' : (app.status === 'Attend Later' ? '#fef3c7' : '#f1f5f9'),
                                                    color: app.status === 'Attending' ? '#166534' : (app.status === 'Attend Later' ? '#92400e' : '#64748b'),
                                                    fontWeight: 600
                                                }}>
                                                    {app.status}
                                                </span>
                                            </div>
                                            <p style={{fontSize: '13px', color: '#64748b', margin: '0 0 4px 0'}}>{app.specialty} • {app.clinic}</p>
                                            <div style={{fontSize: '13px', color: '#334155', marginTop: '8px', display: 'flex', gap: '16px'}}>
                                                <span>📅 {app.date}</span>
                                                <span>⏰ {app.time}</span>
                                            </div>
                                            <div style={{fontSize: '12px', color: '#94a3b8', marginTop: '4px'}}>
                                                📍 {app.location}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FindDoctorsPage;
