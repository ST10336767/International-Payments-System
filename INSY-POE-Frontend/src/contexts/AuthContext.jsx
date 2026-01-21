/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { formatApiError, getMainErrorMessage } from '../utils/errorHandler';

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

  const logout = async () => {
    try {
      // Call logout endpoint to clear cookie on server
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to validate session by checking if user data exists
        // Since cookies are httpOnly, we can't check them directly
        // We'll rely on the API to validate the cookie on first request
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Clear invalid user data
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user: userData } = response.data;
      
      // Token is now stored in secure httpOnly cookie, so we only store user data
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const formattedError = formatApiError(error);
      return { 
        success: false, 
        error: getMainErrorMessage(formattedError),
        errorDetails: formattedError
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const userInfo = response.data;
      
      // Token is now stored in secure httpOnly cookie, so we only store user data
      localStorage.setItem('user', JSON.stringify(userInfo));
      
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      const formattedError = formatApiError(error);
      // Handle validation errors and other error formats
      const errorData = error.response?.data;
      let errorMessage = 'Registration failed';
      
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Validation errors from express-validator
        return { 
          success: false, 
          error: { errors: errorData.errors }
        };
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
      
      return { 
        success: false, 
        error: getMainErrorMessage(formattedError),
        errorDetails: formattedError
      };
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isEmployee = () => {
    return user?.role === 'Employee';
  };

  const isCustomer = () => {
    return user?.role === 'Customer';
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isEmployee,
    isCustomer
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
