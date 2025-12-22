import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import '../App.css';
import './FindDoctorsPage.css'; // Import new CSS
import AdvancedSearchBar from '../components/AdvancedSearchBar';
import MapComponent from '../components/MapComponent';
import ReachMyDoctorApi, { ClinicListResponse } from '../services/reachMyDoctorApi';

import { LOGO_URL, MOCK_DOCTORS, Doctor } from '../data/mockData';


const FindDoctorsPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // -- Search State --
    const [city, setCity] = useState("Bengaluru"); // Default to strict API name
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(() => {
        return new URLSearchParams(location.search).get('category') || null;
    });
    const [area, setArea] = useState("");
    const [type, setType] = useState("Clinic"); // Default type

    // -- Data State --
    const [doctors, setDoctors] = useState<ClinicListResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [availableAreas, setAvailableAreas] = useState<string[]>([]);
    
    // -- Map State --
    const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 }); // Default Bangalore
    const [activeDoctor, setActiveDoctor] = useState<ClinicListResponse | null>(null);

    // -- Fetch Areas Logic (Debounced) --
    const fetchAreas = useCallback(async (query: string) => {
        if (!city) return;
        try {
            const localities = await ReachMyDoctorApi.getLocalities(city, query);
            setAvailableAreas(localities.map(l => l.locality));
        } catch (err) {
            console.error("Failed to fetch areas", err);
        }
    }, [city]);

    // Debounce helper
    useEffect(() => {
        const timeoutId = setTimeout(() => {
           // Initial load of all areas
           fetchAreas("");
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [city, fetchAreas]);

    const handleAreaInputChange = (query: string) => {
        // Simple debounce could be here, or just let API handle it if fast enough. 
        // For better UX during typing, we wait 300ms.
        setArea(query); // Update local state immediately for input
    };
    
    // Effect to trigger search when area input changes after delay
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (area) fetchAreas(area);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [area, fetchAreas]);


    // -- Helpers --
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
        return term;
    };

    const mapMockToClinic = (mockDoc: Doctor): ClinicListResponse => {
        const parts = mockDoc.location.split(',');
        const loc = parts[0] ? parts[0].trim() : "";
        const cityVal = parts[1] ? parts[1].trim() : "Bengaluru";
        
        return {
            id: String(mockDoc.id),
            name: mockDoc.name,
            address: mockDoc.clinic,
            city: cityVal,
            locality: loc,
            lat: "12.9716", // Default fallback
            lng: "77.5946",
            logo: mockDoc.image,
            specializations: mockDoc.specialty
        };
    };

    // -- Fetch Data Effect --
    useEffect(() => {
        const fetchData = async () => {
             setLoading(true);
             setError(null);
             try {
                 const rawType = selectedSpecialty || type || "Doctor"; // Default to Doctor to ensure results
                 const searchType = normalizeSearchTerm(rawType); 
                 
                 // Pass area only if it's not "All Areas" or empty
                 const searchArea = (area === "All Areas" || area === "") ? "" : area;
                 
                 console.log(`[FindDoctorsPage] Fetching clinics: Type=${searchType}, City=${city}, Area=${searchArea}`);
                 let results: ClinicListResponse[] = [];
                 
                 try {
                     // Use map bounds if available, otherwise default box for Bengaluru (or derived from city)
                     // Data provided by user for Banashankari and general areas
                     const getCoordinatesForArea = (areaVal: string) => {
                         const a = areaVal.toLowerCase();
                         
                     // Specific bounds for Banashankari (derived from user data)
                         if (a.includes("banashankari")) {
                             return { 
                                 south: 12.934113583745955, 
                                 west: 77.54284239404296, 
                                 north: 12.938296198720652, 
                                 east: 77.57923460595703 
                             }; 
                         }
                         
                         // Specific bounds for Jayanagar (derived from user provided API snippet)
                         if (a.includes("jayanagar")) {
                             return { 
                                 south: 12.926375561196737, 
                                 west: 77.54284239404296, 
                                 north: 12.946033851490565, 
                                 east: 77.57923460595703 
                             };
                         }
                         
                         // Default Bengaluru Box
                         return {
                             south: 12.8, west: 77.4, 
                             north: 13.2, east: 77.9
                         };
                     };

                     // Try to get dynamic map center first if we have an area
                     if (searchArea) {
                         try {
                              const mapCenterRes = await ReachMyDoctorApi.getMapCenter(searchType, city, searchArea);
                              if (mapCenterRes && mapCenterRes.RESPONSE === "SUCCESS" && mapCenterRes.MAP_CENTER) {
                                  const center = mapCenterRes.MAP_CENTER[0];
                                  if (center && center.lat && center.lng) {
                                      setMapCenter({ lat: parseFloat(center.lat), lng: parseFloat(center.lng) });
                                  }
                              }
                         } catch (centerErr) {
                             console.warn("Failed to fetch map center", centerErr);
                         }
                     }

                     const defaultCoords = getCoordinatesForArea(searchArea);

                     // We are using getMapBasicDetails as requested by user
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
                            address: d.city, // Basic details might not have full address, using city/area
                            city: d.city,
                            locality: searchArea || d.city, // Use searched area or city
                            lat: d.lat,
                            lng: d.lng,
                            logo: d.icon,
                            specializations: d.timingStatus // Using timingStatus temporarily or known type
                        }));
                     } else {
                         // Fallback to getClinicsList if map details empty
                         console.log("No Map Basic Details, falling back to getClinicsList");
                         results = await ReachMyDoctorApi.getClinicsList(searchType, city, searchArea);
                     }
                     
                 } catch (apiErr) {
                     console.warn("API failed, falling back to local data", apiErr);
                 }

                 // Final Fallback: Use Local Mock Data if API returns nothing (or fails)
                 if (results.length === 0) {
                     console.log("Using Local Mock Data Fallback");
                     


                     // Filter general mock doctors if still empty
                     if (results.length === 0) {
                         const mockResults = MOCK_DOCTORS.filter(d => {
                             const cityLower = city.toLowerCase();
                             const docLoc = d.location.toLowerCase();
                             
                             // Handle Bengaluru/Bangalore alias for mock data
                             const matchCity = docLoc.includes(cityLower) || 
                                             (cityLower === "bengaluru" && docLoc.includes("bangalore"));
                                             
                             // Simple specialty match
                             const matchSpecialty = searchType ? d.specialty.toLowerCase().includes(searchType.toLowerCase()) : true;
                             return matchCity && matchSpecialty;
                         });
                         
                         if (mockResults.length > 0) {
                             results = mockResults.map(mapMockToClinic);
                         }
                     }
                 }

                 console.log("Final Clinics result:", results);
                 setDoctors(results);
                 
                 if (results.length > 0) {
                      const first = results[0];
                      if (first.lat && first.lng) {
                          setMapCenter({ lat: parseFloat(first.lat), lng: parseFloat(first.lng) });
                      }
                 }
 
             } catch (err) {
                 console.error("Error fetching doctors:", err);
                 // Even in error, we might have set doctors from fallback, so don't block
                 if (doctors.length === 0) setError("Failed to load doctors. Please try again.");
             } finally {
                 setLoading(false);
             }
        };

        const timeoutId = setTimeout(() => {
            fetchData();
        }, 500); 

        return () => clearTimeout(timeoutId);
    }, [city, selectedSpecialty, area, type]);

    // -- Handlers --
    const handleSearch = useCallback((filters: { specialty: string; city: string; area: string; type: string }) => {
        setCity(filters.city);
        if (filters.specialty && filters.specialty !== "Search by Speciality") {
            setSelectedSpecialty(filters.specialty);
        } else {
             setSelectedSpecialty(null);
        }
        setArea(filters.area);
        setType(filters.type);
    }, []);

    const handleCardClick = (doc: ClinicListResponse) => {
        setActiveDoctor(doc);
    };

    const handleBookClick = (e: React.MouseEvent, doc: ClinicListResponse) => {
        e.stopPropagation();
        // Use navigate to go to appointment booking or detail
        // For now, passing doc details in state or simple navigation
        navigate(`/appointments`, { state: { doctorId: doc.id, doctorName: doc.name } });
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
                        locations={doctors.map(d => ({
                            id: d.id,
                            lat: parseFloat(d.lat),
                            lng: parseFloat(d.lng),
                            name: d.name,
                            type: d.specializations || "Doctor"
                        }))}
                        activeLocation={activeDoctor ? { 
                            lat: parseFloat(activeDoctor.lat), 
                            lng: parseFloat(activeDoctor.lng), 
                            name: activeDoctor.name 
                        } : null}
                    />
                </div>

                {/* Right: Doctor List (Styled as Side Panel) */}
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
                                  // Simple local filter for demonstration
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

                    <div className="fd-list-scroll">
                        {loading && <div style={{textAlign:'center', padding:'20px'}}>Loading...</div>}
                        
                        {!loading && doctors.length === 0 && (
                            <div className="fd-no-results">
                                <p>No results found.</p>
                            </div>
                        )}

                        {doctors.map((doc, index) => {
                            // Mocking status for UI matching
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
        </div>
    );
};

export default FindDoctorsPage;
