import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Get the base URL from the Vercel Environment Variable
// This will be 'https://your-backend-app.onrender.com' in production
// and potentially 'http://localhost:5000' in local development (if set in .env.local)
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create a central axios instance using the environment variable
const api = axios.create({
  baseURL: API_BASE_URL,
});

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for a token in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Set the auth token for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // API call for user login
    const response = await api.post('/api/users/login', { email, password }); // Assuming /api/users/login endpoint
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  };

  const register = async (userData) => {
    // API call for user registration
    const response = await api.post('/api/users/register', userData); // Assuming /api/users/register endpoint
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
