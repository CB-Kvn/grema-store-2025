import axios from 'axios';
import { store } from '@/store';
import { showLoader, hideLoader } from '@/store/slices/loaderSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader());
    return config;
  },
  (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader());
    return response;
  },
  async (error) => {
    store.dispatch(hideLoader());
    if (error.response?.status === 401) {
      // Si la cookie JWT expiró o no es válida
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
