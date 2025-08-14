const { ipcMain } = require('electron');
const axios = require('axios');

// Configuración de axios para el backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 30000,
});

// Cache para datos del dashboard
const dashboardCache = new Map();
const CACHE_DURATION = 60000; // 1 minuto

// Obtener productos disponibles para venta
ipcMain.handle('ventas:obtener-productos', async () => {
  try {
    const response = await api.get('/ventas/productos/');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener productos' 
    };
  }
});

// Buscar productos
ipcMain.handle('ventas:buscar-productos', async (event, query) => {
  try {
    const response = await api.get(`/ventas/productos/buscar/?q=${encodeURIComponent(query)}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al buscar productos' 
    };
  }
});

// Obtener clientes
ipcMain.handle('ventas:obtener-clientes', async () => {
  try {
    const response = await api.get('/ventas/clientes/');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener clientes' 
    };
  }
});

// Buscar clientes
ipcMain.handle('ventas:buscar-clientes', async (event, query) => {
  try {
    const response = await api.get(`/ventas/clientes/buscar/?q=${encodeURIComponent(query)}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al buscar clientes' 
    };
  }
});

// Crear cliente
ipcMain.handle('ventas:crear-cliente', async (event, clienteData) => {
  try {
    const response = await api.post('/ventas/clientes/', clienteData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al crear cliente' 
    };
  }
});

// Crear cliente rápido
ipcMain.handle('ventas:crear-cliente-rapido', async (event, clienteData) => {
  try {
    const response = await api.post('/ventas/clientes/crear_rapido/', clienteData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al crear cliente' 
    };
  }
});

// Crear venta rápida
ipcMain.handle('ventas:crear-venta', async (event, ventaData) => {
  try {
    const response = await api.post('/ventas/ventas/crear_venta_rapida/', ventaData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || error.message || 'Error al crear venta' 
    };
  }
});

// Obtener ventas recientes
ipcMain.handle('ventas:obtener-ventas', async () => {
  try {
    const response = await api.get('/ventas/ventas/');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener ventas' 
    };
  }
});

// Obtener resumen de ventas (optimizado con caché)
ipcMain.handle('ventas:obtener-resumen', async () => {
  try {
    // Verificar caché
    const cacheKey = 'ventas-resumen';
    const cachedData = dashboardCache.get(cacheKey);
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }

    const response = await api.get('/ventas/ventas/resumen/');
    const result = { success: true, data: response.data };
    
    // Guardar en caché
    dashboardCache.set(cacheKey, {
      data: result,
      timestamp: Date.now()
    });
    
    return result;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener resumen' 
    };
  }
});