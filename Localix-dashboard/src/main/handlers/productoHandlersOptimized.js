const { ipcMain, app } = require('electron');
const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const querystring = require('querystring');
const { handleApiError, API_BASE_URL } = require('./apiErrorHandler');
const { buildFormData } = require('./handlerUtils');
const sharp = require('sharp');
const crypto = require('crypto');

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
    timeout: 45000,
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

// 🚀 CACHE OPTIMIZADO
const apiCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos (aumentado de 30 segundos)
const BATCH_CACHE_DURATION = 10 * 60 * 1000; // 10 minutos para operaciones batch

// 🚀 CONFIGURACIÓN OPTIMIZADA PARA AXIOS
const AXIOS_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'max-age=300' // 5 minutos de cache HTTP
  },
  maxContentLength: 50 * 1024 * 1024,
  maxBodyLength: 50 * 1024 * 1024,
  timeout: 45000, // 45s para evitar timeouts en Render (cold starts)
  // 🚀 CONEXIONES REUTILIZABLES
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 10,
  maxFreeSockets: 5
};

// 🚀 CONFIGURACIÓN DE IMÁGENES OPTIMIZADA
const IMAGE_CONFIG = {
  MAX_SIZE_MB: 5, // Reducido de 10MB
  MIN_DIMENSION: 200, // Reducido de 300
  TARGET_DIMENSION: 1200, // Reducido de 2000
  QUALITY: 80, // Reducido de 85
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
};

// 🚀 CACHE INTELIGENTE CON PRIORIDADES
class SmartCache {
  constructor() {
    this.cache = new Map();
    this.accessCount = new Map();
    this.maxSize = 100; // Máximo 100 elementos en cache
  }

  get(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.duration) {
      this.accessCount.set(key, (this.accessCount.get(key) || 0) + 1);
      return cached.data;
    }
    return null;
  }

  set(key, data, duration = CACHE_DURATION) {
    // 🚀 LIMPIEZA AUTOMÁTICA SI EL CACHE ESTÁ LLENO
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration
    });
    this.accessCount.set(key, 1);
  }

  cleanup() {
    // Eliminar elementos menos accedidos
    const entries = Array.from(this.accessCount.entries())
      .sort((a, b) => a[1] - b[1])
      .slice(0, Math.floor(this.maxSize / 2));

    entries.forEach(([key]) => {
      this.cache.delete(key);
      this.accessCount.delete(key);
    });
  }

  clear() {
    this.cache.clear();
    this.accessCount.clear();
  }
}

const smartCache = new SmartCache();

// 🚀 FUNCIONES DE CACHE OPTIMIZADAS
const getCacheKey = (endpoint, params = {}) => {
  return `${endpoint}?${JSON.stringify(params)}`;
};

const getFromCache = (key) => {
  return smartCache.get(key);
};

const setCache = (key, data, duration = CACHE_DURATION) => {
  smartCache.set(key, data, duration);
};

// 🚀 PROCESAMIENTO DE IMÁGENES OPTIMIZADO
const processImageOptimized = async (imageBuffer) => {
  try {
    return await sharp(imageBuffer)
      .rotate()
      .resize({
        width: IMAGE_CONFIG.TARGET_DIMENSION,
        height: IMAGE_CONFIG.TARGET_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ 
        quality: IMAGE_CONFIG.QUALITY,
        progressive: true // 🚀 JPEG progresivo para mejor rendimiento
      })
      .withMetadata()
      .toBuffer();
  } catch (error) {
    throw new Error(`Error al procesar imagen: ${error.message}`);
  }
};

// 🚀 PREPARACIÓN DE IMAGEN OPTIMIZADA
const prepareImageForUploadOptimized = async (imageData) => {
  try {
    if (!imageData) {
      throw new Error('No se proporcionaron datos de imagen');
    }

    // 🚀 REUTILIZAR ARCHIVOS TEMPORALES EXISTENTES
    if (imageData.path && fs.existsSync(imageData.path)) {
      const stats = fs.statSync(imageData.path);
      return {
        path: imageData.path,
        type: imageData.type || 'image/jpeg',
        name: imageData.name || path.basename(imageData.path),
        size: stats.size,
        width: imageData.width,
        height: imageData.height,
        lastModified: imageData.lastModified || Date.now()
      };
    }

    if (!imageData.data) {
      throw new Error('No se proporcionaron datos de imagen válidos');
    }

    // 🚀 CONVERSIÓN OPTIMIZADA
    let imageBuffer;
    if (Buffer.isBuffer(imageData.data)) {
      imageBuffer = imageData.data;
    } else if (imageData.data instanceof Uint8Array) {
      imageBuffer = Buffer.from(imageData.data);
    } else if (Array.isArray(imageData.data)) {
      imageBuffer = Buffer.from(imageData.data);
    } else if (typeof imageData.data === 'string') {
      const base64Data = imageData.data.includes(',') ? 
        imageData.data.split(',')[1] : imageData.data;
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else {
      throw new Error('Formato de datos de imagen no soportado');
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      throw new Error('Los datos de imagen están vacíos');
    }

    // 🚀 VALIDACIÓN DE TAMAÑO
    if (imageBuffer.length > IMAGE_CONFIG.MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`El tamaño de la imagen excede el límite de ${IMAGE_CONFIG.MAX_SIZE_MB}MB`);
    }

    // 🚀 PROCESAMIENTO OPTIMIZADO
    const processedBuffer = await processImageOptimized(imageBuffer);
    const metadata = await sharp(processedBuffer).metadata();

    // 🚀 VALIDACIÓN DE DIMENSIONES
    if (metadata.width < IMAGE_CONFIG.MIN_DIMENSION || metadata.height < IMAGE_CONFIG.MIN_DIMENSION) {
      console.warn(`Advertencia: La imagen es menor que el tamaño recomendado de ${IMAGE_CONFIG.MIN_DIMENSION}x${IMAGE_CONFIG.MIN_DIMENSION} píxeles`);
    }

    // 🚀 DETERMINAR EXTENSIÓN Y TIPO MIME
    let ext, mimeType;
    switch (metadata.format) {
      case 'png':
        ext = '.png';
        mimeType = 'image/png';
        break;
      case 'webp':
        ext = '.webp';
        mimeType = 'image/webp';
        break;
      default:
        ext = '.jpg';
        mimeType = 'image/jpeg';
    }

    // 🚀 NOMBRE DE ARCHIVO OPTIMIZADO
    const originalName = imageData.name || 'image';
    const safeName = originalName.replace(/[^a-z0-9_.-]/gi, '_');
    const fileHash = crypto.createHash('md5').update(processedBuffer).digest('hex');
    const tempFileName = `product_${fileHash}_${safeName}${ext}`;
    const tempFilePath = path.join(app.getPath('temp'), tempFileName);

    // 🚀 GUARDAR ARCHIVO TEMPORAL
    await fsp.writeFile(tempFilePath, processedBuffer);

    return {
      path: tempFilePath,
      type: mimeType,
      name: tempFileName,
      width: metadata.width,
      height: metadata.height,
      size: processedBuffer.length,
      lastModified: imageData.lastModified || Date.now()
    };
  } catch (error) {
    console.error('Error en prepareImageForUploadOptimized:', error);
    throw new Error(`Error al preparar imagen: ${error.message}`);
  }
};

// 🚀 OPERACIONES BATCH OPTIMIZADAS
const batchOperations = {
  // 🚀 CARGAR PRODUCTOS Y CATEGORÍAS EN PARALELO
  loadProductsAndCategories: async (params = {}) => {
    try {
      const config = await createAuthenticatedConfig();
      const [productsResponse, categoriesResponse] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/productos/productos/`, {
          params: { ordering: '-fecha_creacion', ...params },
          ...config
        }),
        axios.get(`${API_BASE_URL}/api/categorias/categorias/`, config)
      ]);

      const products = productsResponse.status === 'fulfilled' ? productsResponse.value.data : [];
      const categories = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : [];

      return { products, categories };
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  },

  // 🚀 CARGAR PRODUCTO CON COLORES E IMÁGENES
  loadProductWithDetails: async (slug) => {
    try {
      const config = await createAuthenticatedConfig();
      const [productResponse, colorsResponse] = await Promise.allSettled([
        axios.get(`${API_BASE_URL}/api/productos/productos/${slug}/`, config),
        axios.get(`${API_BASE_URL}/api/productos/productos/${slug}/colores/`, config)
      ]);

      const product = productResponse.status === 'fulfilled' ? productResponse.value.data : null;
      const colors = colorsResponse.status === 'fulfilled' ? colorsResponse.value.data : [];

      return { product, colors };
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  }
};

/**
 * 🚀 CONFIGURACIÓN DE HANDLERS OPTIMIZADOS
 */
module.exports = function setupProductHandlersOptimized() {
  // 🚀 OBTENER LISTADO DE PRODUCTOS OPTIMIZADO
  ipcMain.handle('productos:listarOptimizado', async (_, params = {}) => {
    try {
      const cacheKey = getCacheKey('productos/listar', params);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      const response = await axios.get(`${API_BASE_URL}/api/productos/productos/`, {
        params: {
          ordering: '-fecha_creacion',
          ...params
        },
        ...config
      });
      
      setCache(cacheKey, response.data, BATCH_CACHE_DURATION);
      return response.data;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 OBTENER PRODUCTO CON DETALLES EN BATCH
  ipcMain.handle('productos:obtenerConDetalles', async (_, slug) => {
    try {
      const cacheKey = getCacheKey(`productos/${slug}/detalles`);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const result = await batchOperations.loadProductWithDetails(slug);
      setCache(cacheKey, result, CACHE_DURATION);
      return result;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 CARGAR PRODUCTOS Y CATEGORÍAS EN BATCH
  ipcMain.handle('productos:cargarProductosYCategorias', async (_, params = {}) => {
    try {
      const cacheKey = getCacheKey('productos/categorias/batch', params);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      const result = await batchOperations.loadProductsAndCategories(params);
      setCache(cacheKey, result, BATCH_CACHE_DURATION);
      return result;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 OBTENER UN PRODUCTO ESPECÍFICO OPTIMIZADO
  ipcMain.handle('productos:obtenerOptimizado', async (_, slug) => {
    try {
      const cacheKey = getCacheKey(`productos/${slug}`);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      const response = await axios.get(
        `${API_BASE_URL}/api/productos/productos/${slug}/`, 
        config
      );
      
      setCache(cacheKey, response.data, CACHE_DURATION);
      return response.data;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 OBTENER COLORES OPTIMIZADO
  ipcMain.handle('productos:obtenerColoresOptimizado', async (event, productId) => {
    try {
      const cacheKey = getCacheKey(`productos/${productId}/colores`);
      const cachedData = getFromCache(cacheKey);
      
      if (cachedData) {
        return cachedData;
      }
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const baseConfig = await createAuthenticatedConfig();
      const colorsConfig = {
        ...baseConfig,
        timeout: 20000, // ampliar para endpoints de colores
        headers: {
          ...baseConfig.headers,
          'Cache-Control': 'max-age=30'
        }
      };
      
      const response = await axios.get(`${API_BASE_URL}/api/productos/productos/${productId}/colores/`, colorsConfig);
      
      let coloresData = [];
      if (response.data && response.data.results) {
        coloresData = response.data.results;
      } else if (Array.isArray(response.data)) {
        coloresData = response.data;
      }
      
      const result = { success: true, data: coloresData };
      setCache(cacheKey, result, CACHE_DURATION);
      return result;
    } catch (error) {
      return handleApiError(error, 'Error al obtener colores del producto');
    }
  });

  // 🚀 SUBIR IMAGEN PRINCIPAL OPTIMIZADA
  ipcMain.handle('upload-producto-imagen-principal-optimizado', async (event, { slug, imageFile }) => {
    try {
      if (!slug) {
        throw new Error('Slug del producto es requerido');
      }
      if (!imageFile?.data) {
        throw new Error('Archivo de imagen es requerido');
      }

      const tempFile = await prepareImageForUploadOptimized(imageFile);
      
      const formData = new FormData();
      const fileStream = fs.createReadStream(tempFile.path);

      formData.append('imagen_principal', fileStream, {
        filename: tempFile.name,
        contentType: tempFile.type,
        knownLength: tempFile.size
      });

      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const baseConfig = await createAuthenticatedConfig();
      const config = {
        ...baseConfig,
        headers: {
          ...formData.getHeaders(),
          ...baseConfig.headers
        },
        onUploadProgress: (progressEvent) => {
          if (event) {
            event.sender.send('upload-progress', {
              loaded: progressEvent.loaded,
              total: progressEvent.total || tempFile.size,
              percentage: Math.round((progressEvent.loaded / (progressEvent.total || tempFile.size)) * 100)
            });
          }
        }
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/productos/productos/${slug}/upload_imagen_principal/`,
        formData,
        config
      );
      
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${slug}`);
      smartCache.cache.delete(cacheKey);
      
      await new Promise((resolve, reject) => {
        fileStream.on('close', resolve);
        fileStream.on('error', reject);
        fileStream.on('finish', resolve);
      });
      
      const result = response?.data || { success: true };
      return result;
    } catch (error) {
      const errorMessage = await handleApiError(error);
      throw new Error(errorMessage);
    } finally {
      // 🚀 LIMPIAR ARCHIVO TEMPORAL
      if (imageFile?.tempPath && fs.existsSync(imageFile.tempPath)) {
        fs.unlinkSync(imageFile.tempPath);
      }
    }
  });

  // 🚀 CREAR PRODUCTO OPTIMIZADO
  ipcMain.handle('productos:crearOptimizado', async (_, productData) => {
    try {
      if (!productData?.nombre) throw new Error('Nombre del producto es requerido');
      if (!productData?.sku || productData.sku.trim() === '') throw new Error('SKU del producto es requerido');
      if (!productData?.descripcion_corta || productData.descripcion_corta.trim() === '') throw new Error('Descripción corta es requerida');
      if (!productData?.descripcion_larga || productData.descripcion_larga.trim() === '') throw new Error('Descripción larga es requerida');
      if (!productData?.precio || productData.precio <= 0) throw new Error('Precio debe ser mayor a 0');
      if (!productData?.costo || productData.costo < 0) throw new Error('Costo debe ser mayor o igual a 0');
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      let config = await createAuthenticatedConfig();
      const formData = new FormData();

      // 🚀 AGREGAR CAMPOS BÁSICOS
      const basicFields = [
        'nombre', 'sku', 'tipo', 'estado', 'descripcion_corta', 'descripcion_larga',
        'precio', 'precio_comparacion', 'costo', 'gestion_stock', 'stock', 'stock_minimo',
        'peso', 'dimensiones', 'meta_titulo', 'meta_descripcion'
      ];

      basicFields.forEach(field => {
        if (productData[field] !== undefined) {
          formData.append(field, productData[field]?.toString() || '');
        }
      });
      
      if (productData.categoria_id) {
        formData.append('categoria_id', productData.categoria_id);
      }

      // 🚀 PROCESAR IMAGEN PRINCIPAL
      if (productData.imagen_principal?.data) {
        const tempFile = await prepareImageForUploadOptimized(productData.imagen_principal);
        formData.append('imagen_principal', fs.createReadStream(tempFile.path), {
          filename: tempFile.name,
          contentType: tempFile.type
        });
      }

      config.headers = {
        ...config.headers,
        ...formData.getHeaders()
      };

      try {
        const response = await axios.post(`${API_BASE_URL}/api/productos/productos/`, formData, config);
        
        // 🚀 LIMPIAR CACHE RELACIONADO
        smartCache.clear();
        
        return response.data;
      } catch (axiosError) {
        console.error('Handler Optimizado: === ERROR EN CREAR PRODUCTO ===');
        console.error('Handler Optimizado: Error status:', axiosError.response?.status);
        console.error('Handler Optimizado: Error message:', axiosError.message);
        
        // Extraer mensaje de error más específico
        let errorMessage = 'Error al crear el producto';
        if (axiosError.response?.data?.detail) {
          errorMessage = axiosError.response.data.detail;
        } else if (axiosError.response?.data?.error) {
          errorMessage = axiosError.response.data.error;
        } else if (axiosError.response?.data?.mensaje) {
          errorMessage = axiosError.response.data.mensaje;
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
        
        // Crear un nuevo error con un mensaje claro y serializable
        throw new Error(`Error al crear el producto: ${errorMessage}`);
      }
    } catch (error) {
      // Asegurar que el error sea serializable
      const errorMsg = error.message || 'Error desconocido';
      throw new Error(errorMsg);
    }
  });

  // 🚀 ACTUALIZAR PRODUCTO OPTIMIZADO
  ipcMain.handle('productos:actualizarOptimizado', async (_, { slug, productData }) => {
    try {
      if (!slug) throw new Error('Slug del producto es requerido');
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      let config = await createAuthenticatedConfig();
      const formData = new FormData();

      // 🚀 AGREGAR CAMPOS BÁSICOS
      const basicFields = [
        'nombre', 'sku', 'tipo', 'estado', 'descripcion_corta', 'descripcion_larga',
        'precio', 'precio_comparacion', 'costo', 'gestion_stock', 'stock', 'stock_minimo',
        'peso', 'dimensiones', 'meta_titulo', 'meta_descripcion'
      ];

      basicFields.forEach(field => {
        if (productData[field] !== undefined) {
          formData.append(field, productData[field]?.toString() || '');
        }
      });
      
      if (productData.categoria_id) {
        formData.append('categoria_id', productData.categoria_id);
      }

      // 🚀 PROCESAR IMAGEN PRINCIPAL
      if (productData.imagen_principal?.data) {
        const tempFile = await prepareImageForUploadOptimized(productData.imagen_principal);
        formData.append('imagen_principal', fs.createReadStream(tempFile.path), {
          filename: tempFile.name,
          contentType: tempFile.type
        });
      }

      config.headers = {
        ...config.headers,
        ...formData.getHeaders()
      };

      const response = await axios.patch(`${API_BASE_URL}/api/productos/productos/${slug}/`, formData, config);
      
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${slug}`);
      smartCache.cache.delete(cacheKey);
      
      return response.data;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 ELIMINAR PRODUCTO OPTIMIZADO
  ipcMain.handle('productos:eliminarOptimizado', async (_, slug) => {
    try {
      if (!slug) throw new Error('Slug del producto es requerido');
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      await axios.delete(
        `${API_BASE_URL}/api/productos/productos/${slug}/`, 
        config
      );
      
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${slug}`);
      smartCache.cache.delete(cacheKey);
      
      return { success: true, slug };
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // 🚀 LIMPIAR CACHE
  ipcMain.handle('productos:limpiarCacheOptimizado', async () => {
    try {
      smartCache.clear();
      return { success: true, message: 'Cache optimizado limpiado exitosamente' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 🚀 OBTENER ESTADÍSTICAS DE CACHE
  ipcMain.handle('productos:estadisticasCache', async () => {
    try {
      return {
        success: true,
        cacheSize: smartCache.cache.size,
        maxSize: smartCache.maxSize,
        accessCount: Object.fromEntries(smartCache.accessCount)
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // 🚀 COLORES OPTIMIZADOS
  // 🚀 CREAR COLOR OPTIMIZADO
  ipcMain.handle('productos:crearColor', async (event, productId, colorData) => {
    try {
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${productId}/colores`);
      smartCache.cache.delete(cacheKey);
      
      console.log('🚀 === CREANDO COLOR OPTIMIZADO ===');
      console.log('🚀 Product ID:', productId);
      console.log('🚀 Color data:', colorData);
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      // Preparar datos del color
      const colorFormData = {
        producto: productId,
        nombre: colorData.nombre,
        hex_code: colorData.hex_code,
        stock: colorData.stock || 0,
        orden: colorData.orden || 1,
        activo: colorData.activo !== undefined ? colorData.activo : true,
        es_principal: colorData.es_principal || false
      };
      
      console.log('🚀 Datos del color preparados:', colorFormData);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/productos/${productId}/colores/`, 
        querystring.stringify(colorFormData),
        {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log('🚀 Color creado exitosamente:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🚀 Error creando color:', error);
      return handleApiError(error, 'Error al crear color');
    }
  });

  // 🚀 ACTUALIZAR COLOR OPTIMIZADO
  ipcMain.handle('productos:actualizarColor', async (event, productId, colorId, colorData) => {
    try {
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${productId}/colores`);
      smartCache.cache.delete(cacheKey);
      
      console.log('🚀 === ACTUALIZANDO COLOR OPTIMIZADO ===');
      console.log('🚀 Product ID:', productId);
      console.log('🚀 Color ID:', colorId);
      console.log('🚀 Color data:', colorData);
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      // Preparar datos del color
      const colorFormData = {
        nombre: colorData.nombre,
        hex_code: colorData.hex_code,
        stock: colorData.stock || 0,
        orden: colorData.orden || 1,
        activo: colorData.activo !== undefined ? colorData.activo : true,
        es_principal: colorData.es_principal || false
      };
      
      console.log('🚀 Datos del color preparados para actualizar:', colorFormData);
      
      const response = await axios.put(
        `${API_BASE_URL}/api/productos/productos/${productId}/colores/${colorId}/`, 
        querystring.stringify(colorFormData),
        {
          ...config,
          headers: {
            ...config.headers,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log('🚀 Color actualizado exitosamente:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🚀 Error actualizando color:', error);
      return handleApiError(error, 'Error al actualizar color');
    }
  });

  // 🚀 ELIMINAR COLOR OPTIMIZADO
  ipcMain.handle('productos:eliminarColor', async (event, productId, colorId) => {
    try {
      // 🚀 LIMPIAR CACHE RELACIONADO
      const cacheKey = getCacheKey(`productos/${productId}/colores`);
      smartCache.cache.delete(cacheKey);
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      await axios.delete(`${API_BASE_URL}/api/productos/productos/${productId}/colores/${colorId}/`, config);
      return { success: true };
    } catch (error) {
      return handleApiError(error, 'Error al eliminar color');
    }
  });

  // 🚀 IMÁGENES DE COLORES OPTIMIZADAS
  // 🚀 OBTENER IMÁGENES OPTIMIZADO
  ipcMain.handle('productos:obtenerImagenes', async (event, colorId) => {
    try {
      console.log('🚀 === OBTENIENDO IMÁGENES OPTIMIZADO ===');
      console.log('🚀 Color ID:', colorId);
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      const response = await axios.get(`${API_BASE_URL}/api/productos/colores/${colorId}/imagenes/`, config);
      console.log('🚀 Respuesta del backend:', response.data);
      
      // 🚀 MANEJAR RESPUESTA PAGINADA DEL BACKEND
      let imagenesData = [];
      if (response.data && response.data.results) {
        imagenesData = response.data.results;
        console.log('🚀 Imágenes obtenidas (paginadas):', imagenesData.length);
      } else if (Array.isArray(response.data)) {
        imagenesData = response.data;
        console.log('🚀 Imágenes obtenidas (array directo):', imagenesData.length);
      } else {
        console.log('🚀 Formato de respuesta inesperado:', typeof response.data);
        imagenesData = [];
      }
      
      return { success: true, data: imagenesData };
    } catch (error) {
      console.error('🚀 Error obteniendo imágenes:', error);
      return handleApiError(error, 'Error al obtener imágenes del color');
    }
  });

  // 🚀 SUBIR IMAGEN OPTIMIZADO
  ipcMain.handle('productos:subirImagen', async (event, colorId, formData) => {
    try {
      console.log('🚀 === SUBIENDO IMAGEN OPTIMIZADO ===');
      console.log('🚀 Color ID:', colorId);
      console.log('🚀 FormData recibido:', formData);
      
      // Verificar que se recibió la imagen
      if (!formData || !formData.imagen) {
        console.error('🚀 No se recibió formData o formData.imagen');
        throw new Error('Image is required');
      }
      
      // Verificar que la imagen tiene datos
      if (!formData.imagen.data || !Array.isArray(formData.imagen.data)) {
        console.error('🚀 No se recibieron datos de imagen válidos');
        throw new Error('Image data is required');
      }
      
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      // Preparar FormData para la subida
      const uploadFormData = new FormData();
      
      // Agregar archivo de imagen
      const imageFile = formData.imagen;
      console.log('🚀 Archivo de imagen:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size,
        dataLength: imageFile.data.length
      });
      
      // Convertir el archivo a Buffer
      let imageBuffer;
      if (imageFile.data && Array.isArray(imageFile.data)) {
        imageBuffer = Buffer.from(imageFile.data);
      } else if (imageFile.data instanceof Buffer) {
        imageBuffer = imageFile.data;
      } else {
        throw new Error('Formato de datos de imagen no soportado');
      }
      
      // Agregar archivo al FormData
      uploadFormData.append('imagen', imageBuffer, {
        filename: imageFile.name,
        contentType: imageFile.type
      });
      
      // Agregar campos adicionales si existen
      if (formData.orden !== undefined) {
        uploadFormData.append('orden', formData.orden.toString());
      }
      if (formData.es_principal !== undefined) {
        uploadFormData.append('es_principal', formData.es_principal.toString());
      }
      
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/colores/${colorId}/imagenes/`,
        uploadFormData,
        {
          ...config,
          headers: {
            ...uploadFormData.getHeaders(),
            ...config.headers
          }
        }
      );
      
      console.log('🚀 Imagen subida exitosamente:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('🚀 Error subiendo imagen:', error);
      return handleApiError(error, 'Error al subir imagen');
    }
  });

  // 🚀 ELIMINAR IMAGEN OPTIMIZADO
  ipcMain.handle('productos:eliminarImagen', async (event, colorId, imagenId) => {
    try {
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      await axios.delete(`${API_BASE_URL}/api/productos/colores/${colorId}/imagenes/${imagenId}/`, config);
      return { success: true };
    } catch (error) {
      return handleApiError(error, 'Error al eliminar imagen');
    }
  });

  // 🚀 ESTABLECER IMAGEN PRINCIPAL OPTIMIZADO
  ipcMain.handle('productos:establecerImagenPrincipal', async (event, colorId, imagenId) => {
    try {
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/colores/${colorId}/imagenes/${imagenId}/establecer_principal/`,
        {},
        config
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error, 'Error al establecer imagen principal');
    }
  });

  // 🚀 REORDENAR IMÁGENES OPTIMIZADO
  ipcMain.handle('productos:reordenarImagenes', async (event, colorId, ordenData) => {
    try {
      // 🚀 OBTENER CONFIGURACIÓN AUTENTICADA
      const config = await createAuthenticatedConfig();
      
      const response = await axios.post(
        `${API_BASE_URL}/api/productos/colores/${colorId}/imagenes/reordenar/`,
        ordenData,
        config
      );
      return { success: true, data: response.data };
    } catch (error) {
      return handleApiError(error, 'Error al reordenar imágenes');
    }
  });
};
