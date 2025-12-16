import { useMemo, useState, type FC, type ChangeEvent } from "react";
import { Search, Filter, Heart } from "lucide-react";
import "./SurgeriesPage.css"; // Ensure styles are applied

const MOCK_SURGERIES = [
  {
    id: 1,
    name: "Appendectomy",
    speciality: "General Surgery",
    duration: "1.5 hrs",
    priceRange: "₹15,000 - ₹40,000",
    description: "Removal of inflamed appendix. Usually laparoscopic.",
  },
  {
    id: 2,
    name: "Cataract Surgery",
    speciality: "Ophthalmology",
    duration: "30 mins",
    priceRange: "₹8,000 - ₹25,000",
    description: "Phacoemulsification with IOL implantation.",
  },
  {
    id: 3,
    name: "Knee Arthroscopy",
    speciality: "Orthopedics",
    duration: "1 hr",
    priceRange: "₹25,000 - ₹60,000",
    description: "Minimally invasive knee repair and clean-up.",
  },
  {
    id: 4,
    name: "CABG (Coronary Artery Bypass)",
    speciality: "Cardiac Surgery",
    duration: "4 - 6 hrs",
    priceRange: "₹1,50,000 - ₹4,00,000",
    description: "Bypass surgery for coronary artery disease.",
  },
  {
    id: 5,
    name: "Hernia Repair",
    speciality: "General Surgery",
    duration: "45 mins",
    priceRange: "₹20,000 - ₹50,000",
    description: "Minimally invasive hernia repair surgery.",
  },
  {
    id: 6,
    name: "Hip Replacement",
    speciality: "Orthopedics",
    duration: "2 hrs",
    priceRange: "₹3,00,000 - ₹6,00,000",
    description: "Total hip arthroplasty for joint replacement.",
  },
];

const Surgeries: FC = () => {
  const [query, setQuery] = useState("");
  const [selectedSpeciality, setSelectedSpeciality] = useState("All");
  const [favorites, setFavorites] = useState<Record<number, boolean>>({});

  const specialities = useMemo(() => {
    const specialitySet = new Set(MOCK_SURGERIES.map((surgery) => surgery.speciality));
    return ["All", ...Array.from(specialitySet).sort()];
  }, []);

  const filteredSurgeries = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    
    return MOCK_SURGERIES.filter((surgery) => {
      // Filter by speciality
      const matchesSpeciality = 
        selectedSpeciality === "All" || surgery.speciality === selectedSpeciality;
      
      if (!matchesSpeciality) return false;
      
      // Filter by search query
      if (!searchTerm) return true;
      
      return (
        surgery.name.toLowerCase().includes(searchTerm) ||
        surgery.speciality.toLowerCase().includes(searchTerm) ||
        surgery.description.toLowerCase().includes(searchTerm)
      );
    });
  }, [query, selectedSpeciality]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMoreInfo = (surgeryName: string) => {
    alert(`More information requested for: ${surgeryName}`);
  };

  return (
    <div className="surgeries-page">
      <div className="surgeries-container">
        {/* Header Section */}
        <header className="surgeries-header">
          <h1>Surgery Services</h1>
          <p>Find and book surgical procedures from top specialists</p>
        </header>

        {/* Search & Filter Bar */}
        <div className="surgeries-filters">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Search surgeries, specialities..."
              />
            </div>

            <select
              value={selectedSpeciality}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedSpeciality(e.target.value)}
              className="speciality-select"
            >
              {specialities.map((speciality) => (
                <option key={speciality} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>

            <button 
              className="filter-btn"
              onClick={() => alert("More filters coming soon!")}
            >
              <Filter size={20} />
              <span>More Filters</span>
            </button>
          </div>
        </div>

        {/* Results Section */}
        <main>
          <div className="results-count">
            Found {filteredSurgeries.length} surgery{filteredSurgeries.length !== 1 ? "ies" : ""}
          </div>

          {filteredSurgeries.length === 0 ? (
            <div className="no-results">
              <p className="no-results-title">No surgeries found</p>
              <p className="no-results-sub">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="surgeries-grid">
              {filteredSurgeries.map((surgery) => (
                <div key={surgery.id} className="surgery-card">
                  {/* Card Header */}
                  <div className="surgery-card-header">
                    <div className="header-content">
                      <div className="title-wrapper">
                        <h3>{surgery.name}</h3>
                        <p className="speciality-tag">{surgery.speciality}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(surgery.id)}
                        className="favorite-btn"
                        aria-label={favorites[surgery.id] ? "Remove from favorites" : "Add to favorites"}
                      >
                        <Heart
                          size={22}
                          className={favorites[surgery.id] ? "heart-active" : "heart-inactive"}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="surgery-card-body">
                    <p className="surgery-desc">
                      {surgery.description}
                    </p>

                    {/* Details Grid */}
                    <div className="surgery-details">
                      <div className="surgery-detail-row">
                        <span className="detail-label">Duration</span>
                        <span className="detail-value">{surgery.duration}</span>
                      </div>
                      <div className="surgery-detail-row border-top">
                        <span className="detail-label">Cost Range</span>
                        <span className="detail-value">{surgery.priceRange}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => handleMoreInfo(surgery.name)}
                      className="get-info-btn"
                    >
                      Get More Info
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="surgeries-footer">
          <p>© 2024 Surgery Services. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Surgeries;
