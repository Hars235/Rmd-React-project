// src/pages/doctorspage.tsx
import React, { useMemo, useState, type FormEvent } from "react";


type Doctor = {
  id: number;
  name: string;
  city: string;
  speciality: string;
  clinic: string;
};

const DOCTORS: Doctor[] = [
  {
    id: 1,
    name: "Dr. Asha Kumar",
    city: "Bangalore",
    speciality: "Cardiologist",
    clinic: "City Heart Clinic",
  },
  {
    id: 2,
    name: "Dr. Ravi Menon",
    city: "Bangalore",
    speciality: "Dermatologist",
    clinic: "Glow Skin Center",
  },
  {
    id: 3,
    name: "Dr. Sneha Reddy",
    city: "Hyderabad",
    speciality: "Dentist",
    clinic: "Bright Smile Dental",
  },
  {
    id: 4,
    name: "Dr. Nisha Iyer",
    city: "Chennai",
    speciality: "Gynecologist",
    clinic: "Women Care Clinic",
  },
  {
    id: 5,
    name: "Dr. Arjun Desai",
    city: "Mumbai",
    speciality: "General Physician",
    clinic: "City Health Clinic",
  },
];

const DoctorsPage: React.FC = () => {
  const [city, setCity] = useState("Bangalore");
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // filtering is done live in useMemo
  };

  const filteredDoctors = useMemo(() => {
    const q = query.trim().toLowerCase();

    return DOCTORS.filter((d) => {
      if (d.city !== city) return false;
      if (!q) return true;

      return (
        d.name.toLowerCase().includes(q) ||
        d.speciality.toLowerCase().includes(q) ||
        d.clinic.toLowerCase().includes(q)
      );
    });
  }, [city, query]);

  return (
    <div className="rmd-doctors-page-wrapper">
      {/* HERO BAND (blue) */}
      <section className="rmd-doctors-hero">
        <div className="rmd-doctors-hero-inner">
          <h1 className="rmd-doctors-title">Your home for health</h1>
          <h2 className="rmd-doctors-subtitle">Find and Book</h2>

          {/* big white search bar */}
          <form
            className="rmd-search-panel rmd-doctors-search-panel"
            onSubmit={handleSubmit}
          >
            {/* City select */}
            <div className="rmd-input rmd-location">
              <span className="rmd-input-icon">📍</span>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Select city"
              >
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Mumbai">Mumbai</option>
              </select>
            </div>

            {/* Query */}
            <div className="rmd-input rmd-query">
              <span className="rmd-input-icon">🔍</span>
              <input
                type="text"
                placeholder="Search doctors, clinics, hospitals, etc."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary rmd-search-btn">
              Search
            </button>
          </form>

          {/* Popular searches row */}
          <div className="rmd-doctors-popular">
            <span className="rmd-doctors-popular-label">
              Popular searches:
            </span>
            <button type="button" className="rmd-doctors-pill">
              Dermatologist
            </button>
            <button type="button" className="rmd-doctors-pill">
              Pediatrician
            </button>
            <button type="button" className="rmd-doctors-pill">
              Gynecologist/Obstetrician
            </button>
            <button type="button" className="rmd-doctors-pill">
              Others
            </button>
          </div>
        </div>
      </section>

      {/* TOP STRIP LIKE SECOND IMAGE */}
      <section className="rmd-doctors-top-strip">
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">💬</span>
          <span>Consult with a doctor</span>
        </div>
        <div className="rmd-doctors-strip-separator" />
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">🛒</span>
          <span>Order Medicines</span>
        </div>
        <div className="rmd-doctors-strip-separator" />
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">📄</span>
          <span>View medical records</span>
        </div>
        <div className="rmd-doctors-strip-separator" />
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">🧪</span>
          <span>Book test</span>
        </div>
        <div className="rmd-doctors-strip-separator" />
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">📚</span>
          <span>Read articles</span>
        </div>
        <div className="rmd-doctors-strip-separator" />
        <div className="rmd-doctors-strip-item">
          <span className="rmd-doctors-strip-icon">🏥</span>
          <span>For healthcare providers</span>
        </div>
      </section>

      {/* RESULTS AREA (same card style as home search results) */}
      <main className="rmd-main rmd-doctors-main">
        <section className="rmd-section">
          <div className="rmd-section-header">
            <div>
              <h2>Doctors & clinics in {city}</h2>
              <p className="rmd-section-sub">
                Showing results for{" "}
                {query.trim() ? `"${query.trim()}"` : "all specialties"}.
              </p>
            </div>
          </div>

          {filteredDoctors.length === 0 ? (
            <p className="rmd-doctors-empty">
              No doctors found. Try a different keyword or city.
            </p>
          ) : (
            <div className="rmd-results-grid">
              {filteredDoctors.map((d) => (
                <article className="rmd-result-card" key={d.id}>
                  <h3 className="rmd-result-name">{d.name}</h3>
                  <p className="rmd-result-speciality">{d.speciality}</p>
                  <p className="rmd-result-clinic">{d.clinic}</p>
                  <p className="rmd-result-city">{d.city}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DoctorsPage;
