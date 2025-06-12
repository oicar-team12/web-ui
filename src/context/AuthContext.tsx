import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, AuthResponse } from '../services/authService';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await fetchUserData();
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('accessToken');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (err: any) {
      console.error('Failed to fetch user data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('accessToken');
        setUser(null);
      }
      throw err;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      
      if (!response.accessToken) {
        throw new Error('No access token received from server');
      }

      localStorage.setItem('accessToken', response.accessToken);
      
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      await fetchUserData();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData: { email: string; password: string; firstName: string; lastName: string }) => {
    try {
      setError(null);
      await authService.register(userData);
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.message || 'Failed to register. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  };

  const clearError = () => {
    setError(null);
  };

  const deleteAccount = async () => {
    try {
      setError(null);
      await authService.deleteAccount();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (err: any) {
      console.error('Delete account error:', err);
      const errorMessage = err.message || 'Failed to delete account. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 