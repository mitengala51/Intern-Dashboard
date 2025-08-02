import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [api] = useState(() => new ApiService());

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.getProfile();
      const userData = response.data;
      
      // DON'T set defaults here - let the API provide the real data
      // Only set user state when we have complete, valid data
      if (userData && userData.level && userData.stats) {
        console.log('Complete user data loaded:', userData); // Debug log
        setUser(userData);
      } else {
        console.error('Incomplete user data received:', userData);
        throw new Error('Incomplete user data received from server');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      api.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.login(credentials);
      setUser(response.data.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.register(userData);
      setUser(response.data.user);
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await api.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Profile refresh failed:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    refreshProfile,
    isAuthenticated: !!user,
    api
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};