import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on app start
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      verifyToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (authToken) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.get(`${backendUrl}/api/admin/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      setAdminUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token verification failed:', error);
      logout(); // Clear invalid token
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await axios.post(`${backendUrl}/api/admin/login`, credentials);
      
      const { access_token, token_type } = response.data;
      
      // Store token
      localStorage.setItem('admin_token', access_token);
      localStorage.setItem('token_type', token_type);
      
      setToken(access_token);
      
      // Verify and get user info
      await verifyToken(access_token);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('token_type');
    setToken(null);
    setAdminUser(null);
    setIsAuthenticated(false);
  };

  const getAuthHeaders = () => {
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  const value = {
    isAuthenticated,
    adminUser,
    token,
    loading,
    login,
    logout,
    getAuthHeaders
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;