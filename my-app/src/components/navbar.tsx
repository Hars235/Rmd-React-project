import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './navbar.css';

interface NavItem {
  name: string;
  path: string;
}

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const navLinks: NavItem[] = [
    { name: 'Home', path: '/' },
    { name: 'Find Doctors', path: '/find-doctors' },
    { name: 'Video Consult', path: '/video-consult' },
    { name: 'Lab Tests', path: '/lab-tests' },
    { name: 'Surgeries', path: '/surgeries' },
  ];

  const rightLinks: NavItem[] = [
    { name: 'Know More', path: '/know-more' },
    { name: 'About Us', path: '/about-us' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <h1>Reach My Doctor</h1>
        </Link>
        
        <div className="nav-links">
          {navLinks.map((item: NavItem) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="nav-right">
        <div className="nav-links">
          {rightLinks.map((item: NavItem) => (
            <Link key={item.name} to={item.path} className="nav-link">
              {item.name}
            </Link>
          ))}
        </div>

        <div className="auth-buttons">
          {isLoggedIn ? (
            <>
              <Link to="/appointments" className="nav-button">
                Appointments
              </Link>
              <button 
                className="nav-button logout"
                onClick={() => setIsLoggedIn(false)}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/signup" className="nav-button signup">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;