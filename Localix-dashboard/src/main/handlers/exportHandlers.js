const { ipcMain, dialog } = require('electron');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

// Función auxiliar para exportar a Excel
async function exportToExcel(event, { data, fileName, sheetName = 'Datos' }) {
  try {
    // Crear un nuevo libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Convertir los datos a formato de hoja de cálculo
    const worksheet = XLSX.utils.json_to_sheet(data);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    
    // Mostrar diálogo para guardar archivo
    const result = await dialog.showSaveDialog({
      title: 'Guardar archivo Excel',
      defaultPath: fileName,
      filters: [
        { name: 'Archivos Excel', extensions: ['xlsx'] },
        { name: 'Todos los archivos', extensions: ['*'] }
      ]
    });
    
    if (result.canceled) {
      return { success: false, message: 'Exportación cancelada' };
    }
    
    // Escribir el archivo
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    fs.writeFileSync(result.filePath, buffer);
    
    return { 
      success: true, 
      message: 'Archivo exportado exitosamente',
      filePath: result.filePath 
    };
    
  } catch (error) {
    console.error('Error al exportar a Excel:', error);
    return { 
      success: false, 
      message: 'Error al exportar: ' + error.message 
    };
  }
}

// Función para exportar datos a Excel
ipcMain.handle('exportToExcel', async (event, { data, fileName, sheetName = 'Datos' }) => {
  return await exportToExcel(event, { data, fileName, sheetName });
});

// Función específica para exportar productos
ipcMain.handle('exportProductsToExcel', async (event, { products, fileName }) => {
  try {
    // Preparar datos para Excel
    const excelData = products.map(product => ({
      'ID': product.id,
      'Nombre': product.nombre,
      'SKU': product.sku || '',
      'Descripción': product.descripcion || '',
      'Precio': product.precio || 0,
      'Precio de Comparación': product.precio_comparacion || '',
      'Stock Total': product.gestion_stock ? (product.stock_total_calculado || product.stock || 0) : 'Sin gestión',
      'Stock Mínimo': product.stock_minimo || '',
      'Estado': product.estado || '',
      'Categoría': product.categoria?.nombre || '',
      'Tipo': product.tipo || '',
      'Fecha de Creación': product.fecha_creacion ? new Date(product.fecha_creacion).toLocaleDateString('es-ES') : '',
      'Última Actualización': product.fecha_actualizacion ? new Date(product.fecha_actualizacion).toLocaleDateString('es-ES') : '',
      'Peso (g)': product.peso || '',
      'Dimensiones': product.dimensiones || '',
      'Material': product.material || '',
      'Marca': product.marca || '',
      'Modelo': product.modelo || '',
      'Año': product.ano || '',
      'Color': product.color || '',
      'Talla': product.talla || '',
      'Género': product.genero || '',
      'Edad': product.edad || '',
      'Temporada': product.temporada || '',
      'Etiquetas': product.etiquetas || '',
      'Meta Título': product.meta_titulo || '',
      'Meta Descripción': product.meta_descripcion || '',
      'URL': product.url || '',
      'Activo': product.activo ? 'Sí' : 'No',
      'Destacado': product.destacado ? 'Sí' : 'No',
      'Nuevo': product.nuevo ? 'Sí' : 'No',
      'Oferta': product.oferta ? 'Sí' : 'No'
    }));

    // Llamar a la función general de exportación
    return await exportToExcel(event, {
      data: excelData,
      fileName: fileName,
      sheetName: 'Productos'
    });
    
  } catch (error) {
    console.error('Error al exportar productos:', error);
    return { 
      success: false, 
      message: 'Error al exportar productos: ' + error.message 
    };
  }
});

// Función para configurar los handlers de exportación
function setupExportHandlers() {
  console.log('[EXPORT HANDLERS] Configurando handlers de exportación...');
  
  // Los handlers ya están registrados arriba con ipcMain.handle
  console.log('[EXPORT HANDLERS] ✅ Handlers de exportación configurados');
}

module.exports = {
  setupExportHandlers
};
