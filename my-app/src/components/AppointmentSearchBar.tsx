
import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import './AppointmentSearchBar.css';

interface AppointmentSearchBarProps {
  onSearch: (term: string, specialty?: string) => void;
  selectedSpecialty: string | null;
  onSpecialtyClick: () => void; // Or handle internally if passing list
  // For now, let's keep it simple to match the visual first
}

const AppointmentSearchBar: React.FC<AppointmentSearchBarProps> = ({ 
    onSearch, 
    selectedSpecialty,
    onSpecialtyClick 
}) => {
  const [term, setTerm] = useState("");

  return (
    <div className="app-search-bar-container">
        {/* Left: Orange Specialty Button */}
        <button className="app-search-specialty-btn" onClick={onSpecialtyClick}>
            <span>{selectedSpecialty || "Search by Specialty"}</span>
            <ChevronDown size={18} className="app-search-arrow" />
        </button>

        {/* Middle: Icon */}
        <div className="app-search-icon-wrapper">
             <Search size={20} color="#9ca3af" />
        </div>

        {/* Right: Input */}
        <input 
            type="text" 
            className="app-search-input"
            placeholder="Search doctors, clinics, hospitals, etc."
            value={term}
            onChange={(e) => {
                setTerm(e.target.value);
                onSearch(e.target.value);
            }}
        />
    </div>
  );
};

export default AppointmentSearchBar;
