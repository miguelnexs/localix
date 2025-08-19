const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Importar handlers
console.log('[MAIN] 📦 Importando handlers...');

try {
  const setupProductHandlers = require('./handlers/productoHandlersOptimized');
  console.log('[MAIN] ✅ Handler de productos importado');
  
  const setupCategoriaHandlers = require('./handlers/categoriaHandlers');
  console.log('[MAIN] ✅ Handler de categorías importado');
  
  const setupVentaHandlers = require('./handlers/ventaHandlers');
  console.log('[MAIN] ✅ Handler de ventas importado');
  
  const clienteHandlers = require('./handlers/clienteHandlers');
  console.log('[MAIN] ✅ Handler de clientes importado');
  
  const { initializePedidoHandlers, checkHandlersRegistered, ensureHandlersRegistered } = require('./handlers/pedidoHandlers');
  console.log('[MAIN] ✅ Handler de pedidos importado');
  
  const setupFileHandlers = require('./handlers/fileHandlers');
  console.log('[MAIN] ✅ Handler de archivos importado');
  
  const { setupExportHandlers } = require('./handlers/exportHandlers');
  console.log('[MAIN] ✅ Handler de exportaciones importado');
  
  const setupPdfHandlers = require('./handlers/pdfHandlers');
  console.log('[MAIN] ✅ Handler de PDF importado');
  
  console.log('[MAIN] ✅ Todos los handlers importados correctamente');
  
  // Configuración para reducir logs
  const setupConsoleOptimization = () => {
    // Reducir logs de Electron
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
    
    // Limpiar consola automáticamente cada 2 segundos
    if (isDev) {
      setInterval(() => {
        console.clear();
      }, 2000);
    }
    
    // Interceptar console.log para filtrar logs excesivos
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    
    // Patrones de filtrado
    const filterPatterns = [
      '[PRELOAD]',
      '[HANDLER]',
      '�� Configurando pre-carga',
      '🔄 Iniciando fetch',
      '�� Datos recibidos',
      '✅ Datos recibidos',
      '📊 Pedidos procesados',
      '🔍 PedidoDetailModal',
      '🚀 Iniciando pre-carga',
      '🚀 Dashboard pre-cargado',
      '🚀 Categorías pre-cargadas',
      '�� Productos pre-cargados',
      'Iniciando fetch de pedidos',
      'Configurando pre-carga automática',
      'safeInvoke:',
      'serialized args length:',
      'success',
      'args:',
      'Error cargando',
      'No se pudo preparar'
    ];
    
    console.log = (...args) => {
      const message = args.join(' ');
      
      // Filtrar mensajes específicos
      if (filterPatterns.some(pattern => message.includes(pattern))) {
        return;
      }
      
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Solo mostrar errores críticos
      if (message.includes('Warning:') || 
          message.includes('Consider adding an error boundary') ||
          message.includes('Error cargando')) {
        return;
      }
      
      originalError(...args);
    };
    
    console.warn = (...args) => {
      const message = args.join(' ');
      
      // Filtrar warnings específicos
      if (message.includes('No se pudo preparar')) {
        return;
      }
      
      originalWarn(...args);
    };
  };

  function createWindow() {
    // Crear la ventana del navegador
    const preloadPath = path.join(__dirname, '..', 'preload', 'indexOptimized.js');
    console.log('[MAIN] Preload path:', preloadPath);
    console.log('[MAIN] Preload file exists:', require('fs').existsSync(preloadPath));
    
    // Verificación adicional - si el archivo no existe, intentar copiarlo
    if (!require('fs').existsSync(preloadPath)) {
      console.log('[MAIN] ⚠️ Archivo preload no encontrado, intentando copiar...');
      try {
        const sourceFile = path.join(__dirname, '..', '..', 'src', 'preload', 'indexOptimized.js');
        const targetDir = path.dirname(preloadPath);
        
        if (!require('fs').existsSync(targetDir)) {
          require('fs').mkdirSync(targetDir, { recursive: true });
        }
        
        require('fs').copyFileSync(sourceFile, preloadPath);
        console.log('[MAIN] ✅ Archivo preload copiado exitosamente');
      } catch (error) {
        console.error('[MAIN] ❌ Error copiando archivo preload:', error.message);
      }
    }
    
    const mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1200,
      minHeight: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: preloadPath,
        webSecurity: false, // Permitir carga de archivos locales
        allowRunningInsecureContent: true // Permitir contenido inseguro en desarrollo
      },
      icon: path.join(__dirname, '..', 'resources', 'icon.png'),
      show: false,
      titleBarStyle: 'default',
      autoHideMenuBar: true
    });

    // Cargar la aplicación
    if (isDev) {
      console.log('[MAIN] 🔧 Cargando en modo desarrollo...');
      mainWindow.loadURL('http://localhost:5173');
      mainWindow.webContents.openDevTools();
    } else {
      const htmlPath = path.join(__dirname, '..', '..', 'out', 'renderer', 'index.html');
      console.log('[MAIN] 🔧 Cargando en modo producción...');
      console.log('[MAIN] 📁 Ruta del HTML:', htmlPath);
      console.log('[MAIN] 📁 Archivo existe:', require('fs').existsSync(htmlPath));
      mainWindow.loadFile(htmlPath);
    }

    // Mostrar la ventana cuando esté lista
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });

    // Manejar errores de carga
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      // Error silencioso
    });

    return mainWindow;
  }

  // Configurar la aplicación
  app.whenReady().then(() => {
    // Configurar optimización de consola
    setupConsoleOptimization();
    
    // Crear ventana principal
    const mainWindow = createWindow();
    
    // Configurar handlers
    console.log('[MAIN] 🔧 Iniciando configuración de handlers...');
    
    console.log('[MAIN] 📦 Configurando handlers de productos...');
    setupProductHandlers();
    
    console.log('[MAIN] 📂 Configurando handlers de categorías...');
    setupCategoriaHandlers();
    
    console.log('[MAIN] 💰 Configurando handlers de ventas...');
    setupVentaHandlers();
    
    console.log('[MAIN] 👥 Configurando handlers de clientes...');
    try {
      const clientesOk = clienteHandlers.initializeClienteHandlers();
      if (clientesOk) {
        console.log('[MAIN] ✅ Handlers de clientes configurados exitosamente');
      } else {
        console.error('[MAIN] ❌ CRÍTICO: Handlers de clientes no se registraron correctamente');
        
        // Intentar registrar manualmente
        console.log('[MAIN] 🔧 Intentando registro manual de handlers...');
        try {
          const resultado = clienteHandlers.verificarHandlersRegistrados();
          if (resultado) {
            console.log('[MAIN] ✅ Handlers verificados manualmente');
          } else {
            console.error('[MAIN] ❌ CRÍTICO: Los handlers siguen sin estar registrados');
          }
        } catch (manualError) {
          console.error('[MAIN] ❌ Error en verificación manual:', manualError);
        }
      }
    } catch (error) {
      console.error('[MAIN] ❌ Error configurando handlers de clientes:', error);
    }
    
    console.log('[MAIN] 📋 Configurando handlers de pedidos...');
    try {
      console.log('[MAIN] 🔧 Llamando a initializePedidoHandlers...');
      initializePedidoHandlers();
      console.log('[MAIN] ✅ Handlers de pedidos configurados exitosamente');
      
      // Verificar que los handlers se registraron
      console.log('[MAIN] 🔍 Verificando registro de handlers...');
      const handlersOk = checkHandlersRegistered();
      
      if (!handlersOk) {
        console.error('[MAIN] ❌ CRÍTICO: Handler pedidos:obtener-todos no está registrado');
        console.log('[MAIN] 🔧 Intentando re-registrar handlers...');
        ensureHandlersRegistered();
      } else {
        console.log('[MAIN] ✅ Handler pedidos:obtener-todos registrado correctamente');
      }
    } catch (error) {
      console.error('[MAIN] ❌ Error configurando handlers de pedidos:', error);
      console.error('[MAIN] ❌ Stack trace:', error.stack);
    }
    
    console.log('[MAIN] 📁 Configurando handlers de archivos...');
    setupFileHandlers();
    
    console.log('[MAIN] 📊 Configurando handlers de exportaciones...');
    setupExportHandlers();
    
    console.log('[MAIN] 📄 Configurando handlers de PDF...');
    setupPdfHandlers();
    
    console.log('[MAIN] ✅ Todos los handlers configurados correctamente');
    
    // Manejar activación de la aplicación
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  // Registrar handlers también en el evento 'ready' para asegurar que se registren
  app.on('ready', () => {
    console.log('[MAIN] 🔧 Verificando handlers en evento ready...');
    try {
      ensureHandlersRegistered();
      console.log('[MAIN] ✅ Handlers verificados en evento ready');
    } catch (error) {
      console.error('[MAIN] ❌ Error verificando handlers:', error);
    }
  });
  
} catch (error) {
  console.error('[MAIN] ❌ Error crítico importando handlers:', error);
}

// Manejar cierre de la aplicación
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejar errores no capturados
process.on('uncaughtException', (error) => {
  // Error silencioso
});

process.on('unhandledRejection', (reason, promise) => {
  // Error silencioso
});