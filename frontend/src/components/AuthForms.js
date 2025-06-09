import React, { useState } from 'react';
import '../styles/AuthForms.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons

const AuthForms = ({ onClose, initialMode = 'login', onLogin }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    // Reset password visibility when switching modes
    setShowPassword(false);
    setShowConfirmPassword(false);
    setLoginError(false);
    setErrorMessage('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);
    setErrorMessage('');

    try {
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('adminLoggedIn', 'true');

      // Call the onLogin callback
      onLogin({ email, password });
      onClose();
    } catch (error) {
      setLoginError(true);
      setErrorMessage(error.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(false);
    setErrorMessage('');

    try {
      // First, get CSRF cookie
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      });

      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          username,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('adminLoggedIn', 'true');

      // Call the onLogin callback
      onLogin({ email, password });
      onClose();
    } catch (error) {
      setLoginError(true);
      setErrorMessage(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">
        {mode === 'login' ? (
          // Login Form
          <form className="auth-form login-form" onSubmit={handleLoginSubmit}>
            <h2 className="auth-title">WELCOME BACK</h2>
            
            {loginError && <div className="error-message">{errorMessage || 'Invalid credentials. Try admin/admin123'}</div>}
            
            <div className="form-group-1">
              <label> Username / Email Address :</label>
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
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'LOGGING IN...' : 'LOG IN'}
            </button>
            
            <div className="auth-switch">
              DON'T HAVE AN ACCOUNT? <span onClick={toggleMode} className="auth-link">SIGN UP</span>
            </div>
          </form>
        ) : (
          // Signup Form
          <form className="auth-form signup-form" onSubmit={handleSignupSubmit}>
            <h2 className="auth-title">WE'RE HAPPY<br />TO HAVE YOU</h2>
            
            {loginError && <div className="error-message">{errorMessage}</div>}
            
            <div className="form-group-1">
              <label>Full Name</label>
              <input 
                type="text" 
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group-1">
              <label>Username</label>
              <input 
                type="text" 
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
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
            </div>
    
            
            <button type="submit" className="auth-button" disabled={isLoading}>
              {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </button>
            
            <div className="auth-switch">
              ALREADY HAVE AN ACCOUNT? <span onClick={toggleMode} className="auth-link">LOG IN</span>
            </div>
          </form>
        )}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default AuthForms;