const { ipcMain, dialog } = require('electron')
const fs = require('fs')
const path = require('path')

function initializeFileHandlers() {
  ipcMain.handle('seleccionar-imagen', async () => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif', 'jpeg', 'webp'] }]
      })

      if (canceled || filePaths.length === 0) {
        return null // El usuario canceló la selección
      }

      return filePaths[0] // Devuelve la ruta del primer archivo seleccionado
    } catch (error) {
      console.error('Error al seleccionar imagen:', error)
      throw new Error('No se pudo seleccionar la imagen.')
    }
  })

  ipcMain.handle('loadImageAsBase64', async (event, imagePath) => {
    try {
      // Construir la ruta completa al archivo de imagen
      let appPath;
      
      if (process.env.NODE_ENV === 'development') {
        // En desarrollo: desde la raíz del proyecto
        appPath = path.join(__dirname, '..', '..', '..', '..', 'img', imagePath);
      } else {
        // En producción: desde los recursos de la app
        appPath = path.join(process.resourcesPath, 'app', 'img', imagePath);
      }
      
      console.log('Intentando cargar imagen desde:', appPath);
      
      // Verificar si el archivo existe
      if (!fs.existsSync(appPath)) {
        console.error('El archivo no existe:', appPath);
        
        // Intentar rutas alternativas
        const alternativePaths = [
          path.join(__dirname, '..', '..', '..', '..', '..', 'img', imagePath),
          path.join(__dirname, '..', '..', '..', '..', '..', '..', 'img', imagePath),
          path.join(process.cwd(), 'img', imagePath),
          path.join(process.cwd(), '..', 'img', imagePath)
        ];
        
        for (const altPath of alternativePaths) {
          if (fs.existsSync(altPath)) {
            console.log('Encontrado en ruta alternativa:', altPath);
            appPath = altPath;
            break;
          }
        }
      }
      
      // Leer el archivo como buffer
      const imageBuffer = fs.readFileSync(appPath)
      
      // Convertir a base64
      const base64 = imageBuffer.toString('base64')
      
      // Determinar el tipo MIME basado en la extensión
      const ext = path.extname(imagePath).toLowerCase()
      let mimeType = 'image/png' // por defecto
      
      if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg'
      else if (ext === '.gif') mimeType = 'image/gif'
      else if (ext === '.webp') mimeType = 'image/webp'
      
      // Retornar la URL de datos completa
      const dataUrl = `data:${mimeType};base64,${base64}`;
      console.log('Imagen cargada exitosamente como base64');
      return dataUrl;
    } catch (error) {
      console.error('Error al cargar imagen como base64:', error)
      console.error('Ruta intentada:', appPath)
      return null
    }
  })
}

module.exports = { initializeFileHandlers }
