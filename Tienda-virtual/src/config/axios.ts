import axios from 'axios';
import { API_URL } from './api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar FormData
api.interceptors.request.use(
  (config) => {
    // No establecer Content-Type para FormData, dejar que el navegador lo maneje
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Simplemente devolver el error sin manejar autenticación
    return Promise.reject(error);
  }
);

export default api;