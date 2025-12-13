import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Filter, ChevronDown, ChevronUp, Stethoscope, Building2, Building, Pill, Smile, Leaf, Activity } from 'lucide-react';
import './AdvancedSearchBar.css';

interface AdvancedSearchBarProps {
  locations: string[];
  areas?: string[];
  types?: string[];
  onSearch: (filters: { specialty: string; city: string; area: string; type: string }) => void;
  initialFilters?: { specialty: string; city: string; area: string; type: string };
}

// Interfaces for Category Data
interface SubCategory {
    id: string;
    label: string;
    icon: React.ReactNode | string; // ReactNode or string char
    color: string;
}

interface Category {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    subCategories: SubCategory[];
}

// Mock Data for Categories matching the screenshot
const SEARCH_CATEGORIES: Category[] = [
  { 
    id: 'doctor', 
    label: 'Doctor', 
    icon: <Stethoscope size={18} />,
    color: '#007bff', // Blue
    subCategories: [
      { id: 'General Physician', label: 'General Physician', icon: 'G', color: '#6c757d' },
      { id: 'Pediatrician', label: 'Pediatrician', icon: 'P', color: '#e83e8c' },
      { id: 'Dermatologist', label: 'Dermatologist', icon: 'D', color: '#fd7e14' },
      { id: 'ENT Specialist', label: 'ENT Specialist', icon: 'E', color: '#007bff' },
      { id: 'Gynecologist/Obstetrician', label: 'Gynecologist/Obstetrician', icon: 'G', color: '#28a745' },
      { id: 'Physiotherapist', label: 'Physiotherapist', icon: 'P', color: '#20c997' },
      { id: 'Urologist', label: 'Urologist', icon: 'U', color: '#007bff' },
      { id: 'Cardiologist', label: 'Cardiologist', icon: 'C', color: '#dc3545' }
    ]
  },
  { id: 'clinic', label: 'Clinic', icon: <Building2 size={18} />, color: '#17a2b8', subCategories: [] },
  { id: 'dentist', label: 'Dentist', icon: <Smile size={18} />, color: '#007bff', subCategories: [] },
  { id: 'diagnostics', label: 'Diagnostics', icon: <Activity size={18} />, color: '#17a2b8', subCategories: [] }, 
  { id: 'hospital', label: 'Hospital', icon: <Building size={18} />, color: '#dc3545', subCategories: [] },
  { id: 'pharmacy', label: 'Pharmacy', icon: <Pill size={18} />, color: '#28a745', subCategories: [] },
  { id: 'homeopathy', label: 'Homeopathy', icon: <Leaf size={18} />, color: '#20c997', subCategories: [] }
];

const LOGO_URL = "/images/consult/logo.png";

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({  
  locations, 
  areas = ['Uttarahalli', 'Jayanagar', 'Indiranagar', 'Koramangala', 'Whitefield'], 
  onSearch,
  initialFilters 
}) => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState(initialFilters?.specialty || '');
  const [city, setCity] = useState(initialFilters?.city || locations[0] || 'Bangalore');
  const [area, setArea] = useState(initialFilters?.area || '');
  const [type, setType] = useState(initialFilters?.type || ''); 
  
  // existing state code...
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('doctor'); 

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch({ specialty, city, area, type });
  }, [specialty, city, area, type, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSpecialtyClick = () => {
    const newSpec = prompt("Enter Specialty (e.g., Dentist, Cardiologist):", specialty);
    if (newSpec !== null) setSpecialty(newSpec);
  };

  const handleCategorySelect = (categoryLabel: string, isSubItem = false) => {
    setType(categoryLabel);
    if (isSubItem) {
        setSpecialty(categoryLabel);
    } else {
        setSpecialty(""); 
    }
    setIsDropdownOpen(false);
  };
  
  const toggleCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategory(expandedCategory === catId ? null : catId);
  };

  return (
    <div className="rmd-advanced-search">
      {/* Logo */}
      <img 
        src={LOGO_URL} 
        alt="Reach My Doctor" 
        className="rmd-search-logo" 
        onClick={() => navigate("/")}
      />
      
      {/* Orange Button - "Search by Speciality" */}
      <button className="rmd-search-speciality" onClick={handleSpecialtyClick}>
        {specialty || "Search by Speciality"}
      </button>

      {/* City Dropdown */}
      <div className="rmd-search-field-container">
        <MapPin size={16} className="rmd-input-icon" />
        <select value={city} onChange={(e) => setCity(e.target.value)} aria-label="City">
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Area Dropdown */}
      <div className="rmd-search-field-container">
        <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Area">
          <option value="">All Areas</option>
          {areas.map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Custom Category / Type Dropdown */}
      <div className="rmd-search-field-container rmd-category-dropdown-container" ref={dropdownRef}>
        <div 
            className="rmd-category-input" 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
            <span className="rmd-selected-value">{type || "Filter by Category"}</span>
            <Filter size={16} className="rmd-filter-icon" />
        </div>

        {isDropdownOpen && (
            <div className="rmd-custom-dropdown-menu">
                {SEARCH_CATEGORIES.map(cat => (
                    <div key={cat.id} className="rmd-dropdown-group">
                        <div 
                            className="rmd-dropdown-item" 
                            onClick={() => !cat.subCategories.length && handleCategorySelect(cat.label)}
                        >
                            <span className="rmd-cat-icon" style={{color: cat.color}}>{cat.icon}</span>
                            <span className="rmd-cat-label">{cat.label}</span>
                            {cat.subCategories.length > 0 && (
                                <span className="rmd-accordion-toggle" onClick={(e) => toggleCategory(cat.id, e)}>
                                    {expandedCategory === cat.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                </span>
                            )}
                        </div>
                        
                        {/* Sub Categories Accordion */}
                        {cat.subCategories.length > 0 && expandedCategory === cat.id && (
                            <div className="rmd-dropdown-subitems">
                                {cat.subCategories.map(sub => (
                                    <div 
                                        key={sub.id} 
                                        className="rmd-dropdown-subitem"
                                        onClick={() => handleCategorySelect(sub.label, true)}
                                    >
                                        <span className="rmd-sub-icon-circle" style={{backgroundColor: sub.color}}>
                                            {typeof sub.icon === 'string' ? sub.icon : sub.icon}
                                        </span>
                                        <span className="rmd-sub-label">{sub.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Search Button */}
      <button className="rmd-search-btn-icon" onClick={() => onSearch({ specialty, city, area, type })}>
        <Search size={20} />
      </button>
    </div>
  );
};

export default AdvancedSearchBar;
