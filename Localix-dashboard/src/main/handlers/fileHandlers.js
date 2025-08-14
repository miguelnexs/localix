const { ipcMain, dialog } = require('electron')

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
}

module.exports = { initializeFileHandlers }
