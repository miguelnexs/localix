import axios from 'axios';
import { API_URL } from './apiConfig';

const api = axios.create({
  baseURL: API_URL(''),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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
    // No redirigir automáticamente, dejar que AuthContext maneje los errores 401
    return Promise.reject(error);
  }
);

export default api;

// Ejemplo: Cambiar el estado de un pedido usando axios
//
// import api from './axios';
//
// async function cambiarEstadoPedido(pedidoId, nuevoEstado, notas = '') {
//   try {
//     const response = await api.post(`/pedidos/${pedidoId}/cambiar_estado/`, {
//       estado_pedido: nuevoEstado,
//       notas: notas,
//     });
//     console.log('Pedido actualizado:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error al cambiar el estado del pedido:', error.response?.data || error.message);
//     throw error;
//   }
// }
//
// // Uso:
// // cambiarEstadoPedido(123, 'enviado', 'Pedido despachado por mensajería.');