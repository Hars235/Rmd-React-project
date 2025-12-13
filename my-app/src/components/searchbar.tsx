import React, { useCallback, useEffect, useRef, useState } from "react";
import { Search, MapPin, X, Loader } from "lucide-react";

// Constants
const DOCTOR_CATEGORIES = [
  "General Physician",
  "Dentist",
  "Cardiologist",
  "Dermatologist",
  "Pediatrician",
  "Orthopedic",
  "Gynecologist",
  "Neurologist",
  "Psychiatrist",
  "ENT Specialist",
  "Ophthalmologist",
  "Urologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Pulmonologist",
  "Rheumatologist",
  "Nephrologist",
];

const POPULAR_CATEGORIES = ["General Physician", "Dentist", "Cardiologist", "Dermatologist", "Pediatrician"];

interface SearchBarProps {
  compact?: boolean;
  showLabels?: boolean;
  onSearch?: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  compact = false,
  showLabels = false,
  onSearch = () => { },
  initialQuery = "",
  initialLocation = ""
}) => {
  // State declarations
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update state when props change
  useEffect(() => {
    setSearchQuery(initialQuery);
    setLocation(initialLocation);
  }, [initialQuery, initialLocation]);

  // Filter categories based on search query
  const filterCategories = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setFilteredCategories([]);
      return [];
    }

    const filtered = DOCTOR_CATEGORIES.filter((category) =>
      category.toLowerCase().includes(trimmed.toLowerCase())
    );
    setFilteredCategories(filtered);
    return filtered;
  }, []);

  // Update filtered categories when search query changes
  useEffect(() => {
    filterCategories(searchQuery);
  }, [searchQuery, filterCategories]);

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        searchInputRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  // Handle search submission
  const handleSearch = useCallback(() => {
    const trimmedQuery = searchQuery.trim();
    const trimmedLocation = location.trim();

    if (!trimmedQuery) {
      searchInputRef.current?.focus();
      return;
    }

    onSearch(trimmedQuery, trimmedLocation);
    setShowSuggestions(false);
  }, [searchQuery, location, onSearch]);

  // Handle Enter key press
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  // Handle category selection from suggestions
  const handleCategorySelect = useCallback((category: string) => {
    setSearchQuery(category);
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  // Handle search input change
  const handleSearchInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      const filtered = filterCategories(value);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [filterCategories]);

  // Handle location input change
  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  }, []);

  // Handle search input focus
  const handleSearchInputFocus = useCallback(() => {
    if (searchQuery.trim() && filteredCategories.length > 0) {
      setShowSuggestions(true);
    }
  }, [searchQuery, filteredCategories]);

  // Handle search input blur
  const handleSearchInputBlur = useCallback(() => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
    blurTimeoutRef.current = setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  }, []);

  // Get current location using geolocation API
  const handleGetCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. Please enter location manually.");
      return;
    }

    setIsLoadingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        if (response.ok) {
          const data = await response.json();
          const city = data.address?.city || data.address?.town ||
            data.address?.village || data.address?.county;
          const state = data.address?.state;

          if (city && state) {
            setLocation(`${city}, ${state}`);
          } else {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          }
        } else {
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
        setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.error("Geolocation error:", error);
      alert("Unable to get current location. Please enter manually.");
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // Clear search input
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, []);

  // Clear location input
  const handleClearLocation = useCallback(() => {
    setLocation("");
  }, []);

  // Constants are already stable, no need to memoize
  const popularCategories = POPULAR_CATEGORIES;

  return (
    <div className= "w-full max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-sm" >
    <div className="space-y-4" >
      {/* Search Input Section */ }
  {
    showLabels && (
      <label htmlFor="doctor-search" className = "block text-sm font-semibold text-gray-800" >
        Search for Doctors
          </label>
        )}

  <div className="relative" >
    <div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:bg-white transition-colors duration-200" >
      <Search size={ 20 } className = "text-gray-500 flex-shrink-0" />
        <input
              ref={ searchInputRef }
  id = "doctor-search"
  type = "text"
  placeholder = "Search doctors, clinics, hospitals..."
  value = { searchQuery }
  onChange = { handleSearchInputChange }
  onFocus = { handleSearchInputFocus }
  onBlur = { handleSearchInputBlur }
  onKeyPress = { handleKeyPress }
  className = "flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder-gray-500"
  aria-label="Search for doctors"
  autoComplete = "off"
    />

    { searchQuery && (
      <button
                type="button"
  onClick = { handleClearSearch }
  className = "p-1 hover:bg-gray-200 rounded transition-colors duration-200"
  aria-label="Clear search"
    >
    <X size={ 18 } className = "text-gray-600" />
      </button>
            )}
</div>

{/* Suggestions Dropdown */ }
{
  showSuggestions && (
    <div
              ref={ suggestionsRef }
  className = "absolute top-full left-0 right-0 mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
  role = "listbox"
    >
    <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center" >
      <span className="text-xs font-bold text-gray-600 uppercase" > Specialties </span>
        < button
  type = "button"
  onClick = {() => setShowSuggestions(false)
}
className = "text-gray-500 hover:text-gray-700 transition-colors"
aria-label="Close suggestions"
  >
  <X size={ 16 } />
    </button>
    </div>

{
  filteredCategories.length > 0 ? (
    filteredCategories.map((category) => (
      <button
                    key= { category }
                    type = "button"
                    onClick = {() => handleCategorySelect(category)}
className = "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
role = "option"
  >
  { category }
  </button>
                ))
              ) : searchQuery.trim() ? (
  <div className= "px-4 py-3 text-center text-sm text-gray-500" >
  No specialties found for "{searchQuery}"
    </div>
              ) : (
    <>
    <div className= "px-4 py-2 bg-gray-50 text-xs font-bold text-gray-600 uppercase border-b border-gray-200" >
    Popular
    </div>
{
  popularCategories.map((category) => (
    <button
                      key= {`popular-${category}`}
type = "button"
onClick = {() => handleCategorySelect(category)}
className = "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
  >
  { category }
  </button>
                  ))}
</>
              )}
</div>
          )}
</div>

{/* Location Input Section */ }
{
  showLabels && (
    <label htmlFor="location-search" className = "block text-sm font-semibold text-gray-800" >
      Location
      </label>
        )
}

<div className="flex items-center gap-2 bg-gray-100 border-2 border-gray-300 rounded-lg px-3 py-2 focus-within:border-blue-500 focus-within:bg-white transition-colors duration-200" >
  <MapPin size={ 20 } className = "text-gray-500 flex-shrink-0" />
    <input
            id="location-search"
type = "text"
placeholder = "Enter location (city, area, or pincode)"
value = { location }
onChange = { handleLocationChange }
onKeyPress = { handleKeyPress }
className = "flex-1 bg-transparent border-none outline-none text-sm font-medium placeholder-gray-500"
aria-label="Location for doctor search"
autoComplete = "off"
  />

  { location && (
    <button
              type="button"
onClick = { handleClearLocation }
className = "p-1 hover:bg-gray-200 rounded transition-colors duration-200"
aria-label="Clear location"
  >
  <X size={ 18 } className = "text-gray-600" />
    </button>
          )}

<button
            type="button"
onClick = { handleGetCurrentLocation }
disabled = { isLoadingLocation }
className = "px-3 py-1.5 bg-white border border-blue-500 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5"
aria-label="Use current location"
  >
{
  isLoadingLocation?(
              <>
  <Loader size={ 14 } className = "animate-spin" />
    <span>Locating...</span>
      </>
            ) : (
  <>
  <MapPin size= { 14} />
  <span>Current </span>
  </>
            )}
</button>
  </div>

{/* Search Button */ }
<button
          type="button"
onClick = { handleSearch }
disabled = {!searchQuery.trim()}
className = "w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
  >
  { compact? "🔍 Search": "Search Doctors" }
  </button>
  </div>

{/* Popular Searches Section */ }
{
  !compact && (
    <div className="mt-6 pt-4 border-t border-gray-200" >
      <p className="text-xs font-semibold text-gray-600 uppercase mb-3" > Try Popular Searches: </p>
        < div className = "flex flex-wrap gap-2" >
        {
          popularCategories.slice(0, 3).map((category) => (
            <button
                key= {`example-${category}`}
  type = "button"
  onClick = {() => {
    setSearchQuery(category);
    searchInputRef.current?.focus();
  }
}
className = "px-3 py-1.5 bg-gray-100 hover:bg-blue-100 border border-gray-300 text-gray-700 text-xs rounded-full font-medium transition-colors duration-200"
  >
  { category }
  </button>
            ))}
</div>
  </div>
      )}
</div>
  );
};

export default SearchBar;
