const { ipcMain, app } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');
const { handleApiError, API_BASE_URL } = require('./apiErrorHandler');
const { buildFormData } = require('./handlerUtils');

const AXIOS_CONFIG = {
  headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' },
  timeout: 30000
};

module.exports = () => {
  // --- MANEJO DE VARIANTES INDIVIDUALES ---

  const createOrUpdateVariante = async (url, data, method) => {
    const tempFiles = [];
    try {
      const formData = new FormData();

      // Manejar imágenes de la variante si existen
      if (data.images && Array.isArray(data.images)) {
        for (let i = 0; i < data.images.length; i++) {
          const img = data.images[i];
          if (img.buffer) {
            const tempPath = path.join(app.getPath('temp'), `variant_${Date.now()}_${i}_${img.name}`);
            await fs.writeFile(tempPath, Buffer.from(img.buffer));
            // Reemplazamos el objeto de imagen por el stream para buildFormData
            data.images[i] = require('fs').createReadStream(tempPath);
            tempFiles.push(tempPath);
          }
        }
      }

      buildFormData(formData, data);

      const config = {
        method,
        url,
        data: formData,
        headers: { ...formData.getHeaders(), ...AXIOS_CONFIG.headers },
        ...AXIOS_CONFIG
      };

      const response = await axios(config);
      return response.data;

    } catch (error) {
      throw new Error(await handleApiError(error));
    } finally {
      for (const filePath of tempFiles) {
        try {
          await fs.unlink(filePath);
        } catch (e) {
          console.error(`Error al eliminar archivo temporal: ${filePath}`, e);
        }
      }
    }
  };

  // Crear una nueva variante para un producto existente
  ipcMain.handle('variantes:crear', async (_, { productoSlug, data }) => {
    const url = `${API_BASE_URL}/api/productos/${productoSlug}/variantes/`;
    return createOrUpdateVariante(url, data, 'POST');
  });

  // Actualizar una variante por su ID
  ipcMain.handle('variantes:actualizar', async (_, { id, data }) => {
    const url = `${API_BASE_URL}/api/productos/variantes/${id}/`;
    return createOrUpdateVariante(url, data, 'PATCH');
  });

  // Eliminar una variante por su ID
  ipcMain.handle('variantes:eliminar', async (_, id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/productos/variantes/${id}/`, AXIOS_CONFIG);
      return { success: true, id };
    } catch (error) {
      throw new Error(await handleApiError(error));
    }
  });
};