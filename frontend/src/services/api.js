import axios from 'axios';

const BASE_URL = import.meta.env.VITE_ENV === 'production'
  ? import.meta.env.VITE_APP_API_URL_PRO  // Production backend URL
  : import.meta.env.VITE_APP_API_URL_DEV; // Development backend URL

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;