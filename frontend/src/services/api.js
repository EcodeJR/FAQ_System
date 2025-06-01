import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_APP_API_URL_PRO
  : import.meta.env.VITE_APP_API_URL_DEV;

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle timeouts gracefully
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        response: {
          data: {
            message: 'Request timed out. Please try again.'
          }
        }
      });
    }
    return Promise.reject(error);
  }
);

export default api;