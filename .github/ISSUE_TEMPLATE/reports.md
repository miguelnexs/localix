---
name: Reports Issue
about: Report a problem with reports functionality or suggest improvements
title: '[REPORTS] '
labels: 'reports'
assignees: 'miguelnexs'

---

## 📋 Reporte de Reportes

### 🔍 Tipo de Problema

- [ ] **Generación**: Problema al generar reportes
- [ ] **Formato**: Problema con formato de reportes
- [ ] **Datos**: Problema con datos en reportes
- [ ] **Plantillas**: Problema con plantillas de reportes
- [ ] **Programación**: Problema con reportes programados
- [ ] **Distribución**: Problema con envío de reportes
- [ ] **Almacenamiento**: Problema con almacenamiento de reportes
- [ ] **Acceso**: Problema con acceso a reportes
- [ ] **Personalización**: Problema con personalización de reportes

### 📋 Descripción

Describe el problema de reportes de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de reportes tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a 'Reportes'
2. Selecciona '....'
3. Configura '....'
4. Observa el error '....'

### 📊 Información del Reporte

- **Tipo de reporte**: [ej. Ventas diarias, Inventario, Clientes, Financiero]
- **Período**: [ej. Hoy, Esta semana, Este mes, Personalizado]
- **Filtros**: [ej. Categoría específica, Cliente VIP, Productos activos]
- **Granularidad**: [ej. Detallado, Resumen, Ejecutivo]

### 📄 Información de Formato

- **Formato actual**: [ej. PDF, Excel, CSV, HTML]
- **Formato esperado**: [ej. PDF, Excel, CSV, HTML]
- **Tamaño**: [ej. 2MB, 500KB, Muy grande]
- **Calidad**: [ej. Alta resolución, Baja resolución, No se puede leer]

### 📊 Información de Datos

- **Datos incluidos**: [ej. Solo resumen, Datos detallados, Gráficos]
- **Datos faltantes**: [ej. Ventas de ayer, Productos específicos, Clientes]
- **Datos incorrectos**: [ej. Totales mal calculados, Fechas incorrectas]
- **Datos duplicados**: [ej. Registros repetidos, Líneas duplicadas]

### 🎨 Información de Plantillas

- **Plantilla**: [ej. Reporte estándar, Reporte ejecutivo, Reporte personalizado]
- **Elementos**: [ej. Encabezado, Pie de página, Logo, Gráficos]
- **Estilo**: [ej. Colores, Fuentes, Layout, Branding]
- **Personalización**: [ej. Campos personalizados, Filtros específicos]

### ⏰ Información de Programación

- **Frecuencia**: [ej. Diario, Semanal, Mensual, Personalizado]
- **Hora**: [ej. 9:00 AM, 6:00 PM, Medianoche]
- **Destinatarios**: [ej. admin@example.com, gerente@example.com]
- **Estado**: [ej. Activo, Pausado, Error]

### 📤 Información de Distribución

- **Método**: [ej. Email, Descarga, API, FTP]
- **Destinatarios**: [ej. Usuarios específicos, Roles, Todos]
- **Formato de envío**: [ej. Adjunto, Enlace, Embed]
- **Confirmación**: [ej. Email de confirmación, Log de envío]

### 🗄️ Información de Almacenamiento

- **Ubicación**: [ej. Base de datos, Sistema de archivos, Cloud]
- **Retención**: [ej. 30 días, 1 año, Indefinido]
- **Acceso**: [ej. Solo administradores, Usuarios autorizados, Público]
- **Backup**: [ej. Automático, Manual, No disponible]

### 🐛 Error de Reportes

Si hay un error durante la generación:

```javascript
// Error en la consola
Error: Failed to generate report
    at generateReport (Reports.jsx:123)
    at handleGenerate (Reports.jsx:145)
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos del reporte
const reportData = {
  title: "Reporte de Ventas - Enero 2024",
  period: "2024-01-01 to 2024-01-31",
  summary: {
    totalSales: 15000.00,
    totalOrders: 150,
    averageOrder: 100.00
  },
  details: [
    { date: "2024-01-15", sales: 500, orders: 5 },
    { date: "2024-01-16", sales: 750, orders: 8 }
  ]
};
```

### ⏱️ Información de Rendimiento

Si la generación es lenta:

- **Tiempo de generación**: [ej. 5 minutos]
- **Tiempo esperado**: [ej. 30 segundos]
- **Cantidad de datos**: [ej. 10,000 registros, 1,000 productos]
- **Recursos**: [ej. CPU 90%, RAM 4GB, Disco lento]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de reportes
- [ ] **Backend**: Lógica de generación
- [ ] **Base de datos**: Consultas de reportes
- [ ] **API**: Endpoints de reportes
- [ ] **Sistema de archivos**: Almacenamiento
- [ ] **Email**: Sistema de envío

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Librerías**: [ej. ReportLab, WeasyPrint, xlsxwriter]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de reportes**: Vista general
- **Reporte generado**: Vista previa del reporte
- **Error durante generación**: Mensaje de error
- **Configuración**: Configuración del reporte

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar los reportes:

- **Nuevos tipos**: Tipos de reportes que te gustaría ver
- **Mejores formatos**: Formatos adicionales
- **Automatización**: Procesos automáticos
- **Personalización**: Opciones de personalización

### 🔗 Enlaces Útiles

- [Guía de Reportes](https://github.com/miguelnexs/localix/wiki/reports)
- [Plantillas](https://github.com/miguelnexs/localix/wiki/report-templates)
- [Programación](https://github.com/miguelnexs/localix/wiki/scheduled-reports)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de reportes.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente los reportes?
- **Frecuencia**: ¿Con qué frecuencia generas reportes?
- **Propósito**: ¿Para qué usas los reportes?

### 📊 Tipos de Reportes

- **Reportes críticos**: [ej. Ventas diarias, Stock bajo, Errores]
- **Reportes periódicos**: [ej. Mensual, Trimestral, Anual]
- **Reportes bajo demanda**: [ej. Análisis específico, Investigación]

### 🔄 Automatización

- **Reportes automáticos**: [ej. Diarios, Semanales, Mensuales]
- **Triggers**: [ej. Eventos específicos, Condiciones]
- **Notificaciones**: [ej. Email, SMS, Push]

### 📈 Métricas de Reportes

- **Tiempo de generación**: [ej. Promedio 2 minutos]
- **Tasa de éxito**: [ej. 95% exitosos]
- **Uso**: [ej. 50 reportes por día]
- **Almacenamiento**: [ej. 1GB por mes]

---

**Gracias por reportar este problema de reportes. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para la generación de reportes.** 📋
