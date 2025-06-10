import React from 'react';
import '../styles/Contact.css';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaFacebook, FaInstagram } from 'react-icons/fa';

function Contact({ onAppointmentClick }) {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h2 className="contact-title">Interested?</h2>
        
        <div className="contact-info">
          <div className="contact-info-item">
            <FaMapMarkerAlt className="contact-icon"/>
            <p className="contact-text">
              <span className="contact-label">Our Location :</span>
              <span className="contact-value">
                <a href="address" className="contact-link">BRAHIM ERROUDANI (NEAR SAMSUNG), CASABLANCA, MOROCCO</a>
              </span>
            </p>
          </div>

          <div className="contact-info-item">
            <FaEnvelope className="contact-icon" />
            <p className="contact-text">
              <span className="contact-label">Our Email :</span>
              <span className="contact-value">
                <a href="/email" className="contact-link">THEOFFICIAL@GOLDENWINGSCUSTOM.COM</a>
              </span>
            </p>
          </div>

          <div className="contact-info-item">
            <FaPhoneAlt className="contact-icon" />
            <p className="contact-text">
              <span className="contact-label">Our Number:</span>
              <span className="contact-value">
                <a href="/number" className="contact-link">+212 5109-54367</a>
              </span>
            </p>
          </div>

          <div className="social-icons">
            <a href="https://www.facebook.com/theharveyfrost" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="social-icon" />
            </a>
            <a href="https://www.instagram.com/theharveyfrost" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="social-icon" />
            </a>
          </div>

          <button className="book-appointment-button" onClick={onAppointmentClick}>
            Make An Appointment Today!
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
  