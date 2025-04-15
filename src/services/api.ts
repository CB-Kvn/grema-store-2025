import axios from 'axios';
import { store } from '@/store'; // Asegúrate de importar el store
import { showLoader, hideLoader } from '@/store/slices/loaderSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader()); // Mostrar el loader
    const token = localStorage.getItem('token');
    if (token) {
      config.headers!.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    store.dispatch(hideLoader()); // Ocultar el loader en caso de error
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader()); // Ocultar el loader al recibir la respuesta
    return response;
  },
  async (error) => {
    store.dispatch(hideLoader()); // Ocultar el loader en caso de error
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;