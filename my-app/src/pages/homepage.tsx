// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/searchbar';
import './Home.css';

// Define TypeScript interfaces
interface Feature {
  id: number;
  icon: string;
  title: string;
  description: string;
  link?: string;
}

const Home: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0,
    hospitals: 0
  });

  // Navigation WITHOUT react-router
  const navigate = (path: string) => {
    window.location.assign(path);
  };

  const features: Feature[] = [
    { id: 1, icon: '📍', title: 'Find Nearby', description: 'Locate doctors and clinics near you', link: '/find-doctors' },
    { id: 2, icon: '🎥', title: 'Video Consult', description: 'Consult doctors from home', link: '/video-consult' },
    { id: 3, icon: '📅', title: 'Easy Booking', description: 'Book appointments instantly', link: '/find-doctors' },
    { id: 4, icon: '🏥', title: 'Hospital Services', description: 'Access surgeries and lab tests', link: '/surgeries' }
  ];

  // Simulate fetching stats
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        doctors: 5000,
        appointments: 25000,
        patients: 100000,
        hospitals: 500
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleFeatureClick = (featureId: number): void => {
    setActiveFeature(featureId);
    const feature = features.find((f) => f.id === featureId);
    if (feature?.link) navigate(feature.link);
  };

  const handleFeatureMouseEnter = (featureId: number): void => {
    if (!activeFeature) setActiveFeature(featureId);
  };

  const handleFeatureMouseLeave = (): void => setActiveFeature(null);

  const handleFeatureKeyDown = (e: React.KeyboardEvent, featureId: number): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFeatureClick(featureId);
    }
  };

  return (
    <div className="home-page-root">
      {/* Full-bleed hero */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />

        {/* center content with max width so the hero image stays full width but content aligns */}
        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">
              Find and consult doctors <span className="highlight">anytime, anywhere</span>
            </h1>
            <p className="hero-subtitle">
              Book appointments, consult online, and access trusted health services in one place.
              Join over <strong>{stats.patients.toLocaleString()}+</strong> patients who trust us.
            </p>
          </div>

          {/* CENTERED WIDE SEARCH BAR (Practo style) */}
          <div className="search-section">
            <div className="search-inner">
              <h2 className="search-title">Find Your Doctor Now</h2>
              <SearchBar
                onSearch={(query, location) => {
                  const params = new URLSearchParams();
                  if (query) params.set("q", query);
                  if (location) params.set("loc", location);
                  navigate(`/find-doctors?${params.toString()}`);
                }}
              />
              <p className="search-hint">Search by specialty, doctor name, or symptoms</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.doctors.toLocaleString()}+</div>
            <div className="stat-label">Verified Doctors</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.appointments.toLocaleString()}+</div>
            <div className="stat-label">Appointments Booked</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.patients.toLocaleString()}+</div>
            <div className="stat-label">Happy Patients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.hospitals.toLocaleString()}+</div>
            <div className="stat-label">Partner Hospitals</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Why Choose Reach My Doctor?</h2>
        <p className="features-subtitle">We make healthcare accessible, convenient, and trustworthy</p>

        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${activeFeature === feature.id ? 'active' : ''}`}
              onClick={() => handleFeatureClick(feature.id)}
              onMouseEnter={() => handleFeatureMouseEnter(feature.id)}
              onMouseLeave={handleFeatureMouseLeave}
              onKeyDown={(e) => handleFeatureKeyDown(e, feature.id)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${feature.title}: ${feature.description}`}
            >
              <div className="feature-icon-wrapper">
                <span className="feature-icon">{feature.icon}</span>
              </div>

              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>

              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Take Control of Your Health?</h2>

          <p className="cta-description">
            Sign up today and get your first online consultation at 50% off!
          </p>

          <div className="cta-buttons">
            <button
              className="cta-button primary"
              onClick={() => navigate('/signup')}
            >
              Sign Up Free
            </button>

            <button
              className="cta-button secondary"
              onClick={() => navigate('/find-doctors')}
            >
              Find Doctors Near You
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
