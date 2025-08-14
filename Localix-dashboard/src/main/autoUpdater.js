import { autoUpdater } from 'electron-updater';
import { app, dialog, BrowserWindow } from 'electron';
import log from 'electron-log';

// Configurar logging para auto-updater
log.transports.file.level = 'info';
autoUpdater.logger = log;

class AutoUpdater {
  constructor() {
    this.mainWindow = null;
    this.setupAutoUpdater();
  }

  setMainWindow(window) {
    this.mainWindow = window;
  }

  setupAutoUpdater() {
    // Configurar eventos del auto-updater
    autoUpdater.on('checking-for-update', () => {
      log.info('Buscando actualizaciones...');
      this.sendStatusToWindow('Buscando actualizaciones...');
    });

    autoUpdater.on('update-available', (info) => {
      log.info('Actualización disponible:', info);
      this.sendStatusToWindow('Actualización disponible');
      
      dialog.showMessageBox({
        type: 'info',
        title: 'Actualización Disponible',
        message: 'Hay una nueva versión disponible. ¿Deseas descargarla ahora?',
        buttons: ['Sí', 'No'],
        defaultId: 0
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.downloadUpdate();
        }
      });
    });

    autoUpdater.on('update-not-available', (info) => {
      log.info('No hay actualizaciones disponibles:', info);
      this.sendStatusToWindow('No hay actualizaciones disponibles');
    });

    autoUpdater.on('error', (err) => {
      log.error('Error en auto-updater:', err);
      this.sendStatusToWindow('Error al buscar actualizaciones');
      
      dialog.showErrorBox(
        'Error de Actualización',
        'No se pudo verificar las actualizaciones. Por favor, verifica tu conexión a internet.'
      );
    });

    autoUpdater.on('download-progress', (progressObj) => {
      let logMessage = `Velocidad de descarga: ${progressObj.bytesPerSecond}`;
      logMessage = `${logMessage} - Descargado ${progressObj.percent}%`;
      logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`;
      log.info(logMessage);
      
      this.sendStatusToWindow(`Descargando... ${Math.round(progressObj.percent)}%`);
    });

    autoUpdater.on('update-downloaded', (info) => {
      log.info('Actualización descargada:', info);
      this.sendStatusToWindow('Actualización descargada');
      
      dialog.showMessageBox({
        type: 'info',
        title: 'Actualización Descargada',
        message: 'La actualización se ha descargado. La aplicación se reiniciará para aplicar los cambios.',
        buttons: ['Reiniciar Ahora', 'Más Tarde'],
        defaultId: 0
      }).then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }

  sendStatusToWindow(text) {
    if (this.mainWindow) {
      this.mainWindow.webContents.send('auto-updater-status', text);
    }
  }

  checkForUpdates() {
    log.info('Verificando actualizaciones...');
    
    // Configurar opciones de actualización
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;
    
    // Verificar actualizaciones
    autoUpdater.checkForUpdates().catch((err) => {
      log.error('Error al verificar actualizaciones:', err);
    });
  }

  // Método para verificar actualizaciones manualmente
  checkForUpdatesManually() {
    log.info('Verificación manual de actualizaciones...');
    
    dialog.showMessageBox({
      type: 'info',
      title: 'Verificando Actualizaciones',
      message: 'Buscando actualizaciones disponibles...',
      buttons: ['OK']
    });
    
    this.checkForUpdates();
  }
}

export default AutoUpdater;
