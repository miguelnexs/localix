const { ipcMain } = require('electron');
const axios = require('axios');
const FormData = require('form-data');
const { Buffer } = require('buffer');
const { handleApiError, API_BASE_URL } = require('./apiErrorHandler');

const AXIOS_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Cache-Control': 'no-cache'
  },
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024,    // 50MB
  timeout: 30000 // 30 segundos
};

module.exports = () => {
  // Limpiar categorías duplicadas "General"
  ipcMain.handle('categorias:cleanupDuplicateGeneral', async () => {
    try {
      console.log('🧹 Limpiando categorías "General" duplicadas...');
      
      // Obtener todas las categorías "General"
      const response = await axios.get(`${API_BASE_URL}/api/categorias/`, {
        params: { search: 'General', ordering: 'id' },
        ...AXIOS_CONFIG  
      });
      
      const categories = response.data.results || response.data || [];
      const generalCategories = categories.filter(cat => 
        cat.nombre.toLowerCase() === 'general' || cat.slug === 'general'
      );
      
      console.log(`📊 Encontradas ${generalCategories.length} categorías "General"`);
      
      if (generalCategories.length <= 1) {
        console.log('✅ No hay duplicados para limpiar');
        return generalCategories[0] || null;
      }
      
      // Mantener la primera (más antigua) y eliminar las demás
      const keepCategory = generalCategories[0];
      const duplicatesToDelete = generalCategories.slice(1);
      
      console.log(`🗑️ Eliminando ${duplicatesToDelete.length} categorías duplicadas...`);
      
      for (const duplicate of duplicatesToDelete) {
        try {
          await axios.delete(`${API_BASE_URL}/api/categorias/${duplicate.id}/`, AXIOS_CONFIG);
          console.log(`✅ Eliminada categoría duplicada ID: ${duplicate.id}`);
        } catch (deleteError) {
          console.error(`❌ Error eliminando categoría ID ${duplicate.id}:`, deleteError.response?.data);
          // Continuar con las siguientes aunque una falle
        }
      }
      
      console.log('✅ Limpieza completada. Categoría conservada:', keepCategory);
      return keepCategory;
      
    } catch (error) {
      console.error('❌ Error al limpiar categorías duplicadas:', error);
      throw new Error(await handleApiError(error));
    }
  });

  // Asegurar que existe la categoría "General" (simplificado y robusto)
  ipcMain.handle('categorias:ensureGeneral', async () => {
    try {
      console.log('🔍 Asegurando categoría "General"...');
      
      // Paso 1: Buscar si ya existe una categoría "General"
      let generalCategory = null;
      try {
        const searchResponse = await axios.get(`${API_BASE_URL}/api/categorias/`, {
          params: { search: 'General' },
          ...AXIOS_CONFIG
        });
        
        const categories = searchResponse.data.results || searchResponse.data || [];
        generalCategory = categories.find(cat => 
          cat.nombre.toLowerCase() === 'general'
        );
        
        if (generalCategory) {
          console.log('✅ Categoría "General" encontrada:', generalCategory.id);
          return generalCategory;
        }
      } catch (searchError) {
        console.warn('⚠️ Error buscando categoría "General":', searchError.message);
      }
      
      // Paso 2: Si no existe, crear una nueva
      if (!generalCategory) {
        console.log('🆕 Creando nueva categoría "General"...');
        try {
          // Usar FormData para evitar problemas de serialización
          const formData = new FormData();
          formData.append('nombre', 'General');
          formData.append('descripcion', 'Categoría general para productos sin clasificación específica');
          formData.append('activa', 'true');
          formData.append('orden', '0');
          
          const createResponse = await axios.post(`${API_BASE_URL}/api/categorias/`, formData, {
            ...AXIOS_CONFIG,
            headers: {
              ...AXIOS_CONFIG.headers,
              ...formData.getHeaders()
            }
          });
          
          generalCategory = createResponse.data;
          console.log('✅ Categoría "General" creada exitosamente:', generalCategory.id);
          return generalCategory;
          
        } catch (createError) {
          console.error('❌ Error creando categoría "General":', createError.response?.data || createError.message);
          
          // Si falla la creación, intentar buscar nuevamente (por si se creó en paralelo)
          try {
            const retryResponse = await axios.get(`${API_BASE_URL}/api/categorias/`, {
              params: { search: 'General' },
              ...AXIOS_CONFIG
            });
            
            const retryCategories = retryResponse.data.results || retryResponse.data || [];
            const retryGeneral = retryCategories.find(cat => 
              cat.nombre.toLowerCase() === 'general'
            );
            
            if (retryGeneral) {
              console.log('✅ Categoría "General" encontrada en reintento:', retryGeneral.id);
              return retryGeneral;
            }
          } catch (retryError) {
            console.error('❌ Error en reintento de búsqueda:', retryError.message);
          }
          
          // Si todo falla, devolver un error más descriptivo
          throw new Error(`No se pudo crear ni encontrar la categoría "General". Error: ${createError.response?.data?.nombre?.[0] || createError.message}`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error al asegurar categoría "General":', error);
      throw new Error(await handleApiError(error));
    }
  });

  // Listar categorías
  ipcMain.handle('categorias:listar', async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categorias/`, {
        params: { ordering: 'orden,nombre' },
        ...AXIOS_CONFIG
      });
      return response.data.results || response.data;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // Obtener una categoría
  ipcMain.handle('categorias:obtener', async (_, slug) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categorias/${slug}/`, AXIOS_CONFIG);
      return response.data;
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });

  // Crear categoría (mejorado)
  ipcMain.handle('categorias:crear', async (_, categoriaData) => {
    try {
      console.log('Handler: Creando categoría con datos:', categoriaData);
      
      // Validar que el nombre esté presente
      if (!categoriaData.nombre || categoriaData.nombre.trim() === '') {
        throw new Error('El nombre de la categoría es requerido');
      }

      let config = { ...AXIOS_CONFIG };
      const formData = new FormData();

      // Agregar campos básicos con validación
      formData.append('nombre', categoriaData.nombre.trim());
      formData.append('descripcion', categoriaData.descripcion || '');
      formData.append('activa', categoriaData.activa !== false ? 'true' : 'false');
      if (categoriaData.orden !== undefined && categoriaData.orden !== null) {
        formData.append('orden', categoriaData.orden.toString());
      }

      // Agregar imagen si existe
      if (categoriaData.imagen && categoriaData.imagen.data && categoriaData.imagen.name && categoriaData.imagen.type) {
        // imagen.data puede ser base64 o ArrayBuffer
        let buffer;
        if (typeof categoriaData.imagen.data === 'string') {
          // Si es base64
          buffer = Buffer.from(categoriaData.imagen.data, 'base64');
        } else if (categoriaData.imagen.data instanceof ArrayBuffer) {
          buffer = Buffer.from(categoriaData.imagen.data);
        } else if (Array.isArray(categoriaData.imagen.data)) {
          buffer = Buffer.from(categoriaData.imagen.data);
        } else {
          throw new Error('Formato de imagen no soportado');
        }
        formData.append('imagen', buffer, {
          filename: categoriaData.imagen.name,
          contentType: categoriaData.imagen.type
        });
      }

      // Axios config para FormData
      config.headers = {
        ...config.headers,
        ...formData.getHeaders()
      };

      console.log('Handler: Enviando FormData a backend');
      const response = await axios.post(`${API_BASE_URL}/api/categorias/`, formData, config);
      console.log('Handler: Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Handler: === ERROR EN CREAR CATEGORÍA ===');
      console.error('Handler: Error completo:', error);
      console.error('Handler: Error response:', error.response?.data);
      console.error('Handler: Error status:', error.response?.status);
      console.error('Handler: Error message:', error.message);
      
      if (error.response) {
        const { status, data } = error.response;
        console.error('Handler: Error response data:', data);
        console.error('Handler: Error response status:', status);
        
        if (status === 400 && data) {
          // Manejar errores de validación específicos
          if (data.nombre && Array.isArray(data.nombre)) {
            throw new Error(data.nombre[0]);
          } else if (data.slug && Array.isArray(data.slug)) {
            throw new Error(data.slug[0]);
          } else if (data.descripcion && Array.isArray(data.descripcion)) {
            throw new Error(data.descripcion[0]);
          } else if (typeof data === 'string') {
            throw new Error(data);
          } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
            throw new Error(data.non_field_errors[0]);
          } else {
            // Mostrar todos los errores disponibles
            const errorMessages = [];
            Object.keys(data).forEach(key => {
              if (Array.isArray(data[key])) {
                errorMessages.push(`${key}: ${data[key][0]}`);
              }
            });
            throw new Error(errorMessages.length > 0 ? errorMessages.join(', ') : 'Error de validación en el servidor');
          }
        } else if (status === 409) {
          throw new Error('Ya existe una categoría con ese nombre');
        } else if (status === 500) {
          // Error interno del servidor - intentar obtener más detalles
          const errorDetail = data?.error || data?.detail || data?.message || 'Error interno del servidor';
          console.error('Handler: Error interno del servidor:', errorDetail);
          throw new Error(`Error interno del servidor: ${errorDetail}`);
        } else {
          throw new Error(`Error del servidor: ${status} - ${data?.detail || data?.message || 'Error desconocido'}`);
        }
      } else if (error.request) {
        throw new Error('No se recibió respuesta del servidor. Verifica la conexión.');
      } else {
        throw new Error(error.message || 'Error desconocido al crear categoría');
      }
    }
  });

  // Actualizar categoría
  ipcMain.handle('categorias:actualizar', async (_, { slug, data }) => {
    try {
      console.log('Handler: Actualizando categoría:', slug);
      let config = { ...AXIOS_CONFIG };
      const formData = new FormData();
      formData.append('nombre', data.nombre || '');
      formData.append('descripcion', data.descripcion || '');
      formData.append('activa', data.activa ? 'true' : 'false');
      if (data.orden !== undefined) {
        formData.append('orden', data.orden.toString());
      }
      if (data.imagen && data.imagen.data && data.imagen.name && data.imagen.type) {
        let buffer;
        if (typeof data.imagen.data === 'string') {
          buffer = Buffer.from(data.imagen.data, 'base64');
        } else if (data.imagen.data instanceof ArrayBuffer) {
          buffer = Buffer.from(data.imagen.data);
        } else if (Array.isArray(data.imagen.data)) {
          buffer = Buffer.from(data.imagen.data);
        } else {
          throw new Error('Formato de imagen no soportado');
        }
        formData.append('imagen', buffer, {
          filename: data.imagen.name,
          contentType: data.imagen.type
        });
      }
      config.headers = {
        ...config.headers,
        ...formData.getHeaders()
      };
      const response = await axios.patch(`${API_BASE_URL}/api/categorias/${slug}/`, formData, config);
      console.log('Handler: Respuesta exitosa:', response.data);
      return response.data;
    } catch (error) {
      console.error('Handler: Error en actualizar categoría:', error);
      console.error('Handler: Error response:', error.response?.data);
      console.error('Handler: Error status:', error.response?.status);
      console.error('Handler: Error message:', error.message);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && data) {
          if (data.nombre && data.nombre[0]) {
            throw new Error(data.nombre[0]);
          } else if (typeof data === 'string') {
            throw new Error(data);
          } else {
            throw new Error('Error de validación en el servidor');
          }
        } else {
          throw new Error(`Error del servidor: ${status}`);
        }
      } else if (error.request) {
        throw new Error('No se recibió respuesta del servidor');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  });

  // Eliminar categoría (mejorado para manejar duplicados)
  ipcMain.handle('categorias:eliminar', async (_, slug) => {
    try {
      // Primero intentar eliminación normal por slug
      try {
        await axios.delete(`${API_BASE_URL}/api/categorias/${slug}/`, AXIOS_CONFIG);
        return { success: true, slug };
      } catch (deleteError) {
        // Si falla por múltiples objetos (duplicados), buscar por slug y eliminar por ID
        if (deleteError.response?.status === 500) {
          console.log(`⚠️ Error eliminando categoría "${slug}", intentando resolución por ID...`);
          
          // Buscar todas las categorías con ese slug
          const searchResponse = await axios.get(`${API_BASE_URL}/api/categorias/`, {
            params: { search: slug },
            ...AXIOS_CONFIG
          });
          
          const categories = searchResponse.data.results || searchResponse.data || [];
          const matchingCategories = categories.filter(cat => cat.slug === slug);
          
          if (matchingCategories.length > 0) {
            // Eliminar la primera encontrada
            const categoryToDelete = matchingCategories[0];
            console.log(`🗑️ Eliminando categoría por ID: ${categoryToDelete.id}`);
            
            await axios.delete(`${API_BASE_URL}/api/categorias/${categoryToDelete.id}/`, AXIOS_CONFIG);
            return { success: true, slug, deletedId: categoryToDelete.id };
          }
        }
        
        // Si no es el error de duplicados, relanzar el error original
        throw deleteError;
      }
    } catch (error) {
      console.error('❌ Error eliminando categoría:', error.response?.data);
      throw new Error(await handleApiError(error));
    }
  });
};