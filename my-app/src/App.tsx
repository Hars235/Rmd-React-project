import React, { useEffect, useState, type FormEvent } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import "./App.css";
import VideoConsultPage from "./pages/VideoConsultPage";
import SurgeriesPage from "./pages/SurgeriesPage";
// import FindDoctorsPage from "./pages/FindDoctorsPage"; // uncomment if you have it
import FindDoctorsPage from "./pages/FindDoctorsPage";
import LabTestsPage from "./pages/LabTestsPage";
import ProfilePage from "./pages/ProfilePage";
import PhotoUploadPage from "./pages/PhotoUploadPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import Sidebar from "./components/Sidebar";
import ConsultationsPage from "./pages/ConsultationsPage";


/* Assets */
const BG_IMAGE_URL = "/images/consult/reachMydoctor-intro.jpg";
const LOGO_URL = "/images/consult/logo.png";

/* Types */
type MainHomeProps = { 
  name: string;
  profileData: ProfileData;
  updateProfileField: (field: keyof ProfileData, value: string) => void;
  completionPercent: number;
};
type ArticleCard = { tag: string; title: string; author: string; image: string };
type DoctorResult = { name: string; speciality: string; clinic: string; city: string };
type ClinicInfo = {
  id: number;
  city: string;
  locality: string;
  name: string;
  status: "Open" | "Closed" | "Unknown";
};
type HomeCard = { id: "video" | "find" | "lab" | "surgery"; title: string; subtitle: string; image: string; bgColor: string; };

export interface ProfileData {
  userName: string;
  contactNumber: string;
  email: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  maritalStatus: string;
  height: string;
  weight: string;
  emergencyContact: string;
  location: string;
  
  // Medical
  allergies: string;
  currentMeds: string;
  pastMeds: string;
  chronicDiseases: string;
  injuries: string;
  surgeries: string;

  // Lifestyle
  smoking: string;
  alcohol: string;
  activityLevel: string;
  foodPreference: string;
  occupation: string;
}

const INITIAL_PROFILE_DATA: ProfileData = {
    userName: "Harsha M",
    contactNumber: "+91-8277634896",
    email: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    maritalStatus: "",
    height: "",
    weight: "",
    emergencyContact: "",
    location: "",
    allergies: "",
    currentMeds: "",
    pastMeds: "",
    chronicDiseases: "",
    injuries: "",
    surgeries: "",
    smoking: "",
    alcohol: "",
    activityLevel: "",
    foodPreference: "",
    occupation: ""
};

/* ================= TopNav Component ================= */

interface TopNavProps {
    userName?: string;
    completionPercent?: number;
}

const TopNav: React.FC<TopNavProps> = ({ userName, completionPercent = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path ? " active" : "";

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isSidebarOpen]);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Find Doctors", path: "/find-doctors" },
    { label: "Video Consult", path: "/video-consult" },
    { label: "Lab Tests", path: "/lab-tests" },
    { label: "Surgeries", path: "/surgeries" },
  ];

  return (
    <>
      <header className="rmd-topbar">
        <div className="rmd-topbar-inner">
          <div className="rmd-logo-group">
            <button 
              className="rmd-hamburger"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} color="#334155" />
            </button>
            <img 
              src={LOGO_URL} 
              alt="Reach My Doctor" 
              className="rmd-logo" 
              onClick={() => navigate("/")} 
              style={{ cursor: "pointer" }}
            />
          </div>

          <nav className="rmd-nav" aria-label="Main navigation">
            <div className="rmd-nav-group">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  type="button"
                  className={`rmd-nav-item${isActive(item.path)}`}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} userName={userName} completionPercent={completionPercent} />
    </>
  );
};

/* ================= App (signup -> otp -> home) ================= */
const App: React.FC = () => {
  const [step, setStep] = useState<"signup" | "otp" | "home">("signup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);

  // Load initial state from localStorage if available
  const [profileData, setProfileData] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('RMD_PROFILE_DATA');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE_DATA;
  });

  // Persist profileData changes
  useEffect(() => {
    localStorage.setItem('RMD_PROFILE_DATA', JSON.stringify(profileData));
  }, [profileData]);

  // Calculate completion percentage
  const calculateCompletion = (data: ProfileData) => {
    const totalFields = Object.keys(data).length;
    const filledFields = Object.values(data).filter(val => val.trim() !== "").length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercent = calculateCompletion(profileData);

  const updateProfileField = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    const fake = "1234";
    setGeneratedOtp(fake);
    setStep("otp");
    alert(`Demo OTP is ${fake} (testing only)`);
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) setStep("home");
    else alert("Incorrect OTP. Use 1234 for demo.");
  };

  if (step !== "home") {
    return (
      <div 
        className="auth-page-wrapper"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url('${BG_IMAGE_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#f8fafc' // Fallback color
        }}
      >
        {/* Dark overlay for better text contrast */}
        <div className="auth-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)'
        }} />
        
        <div className="auth-wrapper" style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '380px',
          animation: 'slideUp 0.4s ease-out'
        }}>
          <div className="auth-card" style={{
            background: 'white',
            borderRadius: '20px',
            padding: '32px 28px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            {/* Logo Section */}
            <div className="auth-logo-row" style={{ 
              textAlign: 'center', 
              marginBottom: '24px'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
              }}>
                <span style={{ fontSize: '28px', color: 'white' }}>👨‍⚕️</span>
              </div>
              <img 
                src={LOGO_URL} 
                alt="Reach My Doctor" 
                style={{ 
                  height: '42px', 
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }} 
              />
            </div>

            {step === "signup" && (
              <>
                {/* Welcome Section */}
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '24px' 
                }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f0f9ff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    marginBottom: '12px'
                  }}>
                    <span style={{ 
                      fontSize: '20px', 
                      fontWeight: 700, 
                      color: '#1e40af'
                    }}>Hi</span>
                    <span role="img" aria-label="wave" style={{ 
                      fontSize: '20px'
                    }}>👋</span>
                  </div>
                  
                  <p style={{ 
                    color: '#4b5563', 
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    Welcome to ReachMyDoctor. Sign up to continue.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSendOtp} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px' 
                }}>
                  {/* Name Input */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      color: '#374151', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter your full name" 
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.3s',
                          backgroundColor: 'white',
                          color: '#111827'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile Input */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      color: '#374151', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      Mobile Number
                    </label>
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px' 
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 14px',
                        background: '#f8fafc',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        color: '#374151',
                        fontWeight: 500,
                        fontSize: '15px',
                        minWidth: '70px'
                      }}>
                        +91
                      </div>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        maxLength={10} 
                        placeholder="10-digit mobile number" 
                        style={{
                          flex: 1,
                          padding: '14px 16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '15px',
                          transition: 'all 0.3s',
                          backgroundColor: 'white',
                          color: '#111827'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#3b82f6';
                          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      width: '100%',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                      marginTop: '8px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
                    }}
                  >
                    Send OTP
                  </button>
                </form>

                {/* Footer Note */}
                <div style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '12px',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    By continuing, you agree to our{' '}
                    <span style={{ color: '#3b82f6', fontWeight: 500 }}>Terms & Privacy Policy</span>
                  </p>
                </div>
              </>
            )}

            {step === "otp" && (
              <>
                {/* OTP Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)'
                  }}>
                    <span style={{ fontSize: '28px', color: 'white' }}>🔒</span>
                  </div>
                  
                  <h2 style={{ 
                    fontSize: '22px', 
                    color: '#111827', 
                    marginBottom: '8px',
                    fontWeight: 700
                  }}>Verify OTP</h2>
                  
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '14px',
                    margin: 0,
                    lineHeight: '1.5'
                  }}>
                    OTP sent to <b style={{ color: '#1e40af' }}>+91 {phone}</b>
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleVerifyOtp} style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '20px' 
                }}>
                  {/* OTP Input */}
                  <div>
                    <label style={{ 
                      display: 'block',
                      color: '#374151', 
                      fontSize: '14px', 
                      fontWeight: 600,
                      marginBottom: '8px'
                    }}>
                      Enter OTP
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type="tel" 
                        value={otp} 
                        onChange={(e) => setOtp(e.target.value)} 
                        maxLength={4} 
                        placeholder="1234" 
                        style={{
                          width: '100%',
                          padding: '16px',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '20px',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          backgroundColor: 'white',
                          color: '#111827',
                          textAlign: 'center',
                          letterSpacing: '8px'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#10b981';
                          e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    <p style={{
                      marginTop: '8px',
                      color: '#6b7280',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}>
                      Demo OTP: <b style={{ color: '#10b981' }}>1234</b>
                    </p>
                  </div>

                  {/* Verify Button */}
                  <button 
                    type="submit" 
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      width: '100%',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                    }}
                  >
                    Verify & Continue
                  </button>

                  {/* Back Link */}
                  <button 
                    type="button" 
                    onClick={() => setStep("signup")}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6b7280',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '8px',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#6b7280';
                    }}
                  >
                    <span>←</span>
                    Back to sign up
                  </button>
                </form>

                {/* Resend OTP */}
                <div style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <button 
                    type="button"
                    onClick={() => alert('OTP resent! Use 1234 for demo.')}
                    style={{
                      background: 'none',
                      border: '1px solid #d1d5db',
                      color: '#3b82f6',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#3b82f6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                  >
                    Resend OTP
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* Animation Styles */}
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return <MainHome name={name} profileData={profileData} updateProfileField={updateProfileField} completionPercent={completionPercent} />;
};

export default App;



/* ================= Dashboard Content ================= */
const DashboardHome: React.FC<{ name: string; profileData: ProfileData; completionPercent: number }> = ({ name, profileData, completionPercent }) => {
  const navigate = useNavigate();
  const [city, setCity] = useState("Bangalore");

  const [query, setQuery] = useState("");
  const [activeArticle] = useState<ArticleCard | null>(null);
  const [showAllArticles] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filteredDoctors, setFilteredDoctors] = useState<DoctorResult[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const popularSpecialties = [
    "Dentist", "Gynecologist/Obstetrician", "General Physician", "Dermatologist", 
    "Ear-nose-throat (ENT) Specialist", "Homoeopath", "Ayurveda"
  ];

  const cityLocalities: Record<string, string[]> = {
    Bangalore: ["Uttarahalli", "BTM Layout", "HSR Layout"],
    Hyderabad: ["Madhapur", "Gachibowli", "Kondapur"],
    Chennai: ["Anna Nagar", "T Nagar", "Velachery"],
  };

  const clinics: ClinicInfo[] = [
    { id: 1, city: "Bangalore", locality: "Uttarahalli", name: "Srushti Women & Child Clinic", status: "Closed" },
    { id: 2, city: "Bangalore", locality: "Uttarahalli", name: "Amrutha Orthopaedic Care", status: "Unknown" },
    { id: 3, city: "Bangalore", locality: "Uttarahalli", name: "Dr Bhaskar's Clinic", status: "Open" },
    { id: 4, city: "Hyderabad", locality: "Madhapur", name: "Rainbow Children's Clinic", status: "Open" },
    { id: 5, city: "Hyderabad", locality: "Madhapur", name: "Sunshine Ortho Clinic", status: "Unknown" },
    { id: 6, city: "Chennai", locality: "Anna Nagar", name: "Apollo Clinic Anna Nagar", status: "Open" },
    { id: 7, city: "Chennai", locality: "Anna Nagar", name: "Smile Dental Care", status: "Closed" },
    { id: 8, city: "Hyderabad", locality: "Ramanathpuram", name: "Sri Vedha multi speciality hospital", status: "Open" },
  ];

  void cityLocalities;
  void clinics;

  useEffect(() => {
    const hasModal = !!activeArticle || showAllArticles || mapOpen;
    document.body.style.overflow = hasModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeArticle, showAllArticles, mapOpen]);
  

  const handleHomeCardClick = (cardId: HomeCard["id"]) => {
    if (cardId === "video") navigate("/video-consult");
    else if (cardId === "find") navigate("/find-doctors");
    else if (cardId === "lab") navigate("/lab-tests");
    else if (cardId === "surgery") navigate("/surgeries");
  };

  const handleSearch = () => {
    const q = query.trim().toLowerCase();
    const results = allDoctors.filter((d) => {
      if (d.city !== city) return false;
      if (!q) return true;
      return d.name.toLowerCase().includes(q) || d.clinic.toLowerCase().includes(q) || d.speciality.toLowerCase().includes(q);
    });
    setFilteredDoctors(results);
    setShowResults(true);
    setTimeout(() => document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleSearchSubmit = (e: FormEvent) => { e.preventDefault(); handleSearch(); };

  /* Default Home UI */
  return (
    <div className="rmd-page">
      <TopNav userName={name || profileData.userName} completionPercent={completionPercent} />

      {/* HERO */}
      <section className="rmd-hero" style={{ backgroundImage: `url('${BG_IMAGE_URL}')` }}>
        <div className="rmd-hero-overlay" />
        <div className="rmd-hero-inner">
          <div className="rmd-hero-text">
            <p className="rmd-hero-hi">Hi {name.trim() ? name : "there"},</p>
            <h1 className="rmd-hero-title">Find and consult doctors anytime, anywhere</h1>
            <p className="rmd-hero-sub">Book appointments, consult online, and access trusted health services in one place.</p>
          </div>

          <form className="rmd-search-panel" onSubmit={handleSearchSubmit}>
            <div className="rmd-input rmd-location">
              <span className="rmd-input-icon">📍</span>
              <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="Select city">
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            <div className="rmd-input rmd-query">
              <span className="rmd-input-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search doctors, clinics, hospitals, etc." 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              />
            </div>

            {isSearchFocused && !query && (
              <div className="rmd-search-dropdown">
                 {popularSpecialties.map((spec) => (
                   <div 
                     key={spec} 
                     className="search-suggestion-item"
                     onClick={() => {
                       setQuery(spec);
                       handleSearch(); // Trigger search? Or just fill? Let's just fill for now or trigger manually via effect if desired.
                     }}
                   >
                     <div className="suggestion-left">
                       <span className="suggestion-icon">🔍</span>
                       <span>{spec}</span>
                     </div>
                     <span className="suggestion-tag">SPECIALITY</span>
                   </div>
                 ))}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* MAIN */}
      <main className="rmd-main">
        {/* BIG 4 HOME CARDS */}
        <section className="rmd-section">
          <div className="rmd-hero-cards-row">
            {homeCards.map((card) => (
              <article key={card.id} className="rmd-hero-card" onClick={() => handleHomeCardClick(card.id)} style={{ cursor: "pointer" }}>
                <div className="rmd-hero-card-img" style={{ backgroundColor: card.bgColor }}>
                  <img src={card.image} alt={card.title} />
                </div>
                <div className="rmd-hero-card-content">
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SEARCH RESULTS */}
        {showResults && (
          <section className="rmd-section" id="search-results">
            <h2>Doctors & clinics in {city}</h2>
            <p className="rmd-section-sub">Showing results for: {query.trim() || "All specialties"}</p>
            {filteredDoctors.length === 0 ? (
              <p>No matching doctors found. Try a different keyword.</p>
            ) : (
              <div className="rmd-results-grid">
                {filteredDoctors.map((d) => (
                  <article className="rmd-result-card" key={`${d.name}-${d.clinic}`}>
                    <h3 className="rmd-result-name">{d.name}</h3>
                    <p className="rmd-result-speciality">{d.speciality}</p>
                    <p className="rmd-result-clinic">{d.clinic}</p>
                    <p className="rmd-result-city">{d.city}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* GUARANTEE SECTION */}
      <section className="rmd-guarantee-section">
        <div className="rmd-guarantee-content">
          <h2>Instant appointment with doctors. <strong>Guaranteed.</strong></h2>
          <div className="rmd-guarantee-features">
            <div className="rmd-feature-item">
               <span className="rmd-check-icon">✓</span>
               <span>100,000 Verified doctors</span>
            </div>
            <div className="rmd-feature-item">
               <span className="rmd-check-icon">✓</span>
               <span>3M+ Patient recommendations</span>
            </div>
             <div className="rmd-feature-item">
               <span className="rmd-check-icon">✓</span>
               <span>25M Patients/year</span>
            </div>
          </div>
          <button className="btn-primary" onClick={() => navigate('/find-doctors')}>Find me the right doctor</button>
        </div>
        <div className="rmd-guarantee-image">
           {/* Mock phone image */}
             <div className="phone-mockup">
                <div className="phone-screen">
                    <img src="/images/home_doctor.png" alt="Doctor Profile" />
                </div>
             </div>
        </div>
      </section>

      {/* ARTICLES SECTION */}
      <section className="rmd-section rmd-articles-section">
        <div className="rmd-section-header">
            <h2>Read top articles from health experts</h2>
            <button className="btn-link">More articles</button>
        </div>
        <div className="rmd-articles-grid">
            <article className="rmd-article-card">
                <img src="https://images.pexels.com/photos/3760269/pexels-photo-3760269.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Health" />
                <div className="rmd-article-content">
                    <h3>Ors Day-Spread the Message</h3>
                    <p className="rmd-article-author">Ms. Swati Kapoor, Dietitian/Nutritionist</p>
                    <div className="rmd-article-stats">
                        <span>1007 Likes</span> • <span>4961 Views</span>
                    </div>
                </div>
            </article>
             <article className="rmd-article-card">
                <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Diet" />
                <div className="rmd-article-content">
                    <h3>Busting Top 10 Dieting Myths</h3>
                    <p className="rmd-article-author">Ms. Farzana Chauhan, Dietitian/Nutritionist</p>
                    <div className="rmd-article-stats">
                        <span>677 Likes</span> • <span>64599 Views</span>
                    </div>
                </div>
            </article>
             <article className="rmd-article-card">
                <img src="https://images.pexels.com/photos/3779760/pexels-photo-3779760.jpeg?auto=compress&cs=tinysrgb&w=300" alt="Pain" />
                <div className="rmd-article-content">
                    <h3>Is Your Jaw Pain Causing Discomfort?</h3>
                    <p className="rmd-article-author">Dr. Yogesh Rao, Dentist</p>
                    <div className="rmd-article-stats">
                        <span>636 Likes</span> • <span>11821 Views</span>
                    </div>
                </div>
            </article>
        </div>
      </section>

      {/* MEDICINES SECTION */}
      <section className="rmd-section rmd-medicines-section">
          <div className="rmd-medicines-content">
              <h2>Get all your medicines. <br/><strong>Everytime. On time.</strong></h2>
               <div className="rmd-medicines-illustration">
                   {/* Abstract pill shapes or image */}
                   <span className="pill-shape pill-1">💊</span>
                   <span className="pill-shape pill-2">🧴</span>
               </div>
               <button className="btn-primary" style={{marginTop: '20px'}}>Order Medicines</button>
          </div>
      </section>



      {/* MAP MODAL */}
      {mapOpen && (
        <div className="rmd-modal-backdrop" onClick={() => setMapOpen(false)}>
          <div className="rmd-map-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="rmd-map-title">{city} map</h3>
            <iframe className="rmd-map-iframe" title={`${city} map`} src={`https://www.google.com/maps?q=${encodeURIComponent(city)}&output=embed`} loading="lazy" />
            <button className="btn-primary rmd-modal-close" onClick={() => setMapOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= MAIN HOME ROUTER CONTAINER ================= */
const MainHome: React.FC<MainHomeProps> = ({ name, profileData, updateProfileField, completionPercent }) => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome name={name} profileData={profileData} completionPercent={completionPercent} />} />
      <Route path="/video-consult" element={<VideoConsultPage />} />
      <Route path="/surgeries" element={<SurgeriesPage />} />
      <Route path="/find-doctors" element={<FindDoctorsPage />} />
      <Route path="/lab-tests" element={<LabTestsPage />} />
      <Route path="/profile" element={<ProfilePage data={profileData} onUpdate={updateProfileField} completion={completionPercent} />} />
      <Route path="/profile/upload-photo" element={<PhotoUploadPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/consultations" element={<ConsultationsPage />} />
    </Routes>
  );
};



/* ===== Static data ===== */
const homeCards: HomeCard[] = [
  {
    id: "video",
    title: "Instant Video Consultation",
    subtitle: "Connect within 60 secs",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_instant_video_consulation.png",
    bgColor: "#AFCFED",
  },
  {
    id: "find",
    title: "Find Doctors Near You",
    subtitle: "Confirmed appointments",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png",
    bgColor: "#98E1C6",
  },
  {
    id: "lab",
    title: "Lab Tests",
    subtitle: "Sample pickup at your home",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_lab_tests.png",
    bgColor: "#AFCFED",
  },
  {
    id: "surgery",
    title: "Surgeries",
    subtitle: "Safe and trusted surgery centers",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_surgeries.png",
    bgColor: "#D4E0E8",
  },
];

const allDoctors: DoctorResult[] = [
  { name: "Dr. Asha Kumar", speciality: "Dermatologist", clinic: "Glow Skin Clinic", city: "Bangalore" },
  { name: "Dr. Rahul Menon", speciality: "Pediatrician", clinic: "Happy Kids Clinic", city: "Bangalore" },
  { name: "Dr. Priya Iyer", speciality: "Gynecologist", clinic: "Women Care Center", city: "Chennai" },
  { name: "Dr. Rohan Desai", speciality: "Dentist", clinic: "Bright Smiles Dental", city: "Mumbai" },
  { name: "Dr. Nisha Reddy", speciality: "General Physician", clinic: "City Health Clinic", city: "Hyderabad" },
  { name: "Dr. Siddalingaswamy", speciality: "Urologist", clinic: "Sri Vedha multi speciality hospital", city: "Hyderabad" },
];
