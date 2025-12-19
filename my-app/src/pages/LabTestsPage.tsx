import React, { useState, type FC } from "react";
import "../App.css";

/* --- Mock Data --- */
const TOP_BOOKED_TESTS = [
  {
    id: 1,
    name: "Thyroid Profile",
    description: "Known as Thyroid Profile Total Blood",
    price: 500,
    tag: "Get reports within 24hrs",
  },
  {
    id: 2,
    name: "Complete Blood Count",
    description: "Known as Complete Blood Count Automated Blood",
    price: 300,
    tag: "",
  },
  {
    id: 3,
    name: "Lipid Profile",
    description: "Known as Lipid Profile Blood",
    price: 434,
    tag: "",
  },
  {
    id: 4,
    name: "Liver Function Test",
    description: "Known as Liver Function Tests Blood",
    price: 673,
    tag: "",
  },
  {
    id: 5,
    name: "HbA1c",
    description: "Known as Glycosylated Haemoglobin Blood",
    price: 300,
    tag: "",
  },
  {
    id: 6,
    name: "Vitamin B 12",
    description: "Known as Vitamin B12 Conventional Blood",
    price: 490,
    tag: "",
  },
  {
    id: 7,
    name: "Beta HCG",
    description: "Known as Beta Hcg Automated Blood",
    price: 850,
    tag: "",
  },
  {
    id: 8,
    name: "Vitamin D Profile",
    description: "Known as Vitamin D Profile Blood",
    price: 1000,
    tag: "",
  },
];

const HEALTH_PACKAGES = [
  {
    id: 101,
    name: "Vitamin Deficiency Health Checkup",
    price: 999,
    discount: "25% OFF",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_history.png",
  },
  {
    id: 102,
    name: "Young Indian Health Checkup",
    price: 1299,
    discount: "24% OFF",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_history.png",
  },
  {
    id: 103,
    name: "Comprehensive Full Body Checkup",
    price: 1599,
    discount: "22% OFF",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_history.png",
  },
  {
    id: 104,
    name: "Senior Citizen Health Checkup",
    price: 1999,
    discount: "20% OFF",
    image: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_history.png",
  }
];

// Placeholder city icons - replace with actual assets from the design provided by user if available
const CITIES = [
  { name: "Bangalore", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Delhi", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Mumbai", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Chennai", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Hyderabad", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Kolkata", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Pune", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" },
  { name: "Ahmedabad", icon: "https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png" }
];



const PACKAGE_TABS = ["Featured Checkups", "Women's Health", "Men's Health"];

const LabTestsPage: FC = () => {
  const [city, setCity] = useState("Bangalore");
  const [showCityModal, setShowCityModal] = useState(false);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activePackageTab, setActivePackageTab] = useState("Featured Checkups");

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCityModal(false);
  };

  const handleSearchFocus = () => {
      setShowDropdown(true);
  };

  const handleSearchBlur = () => {
      // Delay to allow clicking on items
      setTimeout(() => setShowDropdown(false), 200);
  };

  return (
    <div className="rmd-lab-page">
      {/* City Modal */}
      {showCityModal && (
        <div className="rmd-modal-backdrop" onClick={() => setShowCityModal(false)}>
          <div className="rmd-city-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rmd-city-search-header">
               <input type="text" placeholder="Search for city" className="rmd-city-modal-input" />
               <button className="rmd-modal-close-icon" onClick={() => setShowCityModal(false)}>×</button>
            </div>
            <div className="rmd-top-cities">
              <h4>TOP CITIES</h4>
              <div className="rmd-cities-grid">
                {CITIES.map((c) => (
                  <div key={c.name} className={`rmd-city-item ${city === c.name ? 'selected' : ''}`} onClick={() => handleCitySelect(c.name)}>
                    <div className="rmd-city-icon">
                        <img src={c.icon} alt={c.name} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                    </div>
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero / Search Section */}
      <section className="rmd-lab-hero">
        <div className="rmd-lab-container">
          <div className="rmd-lab-header">
            <h1>Book Lab Tests Online</h1>
            <div className="rmd-lab-actions">
               <button className="btn-secondary">Cart</button>
            </div>
          </div>
          
          <div className="rmd-search-container-relative">
              <div className="rmd-lab-search-bar">
                 <div className="rmd-lab-location" onClick={() => setShowCityModal(true)}>
                    <span className="rmd-loc-icon">📍</span>
                    <span className="rmd-loc-text">{city}</span>
                    <span className="rmd-arrow-down">▼</span>
                 </div>
                 <div className="rmd-lab-input-wrapper">
                    <input 
                      type="text" 
                      placeholder="Search for tests, packages & profiles" 
                      value={query}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                      onFocus={handleSearchFocus}
                      onBlur={handleSearchBlur}
                    />
                    <span className="rmd-search-icon">🔍</span>
                 </div>
              </div>

              {/* Search Dropdown */}
              {showDropdown && (
                  <div className="rmd-search-dropdown">
                      <div className="rmd-dropdown-section">
                          <div className="rmd-dropdown-header">
                              <span className="rmd-dd-icon">🧪</span>
                              <span>Top booked Tests</span>
                          </div>
                          {TOP_BOOKED_TESTS.slice(0, 5).map(test => (
                              <div key={test.id} className="rmd-dropdown-item">
                                  {test.name}
                              </div>
                          ))}
                      </div>
                      <div className="rmd-dropdown-section">
                          <div className="rmd-dropdown-header">
                              <span className="rmd-dd-icon">📦</span>
                              <span>Top booked Packages</span>
                          </div>
                          {HEALTH_PACKAGES.slice(0, 3).map(pkg => (
                              <div key={pkg.id} className="rmd-dropdown-item">
                                  {pkg.name}
                              </div>
                          ))}
                      </div>
                  </div>
              )}
          </div>


        </div>
      </section>

      {/* Top Booked Diagnostic Tests */}
      <section className="rmd-section rmd-lab-section">
        <div className="rmd-section-header">
           <h2>Top Booked Diagnostic Tests</h2>
           <span className="rmd-tag-green">⚡ Get reports within 24hrs</span>
        </div>
        
        <div className="rmd-horizontal-scroll">
           {TOP_BOOKED_TESTS.map((test) => (
             <div key={test.id} className="rmd-test-card">
                <div className="rmd-test-header">
                   <h3>{test.name}</h3>
                   <span className="rmd-price">₹{test.price}</span>
                </div>
                <p className="rmd-test-desc">{test.description}</p>
                <button className="btn-outline-primary rmd-btn-add">ADD TO CART</button>
             </div>
           ))}
        </div>
      </section>

      {/* Popular Health Packages */}
      <section className="rmd-section rmd-lab-section">
        <h2>Popular Health Checkup Packages</h2>
        
        <div className="rmd-tabs">
            {PACKAGE_TABS.map((tab) => (
                <button 
                    key={tab} 
                    className={`rmd-tab-pill ${activePackageTab === tab ? 'active' : ''}`}
                    onClick={() => setActivePackageTab(tab)}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="rmd-horizontal-scroll">
           {HEALTH_PACKAGES.map((pkg) => (
             <div key={pkg.id} className="rmd-package-card">
                 <div className="rmd-pkg-badge">{pkg.discount}</div>
                 <h3 className="rmd-pkg-title">{pkg.name}</h3>
                 <p className="rmd-pkg-price">₹{pkg.price}</p>
                 {/* Simulate family image or placeholder */}
                 <div className="rmd-pkg-image-placeholder">
                    <span>🏥</span>
                 </div>
                 <button className="btn-outline-primary rmd-btn-add">ADD TO CART</button>
             </div>
           ))}
        </div>
      </section>
    </div>
  );
};

export default LabTestsPage;
