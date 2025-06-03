import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/logo.png';
// Import React Icons
import { FaHome, FaTools, FaPhoneAlt, FaSignOutAlt } from 'react-icons/fa';

const Navbar = ({ onSignInClick, isLoggedIn, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Updated navbar-logo structure */}
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Golden Wings Custom" className="logo-img" />
          <div className="logo-separator"></div> {/* New separator */}
          <div className="logo-text"> {/* New text container */}
            <span>Golden</span>
            <span>Wings</span>
            <span>Custom</span>
          </div>
        </Link>

        <div className="nav-group">
          <div className="nav-links">
            <div className="nav-item">
              {/* Replace img with React Icon */}
              <FaHome className={`nav-icon ${location.pathname === '/' ? 'active' : ''}`} />
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <div className={`nav-separator ${location.pathname === '/' ? 'active' : ''}`} />
            </div>

            <div className="nav-item">
              {/* Replace img with React Icon */}
              <FaTools className={`nav-icon ${location.pathname === '/services' ? 'active' : ''}`} /> {/* Using FaTools for Services */}
              <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                Services
              </Link>
              <div className={`nav-separator ${location.pathname === '/services' ? 'active' : ''}`} />
            </div>

            <div className="nav-item">
              {/* Replace img with React Icon */}
              <FaPhoneAlt className={`nav-icon ${location.pathname === '/contact' ? 'active' : ''}`} /> {/* Using FaPhoneAlt for Contact */}
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact Us
              </Link>
              <div className={`nav-separator ${location.pathname === '/contact' ? 'active' : ''}`} />
            </div>
          </div>

          {isLoggedIn ? (
            <button onClick={onLogout} className="sign-in-btn">
              <FaSignOutAlt className="logout-icon" /> Sign Out
            </button>
          ) : (
            <button onClick={onSignInClick} className="sign-in-btn">Sign In</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
