import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Added useEffect
import Home from './pages/Home';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import AuthForms from './components/AuthForms';
import AppointmentForm from './components/AppointmentForm';
import './styles/fonts.css';
import './styles/App.css';
import ProfilePage from './components/ProfilePage';
import ArtworkForm from './components/ArtworkForm';

function App() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [adminCredentials] = useState({ username: 'admin', password: 'admin123' }); // Admin credentials
  const [showProfilePage, setShowProfilePage] = useState(false);
  const [showArtworkForm, setShowArtworkForm] = useState(false);
  const [editArtworkId, setEditArtworkId] = useState(null);

  // Check for admin login in localStorage on component mount
  useEffect(() => {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (adminLoggedIn === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleShowAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthForm(true);
  };

  const handleCloseAuth = () => {
    setShowAuthForm(false);
  };

  // Modified to handle admin login
  const handleLogin = (credentials) => {
    // Check if credentials match admin credentials
    if (credentials && 
        credentials.email === adminCredentials.username && 
        credentials.password === adminCredentials.password) {
      setIsLoggedIn(true);
      setShowAuthForm(false);
      // Store login state in localStorage
      localStorage.setItem('adminLoggedIn', 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Remove login state from localStorage
    localStorage.removeItem('adminLoggedIn');
  };
  
  const handleShowAppointment = (serviceId = null) => {
    setSelectedService(serviceId);
    setShowAppointmentForm(true);
  };
  
  const handleCloseAppointment = () => {
    setShowAppointmentForm(false);
  };

  const handleShowProfile = () => {
    setShowProfilePage(true);
  };

  const handleCloseProfile = () => {
    setShowProfilePage(false);
  };

  const handleShowArtworkForm = (artworkId = null) => {
    setEditArtworkId(artworkId);
    setShowArtworkForm(true);
  };

  const handleCloseArtworkForm = () => {
    setShowArtworkForm(false);
    setEditArtworkId(null);
  };

  return (
    <Router>
      <Navbar 
        onSignInClick={() => handleShowAuth('login')} 
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onProfileClick={handleShowProfile} // Add this prop
      />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/services" 
            element={
              <Services 
                isLoggedIn={isLoggedIn} 
                onReserveClick={(serviceId) => {
                  if (isLoggedIn) {
                    handleShowAppointment(serviceId);
                  } else {
                    handleShowAuth('login');
                  }
                }} 
              />
            } 
          />
          <Route 
            path="/contact" 
            element={
              <Contact 
                isLoggedIn={isLoggedIn} 
                onAppointmentClick={() => {
                  if (isLoggedIn) {
                    handleShowAppointment();
                  } else {
                    handleShowAuth('login');
                  }
                }} 
              />
            } 
          />
        </Routes>
      </div>
      
      {showAuthForm && (
        <AuthForms 
          onClose={handleCloseAuth} 
          initialMode={authMode} 
          onLogin={handleLogin}
        />
      )}
      
      {showAppointmentForm && isLoggedIn && (
        <AppointmentForm 
          onClose={handleCloseAppointment}
          selectedService={selectedService}
        />
      )}
      
      {showProfilePage && isLoggedIn && (
        <ProfilePage onClose={handleCloseProfile} />
      )}
      
      {showArtworkForm && isLoggedIn && (
        <ArtworkForm 
          onClose={handleCloseArtworkForm}
          artworkId={editArtworkId}
        />
      )}
    </Router>
  );
}

export default App;
