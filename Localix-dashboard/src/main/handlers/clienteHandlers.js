const { ipcMain } = require('electron');
const axios = require('axios');

// Configuración de axios para el backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  timeout: 30000,
});

// Obtener todos los clientes
ipcMain.handle('clientes:obtener-todos', async () => {
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

// Obtener cliente por ID
ipcMain.handle('clientes:obtener-por-id', async (event, clienteId) => {
  try {
    const response = await api.get(`/ventas/clientes/${clienteId}/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener cliente' 
    };
  }
});

// Crear nuevo cliente
ipcMain.handle('clientes:crear', async (event, clienteData) => {
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
ipcMain.handle('clientes:crear-rapido', async (event, clienteData) => {
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

// Actualizar cliente
ipcMain.handle('clientes:actualizar', async (event, clienteId, clienteData) => {
  try {
    const response = await api.put(`/ventas/clientes/${clienteId}/`, clienteData);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al actualizar cliente' 
    };
  }
});

// Eliminar cliente
ipcMain.handle('clientes:eliminar', async (event, clienteId) => {
  try {
    await api.delete(`/ventas/clientes/${clienteId}/`);
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al eliminar cliente' 
    };
  }
});

// Buscar clientes
ipcMain.handle('clientes:buscar', async (event, query) => {
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

// Obtener ventas de un cliente
ipcMain.handle('clientes:obtener-ventas', async (event, clienteId) => {
  try {
    const response = await api.get(`/ventas/clientes/${clienteId}/ventas/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener ventas del cliente' 
    };
  }
});

// Obtener cliente con sus ventas detalladas
ipcMain.handle('clientes:obtener-con-ventas', async (event, clienteId) => {
  try {
    const response = await api.get(`/ventas/clientes/${clienteId}/ventas/`);
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener cliente con ventas' 
    };
  }
});

// Obtener estadísticas de clientes
ipcMain.handle('clientes:obtener-estadisticas', async () => {
  try {
    const response = await api.get('/ventas/clientes/estadisticas/');
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Error al obtener estadísticas' 
    };
  }
});

module.exports = {
  initializeClienteHandlers: () => {
    // Handlers inicializados silenciosamente
  }
}; 