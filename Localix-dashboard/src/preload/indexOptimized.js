const { contextBridge, ipcRenderer } = require('electron');

console.log('[PRELOAD OPTIMIZADO] Script iniciado correctamente');
console.log('[PRELOAD OPTIMIZADO] ContextBridge disponible:', !!contextBridge);
console.log('[PRELOAD OPTIMIZADO] IpcRenderer disponible:', !!ipcRenderer);

// 🚀 UTILIDADES OPTIMIZADAS PARA PRELOAD
const OptimizedUtils = {
  // 🚀 SERIALIZACIÓN OPTIMIZADA
  serializeData: (data) => {
    if (!data) return data;
    
    // 🚀 OPTIMIZAR BUFFERS E IMÁGENES
    if (data?.data && (data.data instanceof Buffer || data.data instanceof Uint8Array)) {
      const buffer = Buffer.isBuffer(data.data) ? data.data : Buffer.from(data.data);
      return { 
        ...data, 
        data: buffer.toJSON(),
        _optimized: true 
      };
    }
    
    // 🚀 OPTIMIZAR ARRAYS GRANDES
    if (Array.isArray(data) && data.length > 1000) {
      return {
        _batch: true,
        data: data.slice(0, 1000), // Enviar en lotes
        total: data.length,
        hasMore: data.length > 1000
      };
    }
    
    return data;
  },

  // 🚀 DESERIALIZACIÓN OPTIMIZADA
  deserializeData: (data) => {
    if (!data) return data;
    
    if (data._optimized && data.data) {
      return {
        ...data,
        data: Buffer.from(data.data)
      };
    }
    
    if (data._batch) {
      return data.data; // Procesar lotes
    }
    
    return data;
  },

  // 🚀 PREPARACIÓN DE IMAGEN OPTIMIZADA
  prepareImageFileOptimized: (imageFile) => {
    if (!imageFile) return null;

    try {
      let imageBuffer;
      if (imageFile.data instanceof Buffer) {
        imageBuffer = imageFile.data;
      } else if (imageFile.data instanceof Uint8Array) {
        imageBuffer = Buffer.from(imageFile.data);
      } else if (typeof imageFile.data === 'object' && imageFile.data.type === 'Buffer') {
        imageBuffer = Buffer.from(imageFile.data.data);
      } else if (typeof imageFile.data === 'string') {
        const base64Data = imageFile.data.includes(',') ? 
          imageFile.data.split(',')[1] : imageFile.data;
        imageBuffer = Buffer.from(base64Data, 'base64');
      } else {
        throw new Error('Formato de imagen no soportado');
      }
      
      return {
        name: String(imageFile.name || `image_${Date.now()}`),
        data: imageBuffer,
        type: String(imageFile.type || 'application/octet-stream'),
        size: Number(imageFile.size || imageBuffer.length),
        lastModified: Number(imageFile.lastModified || Date.now()),
        _optimized: true
      };
    } catch (error) {
      console.error('Error preparando imagen optimizada:', error);
      throw new Error('Error al procesar la imagen: ' + error.message);
    }
  }
};

// 🚀 HANDLER PARA OBTENER TOKEN DE AUTENTICACIÓN
// Nota: ipcRenderer.handle no existe, usamos ipcRenderer.invoke para enviar al main process
// El main process manejará la obtención del token desde el renderer

// 🚀 MANEJO DE ERRORES OPTIMIZADO
const setupOptimizedErrorHandling = () => {
  const errorListeners = new Set();
  const errorCache = new Map(); // 🚀 CACHE DE ERRORES PARA EVITAR DUPLICADOS

  const onError = (callback) => {
    if (typeof callback !== 'function') {
      console.warn('Error listener must be a function');
      return () => {};
    }

    const handler = (_, error) => {
      try {
        // 🚀 EVITAR ERRORES DUPLICADOS
        const errorKey = `${error.message}-${Date.now()}`;
        if (errorCache.has(errorKey)) {
          return;
        }
        errorCache.set(errorKey, true);
        
        // 🚀 LIMPIAR CACHE DE ERRORES CADA 5 MINUTOS
        setTimeout(() => {
          errorCache.delete(errorKey);
        }, 5 * 60 * 1000);
        
        callback(error);
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    };

    errorListeners.add(handler);
    ipcRenderer.on('api-error', handler);

    return () => {
      errorListeners.delete(handler);
      ipcRenderer.off('api-error', handler);
    };
  };

  const removeAllErrorListeners = () => {
    errorListeners.forEach(handler => {
      ipcRenderer.off('api-error', handler);
    });
    errorListeners.clear();
    errorCache.clear();
  };

  return { onError, removeAllErrorListeners };
};

// 🚀 INVOCACIÓN IPC OPTIMIZADA
const optimizedInvoke = (channel, ...args) => {
  try {
    console.log(`[PRELOAD OPTIMIZADO] ${channel} args:`, args.length);
    
    // 🚀 SERIALIZACIÓN OPTIMIZADA
    const serializedArgs = args.map(arg => OptimizedUtils.serializeData(arg));
    
    return ipcRenderer.invoke(channel, ...serializedArgs).then(result => {
      // 🚀 DESERIALIZACIÓN OPTIMIZADA
      const deserializedResult = OptimizedUtils.deserializeData(result);
      console.log(`[PRELOAD OPTIMIZADO] ${channel} success`);
      return deserializedResult;
    }).catch(error => {
      // Solo registrar el mensaje de error, no el objeto completo para evitar problemas de serialización
      console.error(`[PRELOAD OPTIMIZADO] ${channel} error:`, error.message || 'Error desconocido');
      
      // Extraer un mensaje de error más específico si está disponible
      let errorMsg = error.message || 'Error desconocido';
      
      // Transformar el error para que sea más informativo y serializable
      const enhancedError = new Error(`Error al invocar '${channel}': ${errorMsg}`);
      // Agregar metadatos adicionales al error para debugging
      enhancedError.channel = channel;
      enhancedError.originalError = error.name || 'Error';
      throw enhancedError;
    });
  } catch (error) {
    // Solo registrar el mensaje de error, no el objeto completo
    console.error(`[PRELOAD OPTIMIZADO] IPC Invoke error (${channel}):`, error.message || 'Error desconocido');
    
    // Extraer un mensaje de error más específico si está disponible
    let errorMsg = error.message || 'Error desconocido';
    
    // Asegurar que el error tenga un mensaje claro y sea serializable
    const enhancedError = new Error(`Error en invocación IPC '${channel}': ${errorMsg}`);
    // Agregar metadatos adicionales al error para debugging
    enhancedError.channel = channel;
    enhancedError.originalError = error.name || 'Error';
    throw enhancedError;
  }
};

// 🚀 API OPTIMIZADA CON OPERACIONES BATCH
const exposeOptimizedElectronAPI = () => {
  const { onError, removeAllErrorListeners } = setupOptimizedErrorHandling();

  const api = {
    // 🚀 CATEGORÍAS OPTIMIZADAS
    categorias: {
      listar: (params = {}) => optimizedInvoke('categorias:listar', params),
      ensureGeneral: () => optimizedInvoke('categorias:ensureGeneral'),
      cleanupDuplicateGeneral: () => optimizedInvoke('categorias:cleanupDuplicateGeneral'),
      obtener: (slug) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('categorias:obtener', slug);
      },
      crear: (categoriaData) => {
        if (!categoriaData?.nombre) throw new Error('Category name is required');
        return optimizedInvoke('categorias:crear', categoriaData);
      },
      actualizar: ({ slug, data }) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('categorias:actualizar', { slug, data });
      },
      eliminar: (slug) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('categorias:eliminar', slug);
      }
    },

    // 🚀 PRODUCTOS OPTIMIZADOS
    productos: {
      // 🚀 OPERACIONES BÁSICAS OPTIMIZADAS
      listar: (params = {}) => optimizedInvoke('productos:listarOptimizado', params),
      obtener: (slug) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('productos:obtenerOptimizado', slug);
      },
      crear: (productoData) => {
        if (!productoData?.nombre) throw new Error('Product name is required');
        return optimizedInvoke('productos:crearOptimizado', productoData);
      },
      actualizar: (slug, productData) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('productos:actualizarOptimizado', { slug, productData });
      },
      eliminar: (slug) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('productos:eliminarOptimizado', slug);
      },
      
      // 🚀 OPERACIONES BATCH OPTIMIZADAS
      obtenerConDetalles: (slug) => {
        if (!slug) throw new Error('Slug is required');
        return optimizedInvoke('productos:obtenerConDetalles', slug);
      },
      cargarProductosYCategorias: (params = {}) => {
        return optimizedInvoke('productos:cargarProductosYCategorias', params);
      },
      
      // 🚀 COLORES OPTIMIZADOS
      obtenerColores: (productId) => {
        if (!productId) throw new Error('Product ID is required');
        return optimizedInvoke('productos:obtenerColoresOptimizado', productId);
      },
      crearColor: (productId, colorData) => {
        if (!productId) throw new Error('Product ID is required');
        if (!colorData?.nombre) throw new Error('Color name is required');
        return optimizedInvoke('productos:crearColor', productId, colorData);
      },
      actualizarColor: (productId, colorId, colorData) => {
        if (!productId) throw new Error('Product ID is required');
        if (!colorId) throw new Error('Color ID is required');
        return optimizedInvoke('productos:actualizarColor', productId, colorId, colorData);
      },
      eliminarColor: (productId, colorId) => {
        if (!productId) throw new Error('Product ID is required');
        if (!colorId) throw new Error('Color ID is required');
        return optimizedInvoke('productos:eliminarColor', productId, colorId);
      },
      
      // 🚀 IMÁGENES OPTIMIZADAS
      obtenerImagenes: (colorId) => {
        if (!colorId) throw new Error('Color ID is required');
        return optimizedInvoke('productos:obtenerImagenes', colorId);
      },
      subirImagen: (colorId, formData) => {
        if (!colorId) throw new Error('Color ID is required');
        if (!formData?.imagen) throw new Error('Image is required');
        return optimizedInvoke('productos:subirImagen', colorId, formData);
      },
      eliminarImagen: (colorId, imagenId) => {
        if (!colorId) throw new Error('Color ID is required');
        if (!imagenId) throw new Error('Image ID is required');
        return optimizedInvoke('productos:eliminarImagen', colorId, imagenId);
      },
      establecerImagenPrincipal: (colorId, imagenId) => {
        if (!colorId) throw new Error('Color ID is required');
        if (!imagenId) throw new Error('Image ID is required');
        return optimizedInvoke('productos:establecerImagenPrincipal', colorId, imagenId);
      },
      reordenarImagenes: (colorId, ordenData) => {
        if (!colorId) throw new Error('Color ID is required');
        if (!ordenData) throw new Error('Order data is required');
        return optimizedInvoke('productos:reordenarImagenes', colorId, ordenData);
      },
      
      // 🚀 SUBIDA DE IMAGEN PRINCIPAL OPTIMIZADA
      uploadImagenPrincipal: ({ slug, imageFile }) => {
        if (!slug) throw new Error('Slug is required');
        if (!imageFile) throw new Error('Image file is required');
        const preparedImage = OptimizedUtils.prepareImageFileOptimized(imageFile);
        return optimizedInvoke('upload-producto-imagen-principal-optimizado', { slug, imageFile: preparedImage });
      },
      
      // 🚀 GESTIÓN DE CACHE OPTIMIZADA
      limpiarCache: () => optimizedInvoke('productos:limpiarCacheOptimizado'),
      estadisticasCache: () => optimizedInvoke('productos:estadisticasCache')
    },

    // 🚀 VARIANTES OPTIMIZADAS
    variantes: {
      listarPorProducto: (productoSlug) => {
        if (!productoSlug) throw new Error('Product slug is required');
        return optimizedInvoke('get-variantes-producto', productoSlug);
      },
      crear: (productoSlug, varianteData) => {
        if (!productoSlug) throw new Error('Product slug is required');
        if (!varianteData?.nombre) throw new Error('Variant name is required');
        return optimizedInvoke('create-variante-producto', { productoSlug, varianteData });
      },
      actualizar: (id, cambios) => {
        if (!id) throw new Error('Variant ID is required');
        return optimizedInvoke('update-variante-producto', { id, varianteData: cambios });
      },
      eliminar: (id) => {
        if (!id) throw new Error('Variant ID is required');
        return optimizedInvoke('delete-variante-producto', id);
      }
    },

    // 🚀 ARCHIVOS OPTIMIZADOS
    archivos: {
      seleccionarImagen: async () => {
        try {
          const result = await optimizedInvoke('open-image-dialog');
          if (!result) return null;
          
          return {
            name: String(result.fileName || ''),
            path: String(result.filePath || ''),
            size: Number(result.size || 0),
            type: String(result.mimeType || 'application/octet-stream'),
            lastModified: Number(result.lastModified || Date.now()),
            data: new Uint8Array(result.data || [])
          };
        } catch (error) {
          console.error('Error selecting image:', error);
          return null;
        }
      },
      uint8ToBlob: (uint8Array, mimeType = 'application/octet-stream') => {
        try {
          if (!(uint8Array instanceof Uint8Array)) {
            throw new Error('Input must be a Uint8Array');
          }
          return new Blob([uint8Array], { type: String(mimeType) });
        } catch (error) {
          console.error('Error converting to Blob:', error);
          return null;
        }
      },
      createObjectURL: (blob) => {
        try {
          if (!(blob instanceof Blob)) {
            throw new Error('Input must be a Blob');
          }
          return URL.createObjectURL(blob);
        } catch (error) {
          console.error('Error creating object URL:', error);
          return '';
        }
      },
      revokeObjectURL: (url) => {
        try {
          if (typeof url === 'string' && url.startsWith('blob:')) {
            URL.revokeObjectURL(url);
          }
        } catch (error) {
          console.error('Error revoking object URL:', error);
        }
      }
    },

    // 🚀 SISTEMA DE EVENTOS OPTIMIZADO
    eventos: {
      onError,
      limpiarListeners: removeAllErrorListeners
    },

    // 🚀 VENTAS OPTIMIZADAS
    ventas: {
      obtenerProductos: () => optimizedInvoke('ventas:obtener-productos'),
      buscarProductos: (query) => optimizedInvoke('ventas:buscar-productos', query),
      obtenerClientes: () => optimizedInvoke('ventas:obtener-clientes'),
      crearCliente: (clienteData) => optimizedInvoke('ventas:crear-cliente', clienteData),
      crearVenta: (ventaData) => optimizedInvoke('ventas:crear-venta', ventaData),
      obtenerVentas: () => optimizedInvoke('ventas:obtener-ventas'),
      obtenerResumen: () => optimizedInvoke('ventas:obtener-resumen'),
      obtenerEstadisticas: () => optimizedInvoke('ventas:obtener-resumen'), // Alias para compatibilidad
      
      // 🚀 EVENTOS DE VENTAS
      on: (eventName, callback) => {
        if (typeof callback === 'function') {
          ipcRenderer.on(eventName, callback);
          return () => ipcRenderer.off(eventName, callback);
        }
      },
      off: (eventName, callback) => {
        if (typeof callback === 'function') {
          ipcRenderer.off(eventName, callback);
        }
      }
    },

    // 🚀 PEDIDOS OPTIMIZADOS
    pedidos: {
      obtenerTodos: (params = {}) => optimizedInvoke('pedidos:obtener-todos', params),
      obtenerPorId: (pedidoId) => optimizedInvoke('pedidos:obtener-por-id', pedidoId),
      crear: (pedidoData) => optimizedInvoke('pedidos:crear', pedidoData),
      actualizar: (pedidoId, pedidoData) => optimizedInvoke('pedidos:actualizar', pedidoId, pedidoData),
      eliminar: (pedidoId) => optimizedInvoke('pedidos:eliminar', pedidoId),
      cambiarEstado: (pedidoId, estadoData) => optimizedInvoke('pedidos:cambiar-estado', pedidoId, estadoData),
      obtenerHistorial: (pedidoId) => optimizedInvoke('pedidos:obtener-historial', pedidoId),
      obtenerEstadisticas: () => optimizedInvoke('pedidos:obtener-estadisticas'),
      buscar: (query) => optimizedInvoke('pedidos:buscar', query),
    },

    // 🚀 UTILIDADES OPTIMIZADAS
    utils: {
      prepareImageFile: OptimizedUtils.prepareImageFileOptimized,
      serializeData: OptimizedUtils.serializeData,
      deserializeData: OptimizedUtils.deserializeData
    },

    // 🚀 EXPORT API
    exportToExcel: (data) => optimizedInvoke('exportToExcel', data)
  };

  return api;
};

// 🚀 EXPOSICIÓN SEGURA CON MANEJO DE ERRORES OPTIMIZADO
console.log('[PRELOAD OPTIMIZADO] Iniciando exposición de APIs...');
console.log('[PRELOAD OPTIMIZADO] Context isolated:', process.contextIsolated);

if (process.contextIsolated) {
  try {
    console.log('[PRELOAD OPTIMIZADO] Creando API optimizada...');
    const electronAPI = exposeOptimizedElectronAPI();
    
    console.log('[PRELOAD OPTIMIZADO] API creada, verificando estructura...');
    console.log('[PRELOAD OPTIMIZADO] Categorias disponibles:', !!electronAPI.categorias);
    console.log('[PRELOAD OPTIMIZADO] Productos disponibles:', !!electronAPI.productos);
    console.log('[PRELOAD OPTIMIZADO] Ventas disponibles:', !!electronAPI.ventas);
    console.log('[PRELOAD OPTIMIZADO] Pedidos disponibles:', !!electronAPI.pedidos);

    contextBridge.exposeInMainWorld('electronAPI', electronAPI);
    console.log('[PRELOAD OPTIMIZADO] API expuesta exitosamente');
    
    // 🚀 VERIFICACIÓN ADICIONAL
    contextBridge.exposeInMainWorld('debugAPI', {
      test: () => 'API funcionando correctamente',
      checkElectronAPI: () => {
        try {
          return {
            hasCategorias: !!electronAPI.categorias,
            hasProductos: !!electronAPI.productos,
            hasVentas: !!electronAPI.ventas,
            hasPedidos: !!electronAPI.pedidos,
            categoriasMethods: Object.keys(electronAPI.categorias || {}),
            productosMethods: Object.keys(electronAPI.productos || {}),
            ventasMethods: Object.keys(electronAPI.ventas || {}),
            pedidosMethods: Object.keys(electronAPI.pedidos || {})
          };
        } catch (error) {
          return { error: error.message };
        }
      }
    });
  } catch (error) {
    console.error('[PRELOAD OPTIMIZADO] Failed to expose electronAPI:', error);
    
    // 🚀 FALLBACK MÍNIMO OPTIMIZADO
    contextBridge.exposeInMainWorld('electronAPI', {
      error: 'Failed to initialize optimized API',
      details: error.message,
      isFallback: true,
      isOptimized: false
    });
  }
} else {
  console.warn('[PRELOAD OPTIMIZADO] Context isolation is disabled! This is a security risk!');
  
  // 🚀 API MÍNIMA CUANDO LA AISLACIÓN DE CONTEXTO ESTÁ DESHABILITADA
  window.electronAPI = {
    error: 'Context isolation is disabled',
    isFallback: true,
    isOptimized: false
  };
}

// 🚀 APIs DE VENTAS OPTIMIZADAS
contextBridge.exposeInMainWorld('ventasAPI', {
	obtenerProductos: () => optimizedInvoke('ventas:obtener-productos'),
	buscarProductos: (query) => optimizedInvoke('ventas:buscar-productos', query),
	obtenerClientes: () => optimizedInvoke('ventas:obtener-clientes'),
	crearCliente: (clienteData) => optimizedInvoke('ventas:crear-cliente', clienteData),
	crearVenta: (ventaData) => optimizedInvoke('ventas:crear-venta', ventaData),
	obtenerVentas: () => optimizedInvoke('ventas:obtener-ventas'),
	obtenerResumen: () => optimizedInvoke('ventas:obtener-resumen'),
});

// ✅ API de reservas
contextBridge.exposeInMainWorld('reservasAPI', {
	crear: (data) => optimizedInvoke('reservas:crear', data),
	pago: (id, data) => optimizedInvoke('reservas:pago', id, data),
	finalizar: (id) => optimizedInvoke('reservas:finalizar', id),
	cancelar: (id) => optimizedInvoke('reservas:cancelar', id),
	listar: () => optimizedInvoke('reservas:listar'),
	obtener: (id) => optimizedInvoke('reservas:obtener', id),
});

// 🚀 APIs DE CLIENTES OPTIMIZADAS
contextBridge.exposeInMainWorld('clientesAPI', {
  obtenerTodos: () => optimizedInvoke('clientes:obtener-todos'),
  obtenerPorId: (clienteId) => optimizedInvoke('clientes:obtener-por-id', clienteId),
  crear: (clienteData) => optimizedInvoke('clientes:crear', clienteData),
  crearRapido: (clienteData) => optimizedInvoke('clientes:crear-rapido', clienteData),
  actualizar: (clienteId, clienteData) => optimizedInvoke('clientes:actualizar', clienteId, clienteData),
  eliminar: (clienteId) => optimizedInvoke('clientes:eliminar', clienteId),
  buscar: (query) => optimizedInvoke('clientes:buscar', query),
  obtenerVentas: (clienteId) => optimizedInvoke('clientes:obtener-ventas', clienteId),
  obtenerConVentas: (clienteId) => optimizedInvoke('clientes:obtener-con-ventas', clienteId),
  obtenerEstadisticas: () => optimizedInvoke('clientes:obtener-estadisticas'),
});

// 🚀 APIs DE PEDIDOS OPTIMIZADAS
contextBridge.exposeInMainWorld('pedidosAPI', {
  obtenerTodos: (params = {}) => optimizedInvoke('pedidos:obtener-todos', params),
  obtenerPorId: (pedidoId) => optimizedInvoke('pedidos:obtener-por-id', pedidoId),
  crear: (pedidoData) => optimizedInvoke('pedidos:crear', pedidoData),
  actualizar: (pedidoId, pedidoData) => optimizedInvoke('pedidos:actualizar', pedidoId, pedidoData),
  eliminar: (pedidoId) => optimizedInvoke('pedidos:eliminar', pedidoId),
  cambiarEstado: (pedidoId, estadoData) => optimizedInvoke('pedidos:cambiar-estado', pedidoId, estadoData),
  obtenerHistorial: (pedidoId) => optimizedInvoke('pedidos:obtener-historial', pedidoId),
  obtenerEstadisticas: () => optimizedInvoke('pedidos:obtener-estadisticas'),
  buscar: (query) => optimizedInvoke('pedidos:buscar', query),
});

// 🚀 APIs DE PDF OPTIMIZADAS
contextBridge.exposeInMainWorld('pdfAPI', {
  imprimir: (pdfBlob, fileName) => optimizedInvoke('pdf:print', pdfBlob, fileName),
  guardar: (pdfBlob, fileName) => optimizedInvoke('pdf:save', pdfBlob, fileName),
  imprimirRecibo: (ventaData) => optimizedInvoke('venta:imprimir-recibo', ventaData),
  obtenerImpresoraPorDefecto: () => optimizedInvoke('printer:get-default'),
  listarImpresoras: () => optimizedInvoke('printer:list'),
});

console.log('[PRELOAD OPTIMIZADO] Script cargado exitosamente');
console.log('[PRELOAD OPTIMIZADO] Todas las APIs expuestas correctamente');
