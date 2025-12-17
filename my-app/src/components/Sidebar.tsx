import React, { FC } from "react";
import { 
  X, 
  Calendar, 
  FlaskConical, 
  Pill, 
  MessageSquare, 
  Stethoscope, 
  FileText, 
  Shield, 
  Clock, 
  CreditCard, 
  User, 
  ArrowRight, 
  Heart 
} from "lucide-react";
import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  completionPercent?: number;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose, userName, completionPercent = 0 }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose(); // Close sidebar on selection
  };
  
  // Navigation Items (Rich Icons) - Matches uploaded screenshots
  const menuItems = [
    { icon: <div className="icon-box blue"><FileText size={20} /></div>, label: "ABHA", path: "/abha" },
    { icon: <div className="icon-box blue"><Calendar size={20} /></div>, label: "Appointments", path: "/appointments" },
    { icon: <div className="icon-box blue"><FlaskConical size={20} /></div>, label: "Test Bookings", path: "/lab-tests" },
    { icon: <div className="icon-box blue"><Pill size={20} /></div>, label: "Orders", path: "/orders" },
    { icon: <div className="icon-box blue"><MessageSquare size={20} /></div>, label: "Consultations", path: "/consultations" },
    { icon: <div className="icon-box blue"><Stethoscope size={20} /></div>, label: "My Doctors", path: "/find-doctors" },
    { icon: <div className="icon-box blue"><FileText size={20} /></div>, label: "Medical Records", path: "/medical-records" },
    { icon: <div className="icon-box blue"><Shield size={20} /></div>, label: "My Insurance Policy", path: "/insurance" },
    { icon: <div className="icon-box blue"><Clock size={20} /></div>, label: "Reminders", path: "/reminders" },
    { icon: <div className="icon-box blue"><CreditCard size={20} /></div>, label: "Payments & HealthCash", path: "/payments" },
  ];

  const secondaryItems = [
    { label: "Read about health", path: "/health-feed" },
    { label: "Help Center", path: "/help" },
    { label: "Settings", path: "/settings" },
    { label: "Like us? Give us 5 stars", path: "/rate-us" }, 
    { label: "Are you a doctor?", path: "/for-doctors" },
  ];

  return (
    <>
      {/* Overlay - click to close */}
      <div 
        className={`rmd-sidebar-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />
      
      <div className={`rmd-sidebar-drawer ${isOpen ? 'open' : ''}`}>
        
        {/* ================= CONTENT (Rich Design for ALL Screens) ================= */}
        <div className="rmd-sidebar-content">
          <div className="rmd-sidebar-header">
            <div className="rmd-user-profile">
              <div className="rmd-avatar">
                <User size={24} color="#fff" />
              </div>
              <div className="rmd-user-info">
                <h3>{userName || "Guest"}</h3>
                <span className="view-profile-link" onClick={() => handleNavigation('/profile')}>View and edit profile</span>
                <span className="rmd-profile-status">{completionPercent}% completed</span>
              </div>
              <button className="rmd-header-arrow" onClick={() => handleNavigation('/profile')}>
                <ArrowRight size={20} color="#787887" />
              </button>
            </div>
          </div>

          <div className="rmd-care-plan-banner" onClick={() => handleNavigation('/care-plan')}>
            <div className="rmd-cp-icon">
              <Heart size={16} fill="#B4975A" color="#B4975A" />
            </div>
            <div className="rmd-cp-text">
              <span className="rmd-cp-title">Care Plan</span>
              <span className="rmd-cp-sub">12 FREE Appointments for a Year</span>
            </div>
            <ArrowRight size={16} color="#B4975A" />
          </div>

          <div className="rmd-sidebar-menu">
            {menuItems.map((item, index) => (
              <MenuItem 
                key={index}
                icon={item.icon}
                label={item.label}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>

          <div className="rmd-sidebar-footer-menu">
            {secondaryItems.map((item, index) => (
              <div key={index} className="rmd-sec-item" onClick={() => handleNavigation(item.path)}>
                {item.label === "Like us? Give us 5 stars" ? (
                   <span className="rmd-sec-label">Like us? Give us <span style={{color: "#fbbf24"}}>5 stars</span></span>
                ) : (
                   <span className="rmd-sec-label">{item.label}</span>
                )}
               
                <span className="rmd-sec-arrow">›</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

// Helper Component for Menu Items
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const MenuItem: FC<MenuItemProps> = ({ icon, label, onClick }) => {
  return (
    <div className="rmd-menu-item" onClick={onClick}>
      <div className="rmd-menu-icon">{icon}</div>
      <span className="rmd-menu-label">{label}</span>
      <span className="rmd-menu-arrow">›</span>
    </div>
  );
};

export default Sidebar;
