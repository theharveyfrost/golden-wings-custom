import React, { useState, useEffect, useCallback } from 'react';
import '../styles/AppointmentForm.css';
import { FaCalendarAlt, FaWarehouse, FaCheck, FaUser, FaEnvelope, FaPhone, FaStickyNote } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const API_URL = 'http://localhost:5000/api';

const AppointmentForm = ({ onClose, selectedServiceId = null }) => {
  const [formData, setFormData] = useState({
    garage_id: '',
    service_id: selectedServiceId ? selectedServiceId.toString() : '',
    appointment_date: '',
    client_name: '',
    client_email: '',
    client_phone: '',
    notes: ''
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);
  const [garages, setGarages] = useState([]);
  const [bookedDates, setBookedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isLoadingDates, setIsLoadingDates] = useState(false);

  const fetchBookedDates = useCallback(async (garageId) => {
    if (!garageId) return;

    try {
      setIsLoadingDates(true);
      const response = await fetch(`${API_URL}/appointments/garage/${garageId}/dates`);
      if (!response.ok) throw new Error('Failed to fetch booked dates');

      const datesData = await response.json();
      const datesMap = datesData.reduce((acc, { date, count }) => {
        acc[date] = count;
        return acc;
      }, {});
      setBookedDates(datesMap);
    } catch (err) {
      console.error('Error fetching booked dates:', err);
      setError('Failed to load available dates. Please try again.');
    } finally {
      setIsLoadingDates(false);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      setLoading(true);

      console.log('Fetching services and garages...');
      const [servicesRes, garagesRes] = await Promise.all([
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/garages`)
      ]);

      if (!servicesRes.ok) {
        const errorText = await servicesRes.text();
        console.error('Services fetch failed:', errorText);
        throw new Error('Failed to fetch services');
      }
      if (!garagesRes.ok) {
        const errorText = await garagesRes.text();
        console.error('Garages fetch failed:', errorText);
        throw new Error('Failed to fetch garages');
      }

      const servicesData = await servicesRes.json();
      const garagesData = await garagesRes.json();

      console.log('Services data received:', servicesData);
      console.log('Garages data received:', garagesData);

      setServices(servicesData);
      setGarages(garagesData);
      console.log('Services state after set:', servicesData);

      if (servicesData.length > 0 && !formData.service_id) {
        const defaultServiceId = selectedServiceId ? selectedServiceId.toString() : servicesData[0].id.toString();
        setFormData(prev => ({ ...prev, service_id: defaultServiceId }));
      }

      if (garagesData.length > 0 && !formData.garage_id) {
        const defaultGarageId = garagesData[0].id.toString();
        setFormData(prev => ({ ...prev, garage_id: defaultGarageId }));
        await fetchBookedDates(defaultGarageId);
      }

    } catch (err) {
      console.error('Error loading form data:', err);
      setError('Failed to load form data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedServiceId, formData.service_id, formData.garage_id, fetchBookedDates]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGarageChange = (e) => {
    const garageId = e.target.value;
    setFormData(prev => ({ ...prev, garage_id: garageId, appointment_date: '' }));
    setSelectedDate(null);
    fetchBookedDates(garageId);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      appointment_date: date ? date.toISOString().split('T')[0] : ''
    }));
  };

  const isDateFullyBooked = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return (bookedDates[dateStr] || 0) >= 8;
  };

  const renderDayContents = (day, date) => {
    const dateStr = date.toISOString().split('T')[0];
    const isBooked = isDateFullyBooked(date);
    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

    return (
      <div className={`day-content ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`} title={isBooked ? 'Fully booked' : ''}>
        {date.getDate()}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!formData.service_id || !formData.garage_id || !formData.appointment_date) {
      setError('Please fill in all required fields.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create appointment');
      }

      setSuccess(true);
      setFormData({
        garage_id: garages[0]?.id.toString() || '',
        service_id: services[0]?.id.toString() || '',
        appointment_date: '',
        client_name: '',
        client_email: '',
        client_phone: '',
        notes: ''
      });
      setSelectedDate(null);
    } catch (err) {
      console.error('Appointment creation error:', err);
      setError(err.message || 'Failed to create appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="appointment-form-overlay">
        <div className="appointment-form-container">
          <div className="loading">Loading form...</div>
        </div>
      </div>
    );
  }

  console.log('Rendering form with services:', services);
  
  return (
    <div className="appointment-form-overlay">
      <div className="appointment-form">
        <div className="form-header">
          <h2>Book an Appointment</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">
            <FaCheck className="success-icon" />
            <p>Appointment booked successfully! You will receive a confirmation email shortly.</p>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit}>

            {/* Service dropdown */}
            <div className="form-group">
              <label htmlFor="service_id">Service</label>
              <select id="service_id" name="service_id" value={formData.service_id} onChange={handleInputChange}>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.title}</option>
                ))}
              </select>
            </div>

            {/* Garage dropdown */}
            <div className="form-group">
              <label htmlFor="garage_id">
                <FaWarehouse className="input-icon" /> Garage Location
              </label>
              <select id="garage_id" name="garage_id" value={formData.garage_id} onChange={handleGarageChange}>
                {garages.map(garage => (
                  <option key={garage.id} value={garage.id}>
                    {garage.name} ({garage.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Date picker */}
            <div className="form-group">
              <label>
                <FaCalendarAlt className="input-icon" /> Appointment Date
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                renderDayContents={renderDayContents}
                disabled={isLoadingDates}
              />
            </div>

            {/* Client name */}
            <div className="form-group">
              <label>
                <FaUser className="input-icon" /> Name
              </label>
              <input type="text" name="client_name" value={formData.client_name} onChange={handleInputChange} required />
            </div>

            {/* Client email */}
            <div className="form-group">
              <label>
                <FaEnvelope className="input-icon" /> Email
              </label>
              <input type="email" name="client_email" value={formData.client_email} onChange={handleInputChange} required />
            </div>

            {/* Client phone */}
            <div className="form-group">
              <label>
                <FaPhone className="input-icon" /> Phone
              </label>
              <input type="text" name="client_phone" value={formData.client_phone} onChange={handleInputChange} required />
            </div>

            {/* Notes */}
            <div className="form-group">
              <label>
                <FaStickyNote className="input-icon" /> Notes (optional)
              </label>
              <textarea name="notes" value={formData.notes} onChange={handleInputChange} />
            </div>

            {/* Submit */}
            <button type="submit" className="submit-button" disabled={submitting}>
              {submitting ? 'Booking...' : 'Book Appointment'}
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm;
