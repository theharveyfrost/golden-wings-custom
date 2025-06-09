import React, { useState, useEffect } from 'react';
import '../styles/ProfilePage.css'; // You'll need to create this CSS file

const ProfilePage = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const response = await fetch('http://localhost:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUser(userData);

        // Fetch user's appointments
        const appointmentsResponse = await fetch('http://localhost:8000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (appointmentsResponse.ok) {
          const appointmentsData = await appointmentsResponse.json();
          setAppointments(appointmentsData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="profile-overlay">
        <div className="profile-modal">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-overlay">
        <div className="profile-modal">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-overlay">
      <div className="profile-modal">
        <h2 className="profile-title">MY PROFILE</h2>
        
        {user && (
          <div className="profile-info">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
              <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
            </div>
            
            <div className="profile-section">
              <h3>My Appointments</h3>
              {appointments.length > 0 ? (
                <div className="appointments-list">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className="appointment-card">
                      <p><strong>Service:</strong> {appointment.service?.name}</p>
                      <p><strong>Garage:</strong> {appointment.garage?.name}</p>
                      <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {appointment.status}</p>
                      {appointment.notes && <p><strong>Notes:</strong> {appointment.notes}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No appointments found.</p>
              )}
            </div>
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default ProfilePage;