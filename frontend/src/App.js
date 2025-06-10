import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import AppointmentForm from './components/AppointmentForm';
import './styles/fonts.css';
import './styles/App.css';
import Artworks from './pages/Artworks';

function App() {
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const handleShowAppointment = (serviceId = null) => {
    setSelectedService(serviceId);
    setShowAppointmentForm(true);
  };
  
  const handleCloseAppointment = () => {
    setShowAppointmentForm(false);
  };

  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/services" 
            element={
              <Services 
                onReserveClick={handleShowAppointment}
              />
            } 
          />
          <Route path="/artworks" element={<Artworks />} />
          <Route 
            path="/contact" 
            element={
              <Contact 
                onAppointmentClick={handleShowAppointment} 
              />
            } 
          />
        </Routes>

        {/* Appointment Form Modal */}
        {showAppointmentForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <AppointmentForm 
                onClose={handleCloseAppointment} 
                serviceId={selectedService} 
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
