import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';
import logo from '../assets/images/logo.png';
import { FaHome, FaTools, FaPhoneAlt, FaImages } from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Golden Wings Custom" className="logo-img" />
          <div className="logo-separator"></div>
          <div className="logo-text">
            <span>Golden</span>
            <span>Wings</span>
            <span>Custom</span>
          </div>
        </Link>

        <div className="nav-group">
          <div className="nav-links">
            <div className="nav-item">
              <FaHome className={`nav-icon ${location.pathname === '/' ? 'active' : ''}`} />
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                Home
              </Link>
              <div className={`nav-separator ${location.pathname === '/' ? 'active' : ''}`} />
            </div>

            <div className="nav-item">
              <FaTools className={`nav-icon ${location.pathname === '/services' ? 'active' : ''}`} />
              <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>
                Services
              </Link>
              <div className={`nav-separator ${location.pathname === '/services' ? 'active' : ''}`} />
            </div>

            <div className="nav-item">
              <FaImages className={`nav-icon ${location.pathname === '/artworks' ? 'active' : ''}`} />
              <Link to="/artworks" className={`nav-link ${location.pathname === '/artworks' ? 'active' : ''}`}>
                Our Work
              </Link>
              <div className={`nav-separator ${location.pathname === '/artworks' ? 'active' : ''}`} />
            </div>

            <div className="nav-item">
              <FaPhoneAlt className={`nav-icon ${location.pathname === '/contact' ? 'active' : ''}`} />
              <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
                Contact Us
              </Link>
              <div className={`nav-separator ${location.pathname === '/contact' ? 'active' : ''}`} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
