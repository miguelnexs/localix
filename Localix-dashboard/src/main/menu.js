import { app, Menu, shell, dialog } from 'electron';
import { checkForUpdates } from 'electron-updater';

export function createMenu(mainWindow, autoUpdater) {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Nueva Venta',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-sale');
          }
        },
        {
          label: 'Nuevo Producto',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu-action', 'new-product');
          }
        },
        { type: 'separator' },
        {
          label: 'Configuración',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            mainWindow.webContents.send('menu-action', 'settings');
          }
        },
        { type: 'separator' },
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Editar',
      submenu: [
        { role: 'undo', label: 'Deshacer' },
        { role: 'redo', label: 'Rehacer' },
        { type: 'separator' },
        { role: 'cut', label: 'Cortar' },
        { role: 'copy', label: 'Copiar' },
        { role: 'paste', label: 'Pegar' },
        { role: 'selectall', label: 'Seleccionar Todo' }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollo' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Aumentar Zoom' },
        { role: 'zoomOut', label: 'Disminuir Zoom' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Herramientas',
      submenu: [
        {
          label: 'Verificar Actualizaciones',
          click: () => {
            if (autoUpdater) {
              autoUpdater.checkForUpdatesManually();
            }
          }
        },
        {
          label: 'Exportar Datos',
          click: () => {
            mainWindow.webContents.send('menu-action', 'export-data');
          }
        },
        {
          label: 'Importar Datos',
          click: () => {
            mainWindow.webContents.send('menu-action', 'import-data');
          }
        },
        { type: 'separator' },
        {
          label: 'Respaldar Base de Datos',
          click: () => {
            mainWindow.webContents.send('menu-action', 'backup-database');
          }
        },
        {
          label: 'Restaurar Base de Datos',
          click: () => {
            mainWindow.webContents.send('menu-action', 'restore-database');
          }
        }
      ]
    },
    {
      label: 'Ayuda',
      submenu: [
        {
          label: 'Acerca de Tienda App',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'Acerca de Tienda App',
              message: 'Tienda App',
              detail: `Versión: ${app.getVersion()}\n\nSistema de gestión de tienda completo con inventario, ventas y reportes.\n\nDesarrollado con Electron y React.`
            });
          }
        },
        {
          label: 'Documentación',
          click: () => {
            shell.openExternal('https://github.com/tu-usuario/tienda-app');
          }
        },
        {
          label: 'Reportar Problema',
          click: () => {
            shell.openExternal('https://github.com/tu-usuario/tienda-app/issues');
          }
        },
        { type: 'separator' },
        {
          label: 'Ver Licencia',
          click: () => {
            shell.openExternal('https://github.com/tu-usuario/tienda-app/blob/main/LICENSE');
          }
        }
      ]
    }
  ];

  // Agregar menú específico para macOS
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: `Acerca de ${app.getName()}` },
        { type: 'separator' },
        { role: 'services', label: 'Servicios' },
        { type: 'separator' },
        { role: 'hide', label: `Ocultar ${app.getName()}` },
        { role: 'hideothers', label: 'Ocultar Otros' },
        { role: 'unhide', label: 'Mostrar Todo' },
        { type: 'separator' },
        { role: 'quit', label: `Salir de ${app.getName()}` }
      ]
    });

    // Menú Ventana para macOS
    template.push({
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar' },
        { type: 'separator' },
        { role: 'front', label: 'Traer al Frente' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  return menu;
}
