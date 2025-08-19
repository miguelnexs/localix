const { ipcMain } = require('electron');
const axios = require('axios');
const { API_BASE_URL } = require('./apiErrorHandler');

// 🚀 FUNCIÓN PARA OBTENER TOKEN DE AUTENTICACIÓN DESDE EL RENDERER
async function getAuthToken() {
  try {
    // Obtener el token desde el renderer process
    const { BrowserWindow } = require('electron');
    const windows = BrowserWindow.getAllWindows();
    
    if (windows.length > 0) {
      const mainWindow = windows[0];
      const token = await mainWindow.webContents.executeJavaScript(`
        localStorage.getItem('access_token')
      `);
      return token;
    }
    return null;
  } catch (error) {
    console.warn('No se pudo obtener el token de autenticación:', error.message);
    return null;
  }
}

// 🚀 FUNCIÓN PARA CREAR CONFIGURACIÓN DE AXIOS CON AUTENTICACIÓN
async function createAuthenticatedConfig() {
  const token = await getAuthToken();
  const config = {
    headers: {
      'Accept': 'application/json',
      'Cache-Control': 'max-age=300'
    },
    maxContentLength: 50 * 1024 * 1024,
    maxBodyLength: 50 * 1024 * 1024,
    timeout: 30000,
    keepAlive: true,
    keepAliveMsecs: 1000,
    maxSockets: 10,
    maxFreeSockets: 5
  };
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}

// Obtener todos los clientes
ipcMain.handle('clientes:obtener-todos', async () => {
  try {
    console.log('🔍 [CLIENTE HANDLER] Obteniendo todos los clientes...');
    const config = await createAuthenticatedConfig();
    console.log('🔍 [CLIENTE HANDLER] Config de autenticación:', config.headers.Authorization ? 'Token presente' : 'Sin token');
    
    const response = await axios.get(`${API_BASE_URL}/api/ventas/clientes/`, config);
    console.log('✅ [CLIENTE HANDLER] Clientes obtenidos exitosamente:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ [CLIENTE HANDLER] Error obteniendo clientes:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.error || error.response?.data?.message || 'Error al obtener clientes' 
    };
  }
});

// Obtener cliente por ID
ipcMain.handle('clientes:obtener-por-id', async (event, clienteId) => {
  try {
    const config = await createAuthenticatedConfig();
    const response = await axios.get(`${API_BASE_URL}/api/ventas/clientes/${clienteId}/`, config);
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
    console.log('🔍 [CLIENTE HANDLER] ===== INICIO CREACIÓN CLIENTE =====');
    console.log('🔍 [CLIENTE HANDLER] Datos recibidos:', JSON.stringify(clienteData, null, 2));
    console.log('🔍 [CLIENTE HANDLER] API_BASE_URL:', API_BASE_URL);
    
    const config = await createAuthenticatedConfig();
    console.log('🔍 [CLIENTE HANDLER] Config de autenticación:', config.headers.Authorization ? 'Token presente' : 'Sin token');
    console.log('🔍 [CLIENTE HANDLER] Headers completos:', JSON.stringify(config.headers, null, 2));
    
    const url = `${API_BASE_URL}/api/ventas/clientes/`;
    console.log('🔍 [CLIENTE HANDLER] URL de la petición:', url);
    
    console.log('🔍 [CLIENTE HANDLER] Realizando petición POST...');
    const response = await axios.post(url, clienteData, config);
    
    console.log('✅ [CLIENTE HANDLER] Cliente creado exitosamente');
    console.log('✅ [CLIENTE HANDLER] Status:', response.status);
    console.log('✅ [CLIENTE HANDLER] Data:', JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data };
  } catch (error) {
    console.error('❌ [CLIENTE HANDLER] ===== ERROR CREANDO CLIENTE =====');
    console.error('❌ [CLIENTE HANDLER] Error completo:', error);
    console.error('❌ [CLIENTE HANDLER] Error message:', error.message);
    console.error('❌ [CLIENTE HANDLER] Error response status:', error.response?.status);
    console.error('❌ [CLIENTE HANDLER] Error response data:', error.response?.data);
    console.error('❌ [CLIENTE HANDLER] Error response headers:', error.response?.headers);
    
    return { 
      success: false, 
      error: error.response?.data?.error || error.response?.data?.message || error.message || 'Error al crear cliente' 
    };
  }
});

// Crear cliente rápido
ipcMain.handle('clientes:crear-rapido', async (event, clienteData) => {
  try {
    const config = await createAuthenticatedConfig();
    const response = await axios.post(`${API_BASE_URL}/api/ventas/clientes/crear_rapido/`, clienteData, config);
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
    const config = await createAuthenticatedConfig();
    const response = await axios.put(`${API_BASE_URL}/api/ventas/clientes/${clienteId}/`, clienteData, config);
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
    const config = await createAuthenticatedConfig();
    await axios.delete(`${API_BASE_URL}/api/ventas/clientes/${clienteId}/`, config);
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
    const config = await createAuthenticatedConfig();
    const response = await axios.get(`${API_BASE_URL}/api/ventas/clientes/buscar/?q=${encodeURIComponent(query)}`, config);
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

// Verificar que los handlers se registren correctamente
console.log('🔍 [CLIENTE HANDLERS] Módulo cargado, verificando handlers...');
console.log('🔍 [CLIENTE HANDLERS] Handlers registrados:', ipcMain.eventNames().filter(name => name.startsWith('clientes:')));

// Función para verificar que todos los handlers estén registrados
const verificarHandlersRegistrados = () => {
  const handlersEsperados = [
    'clientes:obtener-todos',
    'clientes:obtener-por-id',
    'clientes:crear',
    'clientes:crear-rapido',
    'clientes:actualizar',
    'clientes:eliminar',
    'clientes:buscar',
    'clientes:obtener-ventas',
    'clientes:obtener-con-ventas',
    'clientes:obtener-estadisticas'
  ];
  
  const handlersRegistrados = ipcMain.eventNames().filter(name => name.startsWith('clientes:'));
  
  console.log('🔍 [CLIENTE HANDLERS] Handlers esperados:', handlersEsperados);
  console.log('🔍 [CLIENTE HANDLERS] Handlers registrados:', handlersRegistrados);
  
  const faltantes = handlersEsperados.filter(handler => !handlersRegistrados.includes(handler));
  
  if (faltantes.length > 0) {
    console.error('❌ [CLIENTE HANDLERS] Handlers faltantes:', faltantes);
    return false;
  } else {
    console.log('✅ [CLIENTE HANDLERS] Todos los handlers están registrados');
    return true;
  }
};

module.exports = {
  initializeClienteHandlers: () => {
    console.log('🔍 [CLIENTE HANDLERS] Inicializando handlers de clientes...');
    
    // Verificar que los handlers estén registrados
    const handlersOk = verificarHandlersRegistrados();
    
    if (!handlersOk) {
      console.error('❌ [CLIENTE HANDLERS] CRÍTICO: Algunos handlers no están registrados');
      console.log('🔍 [CLIENTE HANDLERS] Handlers disponibles:', ipcMain.eventNames().filter(name => name.startsWith('clientes:')));
    } else {
      console.log('✅ [CLIENTE HANDLERS] Todos los handlers de clientes están listos');
    }
    
    return handlersOk;
  },
  
  verificarHandlersRegistrados
}; 