import axiosInstance from './axiosConfig';
import { User } from '../types/user';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>('/auth/login', credentials);
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      }
      throw new Error(error.response?.data?.message || 'Failed to login');
    }
  },

  async register(userData: RegisterRequest): Promise<void> {
    try {
      await axiosInstance.post('/auth/register', userData);
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('Email already exists');
      }
      throw new Error(error.response?.data?.message || 'Failed to register');
    }
  },

  async logout(): Promise<void> {
    try {
      await axiosInstance.delete('/auth/logout');
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      if (error.response?.status === 0) {
        throw new Error('Cannot connect to server. Please check if the server is running.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axiosInstance.post<AuthResponse>('/auth/refresh', { refreshToken });
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
      }
      return response.data;
    } catch (error: any) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Session expired');
    }
  },

  async deleteAccount(): Promise<void> {
    try {
      await axiosInstance.delete('/user/delete-account');
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }
}; 