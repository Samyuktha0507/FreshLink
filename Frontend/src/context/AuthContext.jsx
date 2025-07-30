import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Get the base URL from the Vercel Environment Variable
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
    console.log('AuthContext useEffect: Checking localStorage for user...');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
        console.log('AuthContext useEffect: User found in localStorage:', userData);
      } catch (e) {
        console.error('AuthContext useEffect: Error parsing user from localStorage:', e);
        localStorage.removeItem('user'); // Clear corrupted data
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    console.log('AuthContext login: Attempting login for email:', email);
    try {
      const response = await api.post('/api/users/login', { email, password });
      console.log('AuthContext login: API response:', response.data);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('AuthContext login: User set successfully.');
      }
      return response.data;
    } catch (err) {
      console.error('AuthContext login: Error during API call:', err.response?.data || err.message);
      throw err; // Re-throw the error for LoginPage to catch
    }
  };

  const register = async (userData) => {
    console.log('AuthContext register: Attempting registration for data:', userData);
    try {
      // Ensure role is sent correctly as per backend enum: ['vendor', 'producer', 'driver', 'admin']
      // The LoginPage already handles setting `role` from URL params.
      const response = await api.post('/api/users/register', userData);
      console.log('AuthContext register: API response:', response.data);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
        api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        console.log('AuthContext register: User registered and set successfully.');
      }
      return response.data;
    } catch (err) {
      console.error('AuthContext register: Error during API call:', err.response?.data || err.message);
      throw err; // Re-throw the error for LoginPage to catch
    }
  };

  const logout = () => {
    console.log('AuthContext logout: Logging out user.');
    localStorage.removeItem('user');
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  const value = { user, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
