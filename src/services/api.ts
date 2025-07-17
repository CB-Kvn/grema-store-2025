import axios from 'axios';
import { store } from '@/store';
import { showLoader, hideLoader } from '@/store/slices/loaderSlice';
import { config, logger } from '@/config/environment';

const api = axios.create({
  baseURL: config.API_URL,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader());
    logger.debug('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    store.dispatch(hideLoader());
    logger.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader());
    logger.debug('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  async (error) => {
    store.dispatch(hideLoader());
    logger.error('API Response Error:', error.response?.status, error.response?.data || error.message);
    if (error.response?.status === 401) {
      // Si la cookie JWT expiró o no es válida
      logger.warn('Unauthorized access, redirecting to login');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
