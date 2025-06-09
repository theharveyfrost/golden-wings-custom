// API configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function for form data with auth
export const getAuthHeadersForFormData = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export default API_BASE_URL;