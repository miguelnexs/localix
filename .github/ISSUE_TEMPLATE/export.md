---
name: Export Issue
about: Report a problem with data export functionality
title: '[EXPORT] '
labels: 'export'
assignees: 'miguelnexs'

---

## 📤 Reporte de Exportación

### 🔍 Tipo de Problema

- [ ] **Excel**: Problema con exportación a Excel
- [ ] **CSV**: Problema con exportación a CSV
- [ ] **PDF**: Problema con exportación a PDF
- [ ] **JSON**: Problema con exportación a JSON
- [ ] **Datos faltantes**: Datos que no se incluyen en la exportación
- [ ] **Formato**: Problema con el formato de los datos
- [ ] **Rendimiento**: Exportación muy lenta
- [ ] **Archivo corrupto**: El archivo exportado está dañado
- [ ] **Permisos**: Problema con permisos de escritura

### 📋 Descripción

Describe el problema de exportación de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de exportación tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a '...'
2. Haz clic en 'Exportar Excel'
3. Selecciona '....'
4. Observa el error '....'

### 📊 Información de la Exportación

- **Tipo de archivo**: [Excel (.xlsx), CSV, PDF, JSON]
- **Datos exportados**: [Productos, Ventas, Clientes, etc.]
- **Filtros aplicados**: [ej. categoría=electronics, fecha=2024-01-01]
- **Cantidad de registros**: [ej. 1000 productos, 500 ventas]

### 📁 Información del Archivo

- **Nombre del archivo**: [ej. productos_localix_2024-01-15.xlsx]
- **Tamaño del archivo**: [ej. 2.5MB, 500KB]
- **Ubicación**: [ej. Descargas, Desktop, carpeta personalizada]
- **Permisos**: [ej. Solo lectura, Escritura]

### 🐛 Error de Exportación

Si hay un error durante la exportación:

```javascript
// Error en la consola
Error: Failed to export products
    at handleExportToExcel (ProductList.jsx:445)
    at onClick (ProductList.jsx:458)
```

### 📊 Datos Faltantes

Si faltan datos en la exportación:

- **Campos faltantes**: [ej. colores, imágenes, categorías]
- **Registros faltantes**: [ej. productos inactivos, ventas canceladas]
- **Relaciones faltantes**: [ej. información de clientes, categorías]

### 📈 Información de Rendimiento

Si la exportación es lenta:

- **Tiempo actual**: [ej. 30 segundos]
- **Tiempo esperado**: [ej. 5 segundos]
- **Cantidad de datos**: [ej. 10,000 productos]
- **Recursos**: [ej. CPU 80%, RAM 2GB]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de exportación
- [ ] **Backend**: Lógica de exportación
- [ ] **Electron**: Proceso de guardado
- [ ] **Librerías**: xlsx, csv-parser, etc.
- [ ] **Base de datos**: Consultas para exportación

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Node.js**: [ej. 18.0.0]
- **Electron**: [ej. 25.0.0]
- **Librerías**: [ej. xlsx 0.18.5, csv-parser 3.0.0]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de exportación**: Botón, diálogo, opciones
- **Error durante exportación**: Mensaje de error
- **Archivo resultante**: Vista previa del archivo exportado
- **Consola**: Errores en la consola del navegador

### 📝 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos que se están exportando
const exportData = [
  {
    id: 1,
    name: "Producto 1",
    price: 100,
    category: "Electronics",
    colors: ["Rojo", "Azul"] // ¿Se incluyen los colores?
  }
];
```

### 💡 Sugerencias de Solución

Si tienes ideas para solucionar el problema:

- **Formato**: Cambios en el formato de exportación
- **Datos**: Incluir/excluir campos específicos
- **Rendimiento**: Optimizaciones para exportaciones grandes
- **Interfaz**: Mejoras en la UI de exportación

### 🔗 Enlaces Útiles

- [Documentación de xlsx](https://github.com/SheetJS/sheetjs)
- [Guía de Exportación](https://github.com/miguelnexs/localix/wiki/export)
- [Troubleshooting](https://github.com/miguelnexs/localix/wiki/troubleshooting)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de exportación.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la exportación?
- **Volumen de datos**: ¿Cuántos registros exportas normalmente?
- **Frecuencia**: ¿Con qué frecuencia exportas datos?

---

**Gracias por reportar este problema de exportación. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para la gestión de datos.** 📤
