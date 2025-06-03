import React, { useState } from 'react';

import '../styles/AppointmentForm.css';
import { FaCalendarAlt, FaTools, FaWarehouse, FaCheck } from 'react-icons/fa';

const AppointmentForm = ({ onClose, selectedService = null }) => {
  // State for form fields
  const [garage, setGarage] = useState('');
  const [service, setService] = useState(selectedService || '');
  const [date, setDate] = useState('');
  
  // Available garages (can be fetched from API in the future)
  const garages = [
    { id: 'garage1', name: 'Golden Wings Casablanca Main' },
    { id: 'garage2', name: 'Golden Wings Rabat' },
    { id: 'garage3', name: 'Golden Wings Marrakech' }
  ];
  
  // Available services (can be fetched from API in the future)
  const services = [
    { id: 'visit', name: 'General Visit/Consultation' },
    { id: 'part-replacement', name: 'Part Replacement' },
    { id: 'customization', name: 'Customization' },
    { id: 'painting', name: 'Painting' },
    { id: 'interior-work', name: 'Interior Work' }
  ];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log({ garage, service, date });
    // Close the form after submission
    onClose();
  };
  
  return (
    <div className="appointment-overlay">
      <div className="appointment-modal">   
        <h2 className="appointment-title">BOOK YOUR APPOINTMENT</h2>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group-2">
            <label>
              <FaWarehouse className="form-icon" />
              SELECT GARAGE:
            </label>
            <select 
              className="appointment-input"
              value={garage}
              onChange={(e) => setGarage(e.target.value)}
              required
            >
              <option value="">-- Select a Garage --</option>
              {garages.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group-2">
            <label>
              <FaTools className="form-icon" />
              SELECT SERVICE:
            </label>
            <select 
              className="appointment-input"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
            >
              <option value="">-- Select a Service --</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group-2">
            <label>
              <FaCalendarAlt className="form-icon" />
              APPOINTMENT DATE:
            </label>
            <input 
              type="date" 
              className="appointment-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
            />
            <p className="date-note">Note: Available dates will be shown based on garage availability.</p>
          </div>
          
          <button type="submit" className="appointment-button">
            <FaCheck className="button-icon" /> CONFIRM BOOKING
          </button>
        </form>
        
        <button className="close-button-1" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AppointmentForm;