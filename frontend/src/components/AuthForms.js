import React, { useState } from 'react';
import '../styles/AuthForms.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const AuthForms = ({ onClose, initialMode = 'login', onLogin }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    // Reset password visibility when switching modes
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginError(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const success = onLogin({ email, password });
    if (!success) {
      setLoginError(true);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {mode === 'login' ? (
          // Login Form
          <form className="auth-form login-form" onSubmit={handleLoginSubmit}>
            <h2 className="auth-title">WELCOME BACK</h2>
            
            {loginError && <div className="error-message">Invalid credentials. Try admin/admin123</div>}
            
            <div className="form-group-1">
              <label> Username / Email Address :</label>
              <input 
                type="username" 
                className="auth-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group-1">
              <label>Password :</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="forgot-password">
                <a href="/PasswordRecovery">FORGOT PASSWORD?</a>
              </div>
            </div>
            
            <button type="submit" className="auth-button">LOG IN</button>
            
            <div className="auth-switch">
              DON'T HAVE AN ACCOUNT? <span onClick={toggleMode} className="auth-link">SIGN UP</span>
            </div>
          </form>
        ) : (
          // Signup Form
          <div className="auth-form signup-form">
            <h2 className="auth-title">WE'RE HAPPY<br />TO HAVE YOU</h2>
            
            <div className="form-group-1">
              <label>Username</label>
              <input type="text" className="auth-input" />
            </div>
            
            <div className="form-group-1">
              <label>Email Address :</label>
              <input 
                type="email" 
                className="auth-input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group-1">
              <label>Password :</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="auth-input" 
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <div className="form-group-1">
              <label>Confirm Password :</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  className="auth-input" 
                />
                <button 
                  type="button" 
                  className="toggle-password-btn" 
                  onClick={toggleConfirmPasswordVisibility}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            <button className="auth-button">SIGN UP</button>
            
            <div className="auth-switch">
              ALREADY HAVE AN ACCOUNT? <span onClick={toggleMode} className="auth-link">LOG IN</span>
            </div>
          </div>
        )}
        
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AuthForms;