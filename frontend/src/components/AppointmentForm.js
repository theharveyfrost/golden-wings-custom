import React, { useState, useEffect } from 'react';
import '../styles/AppointmentForm.css';
import { FaCalendarAlt, FaTools, FaWarehouse, FaCheck } from 'react-icons/fa';

const AppointmentForm = ({ onClose, selectedService = null }) => {
  // State for form fields
  const [garage, setGarage] = useState('');
  const [service, setService] = useState(selectedService || '');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // State for API data
  const [garages, setGarages] = useState([]);
  const [services, setServices] = useState([]);
  
  // Fetch garages and services from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch garages
        const garagesResponse = await fetch('http://localhost:8000/api/garages');
        if (!garagesResponse.ok) {
          throw new Error('Failed to fetch garages');
        }
        const garagesData = await garagesResponse.json();
        setGarages(garagesData);
        
        // Fetch services
        const servicesResponse = await fetch('http://localhost:8000/api/services');
        if (!servicesResponse.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
        
        // If selectedService is provided, find and set it
        if (selectedService) {
          const foundService = servicesData.find(s => s.id.toString() === selectedService.toString());
          if (foundService) {
            setService(foundService.id);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedService]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to book an appointment');
      }
      
      const response = await fetch('http://localhost:8000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          garage_id: garage,
          service_id: service,
          appointment_date: date,
          notes: notes
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to book appointment');
      }
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="appointment-overlay">
        <div className="appointment-modal">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="appointment-overlay">
      <div className="appointment-modal">   
        <h2 className="appointment-title">BOOK YOUR APPOINTMENT</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Appointment booked successfully!</div>}
        
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
              disabled={submitting || success}
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
              disabled={submitting || success}
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
              disabled={submitting || success}
            />
            <p className="date-note">Note: Available dates will be shown based on garage availability.</p>
          </div>
          
          <div className="form-group-2">
            <label>NOTES (OPTIONAL):</label>
            <textarea
              className="appointment-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or information"
              disabled={submitting || success}
            />
          </div>
          
          <button 
            type="submit" 
            className="appointment-button"
            disabled={submitting || success}
          >
            <FaCheck className="button-icon" /> {submitting ? 'BOOKING...' : 'CONFIRM BOOKING'}
          </button>
        </form>
        
        <button className="close-button-1" onClick={onClose} disabled={submitting}>×</button>
      </div>
    </div>
  );
};

export default AppointmentForm;