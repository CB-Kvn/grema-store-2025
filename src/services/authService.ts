/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

interface LoginResponse {
  token: string;
  [key: string]: any; // Add other properties if needed
}

export const authService = {
  login: async (email: string, password: string) => {
    
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    console.log(response); // Log the token for debugging
    return response;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  register: async (data: {
    email: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/auth/reset-password', { token, password });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post<LoginResponse>('/auth/refresh-token');
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: {
    email?: string;
    role?: string;
  }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};