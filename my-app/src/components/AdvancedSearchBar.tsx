import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import './AdvancedSearchBar.css';

interface AdvancedSearchBarProps {
  locations: string[];
  areas?: string[];
  types?: string[];
  onSearch: (filters: { specialty: string; city: string; area: string; type: string }) => void;
  onAreaInputChange?: (query: string) => void;
  initialFilters?: { specialty: string; city: string; area: string; type: string };
}

import { SEARCH_CATEGORIES } from '../data/mockData';

const LOGO_URL = "/images/consult/logo.png";

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({  
  locations, 
  areas = [], 
  onSearch,
  onAreaInputChange,
  initialFilters 
}) => {
  const navigate = useNavigate();
  const [specialty, setSpecialty] = useState(initialFilters?.specialty || '');
  const [city, setCity] = useState(initialFilters?.city || locations[0] || 'Bangalore');
  const [area, setArea] = useState(initialFilters?.area || '');
  const [type, setType] = useState(initialFilters?.type || ''); 
  
  // existing state code...
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>('doctor'); 

  const dropdownRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onSearch({ specialty, city, area, type });
  }, [specialty, city, area, type, onSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (areaRef.current && !areaRef.current.contains(event.target as Node)) {
        setShowAreaDropdown(false);
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

      {/* Area Search Input with Custom Autocomplete */}
      <div className="rmd-search-field-container" style={{position: 'relative'}} ref={areaRef}>
        <MapPin size={16} className="rmd-input-icon" />
        <input 
            type="text" 
            value={area} 
            onChange={(e) => {
                const val = e.target.value;
                setArea(val);
                setShowAreaDropdown(true); // Open on type
                if (onAreaInputChange) onAreaInputChange(val);
            }} 
            placeholder="All Areas"
            aria-label="Area"
            className="rmd-search-input"
            onFocus={() => {
                setShowAreaDropdown(true); // Open on focus
                if (onAreaInputChange && areas.length === 0) onAreaInputChange("");
            }}
        />
        {/* Custom Dropdown for Areas */}
        {showAreaDropdown && areas && areas.length > 0 && (
            <div className="rmd-custom-dropdown-menu" style={{
                maxHeight: '300px',
                overflowY: 'auto',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000
            }}>
                {areas.map((a, index) => (
                    <div 
                        key={`${a}-${index}`} 
                        className="rmd-dropdown-item"
                        onClick={() => {
                            console.log("Area Selected:", a); // DEBUG LOG
                            setArea(a);
                            setShowAreaDropdown(false); // Close on select
                            // Trigger search immediately on selection
                            onSearch({ specialty, city, area: a, type });
                        }}
                        style={{padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #eee'}}
                    >
                        {a}
                    </div>
                ))}
            </div>
        )}
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
