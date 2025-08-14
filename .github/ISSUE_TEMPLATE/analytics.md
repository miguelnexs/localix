---
name: Analytics Issue
about: Report a problem with analytics and reporting functionality
title: '[ANALYTICS] '
labels: 'analytics'
assignees: 'miguelnexs'

---

## 📈 Reporte de Analytics

### 🔍 Tipo de Problema

- [ ] **Reportes**: Problema con generación de reportes
- [ ] **Métricas**: Problema con cálculo de métricas
- [ ] **Gráficos**: Problema con visualizaciones de datos
- [ ] **Filtros**: Problema con filtros de análisis
- [ ] **Exportación**: Problema con exportación de reportes
- [ ] **Datos históricos**: Problema con datos históricos
- [ ] **Comparaciones**: Problema con comparaciones temporales
- [ ] **Tendencias**: Problema con análisis de tendencias
- [ ] **Predicciones**: Problema con predicciones/forecasting

### 📋 Descripción

Describe el problema de analytics de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de analytics tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a 'Analytics' o 'Reportes'
2. Selecciona '....'
3. Aplica filtros '....'
4. Observa el error '....'

### 📊 Información del Reporte

- **Tipo de reporte**: [ej. Ventas por período, Productos más vendidos, Análisis de clientes]
- **Período**: [ej. Últimos 30 días, Este año, Personalizado]
- **Filtros aplicados**: [ej. Categoría=Electronics, Cliente=VIP, Sin filtros]
- **Granularidad**: [ej. Diario, Semanal, Mensual, Anual]

### 📈 Información de Métricas

- **Métrica problemática**: [ej. Ventas totales, Margen de ganancia, Tasa de conversión]
- **Fórmula**: [ej. Suma de ventas, (Ingresos - Costos) / Ingresos]
- **Valor actual**: [ej. $15,000, 25%, 150 unidades]
- **Valor esperado**: [ej. $18,000, 30%, 200 unidades]
- **Fuente de datos**: [ej. Tabla ventas, Tabla productos, API externa]

### 📊 Información de Gráficos

- **Tipo de gráfico**: [ej. Línea temporal, Barras apiladas, Scatter plot, Heatmap]
- **Eje X**: [ej. Fechas, Categorías, Productos]
- **Eje Y**: [ej. Ventas, Cantidad, Porcentaje]
- **Series**: [ej. Ventas por día, Productos por categoría, Clientes por región]
- **Problema específico**: [ej. Datos faltantes, Escala incorrecta, Colores confusos]

### 🔍 Información de Filtros

- **Filtro problemático**: [ej. Rango de fechas, Categoría, Cliente]
- **Valores seleccionados**: [ej. 2024-01-01 a 2024-01-31, Electronics, Cliente VIP]
- **Comportamiento**: [ej. No filtra, Filtra incorrectamente, Error al aplicar]
- **Opciones disponibles**: [ej. Todas las categorías, Solo categorías activas]

### 📤 Información de Exportación

- **Formato**: [ej. Excel (.xlsx), PDF, CSV, JSON]
- **Datos incluidos**: [ej. Solo resumen, Datos detallados, Gráficos]
- **Tamaño del archivo**: [ej. 2MB, 500KB, Muy grande]
- **Calidad**: [ej. Datos correctos, Formato mal, Archivo corrupto]

### 🐛 Error de Analytics

Si hay un error durante el análisis:

```javascript
// Error en la consola
Error: Failed to generate report
    at generateAnalyticsReport (Analytics.jsx:123)
    at handleGenerateReport (Analytics.jsx:145)
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos del reporte
const analyticsData = {
  period: "2024-01-01 to 2024-01-31",
  totalSales: 15000.00,
  totalProducts: 250,
  topProducts: [
    { name: "Laptop HP", sales: 5000, quantity: 10 },
    { name: "Mouse Wireless", sales: 2000, quantity: 100 }
  ],
  salesByDay: [
    { date: "2024-01-15", sales: 500 },
    { date: "2024-01-16", sales: 750 }
  ]
};
```

### ⏱️ Información de Rendimiento

Si el análisis es lento:

- **Tiempo de generación**: [ej. 30 segundos]
- **Tiempo esperado**: [ej. 5 segundos]
- **Cantidad de datos**: [ej. 10,000 registros, 1,000 productos]
- **Recursos**: [ej. CPU 90%, RAM 4GB, Base de datos lenta]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de analytics
- [ ] **Backend**: Lógica de análisis
- [ ] **Base de datos**: Consultas complejas
- [ ] **API**: Endpoints de analytics
- [ ] **Caché**: Sistema de caché
- [ ] **Procesamiento**: Procesamiento de datos

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Base de datos**: [ej. PostgreSQL, MySQL, SQLite]
- **Librerías**: [ej. Pandas, NumPy, Matplotlib]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de analytics**: Vista general del reporte
- **Gráfico problemático**: Gráfico con problemas
- **Error durante análisis**: Mensaje de error
- **Consola**: Errores en la consola

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar los analytics:

- **Nuevas métricas**: Métricas que te gustaría ver
- **Nuevos reportes**: Tipos de reportes
- **Optimización**: Mejoras de rendimiento
- **Visualización**: Mejores gráficos

### 🔗 Enlaces Útiles

- [Guía de Analytics](https://github.com/miguelnexs/localix/wiki/analytics)
- [Reportes](https://github.com/miguelnexs/localix/wiki/reports)
- [Métricas](https://github.com/miguelnexs/localix/wiki/metrics)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de analytics.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente los analytics?
- **Frecuencia**: ¿Con qué frecuencia generas reportes?
- **Propósito**: ¿Qué decisiones basas en los analytics?

### 📊 Métricas Críticas

- **KPIs principales**: [ej. Ventas diarias, Margen de ganancia, Tasa de conversión]
- **Alertas**: [ej. Ventas bajas, Stock crítico, Clientes perdidos]
- **Tendencias**: [ej. Crecimiento mensual, Estacionalidad, Patrones]

### 🔄 Actualización de Datos

- **Frecuencia**: [ej. Tiempo real, Cada hora, Diario]
- **Fuente**: [ej. Base de datos, API externa, Archivos]
- **Procesamiento**: [ej. Batch, Streaming, Manual]

### 📈 Comparaciones

- **Período base**: [ej. Mes anterior, Año anterior, Promedio histórico]
- **Tipo de comparación**: [ej. Porcentual, Absoluta, Índice]
- **Significancia**: [ej. Estadísticamente significativo, Variación normal]

---

**Gracias por reportar este problema de analytics. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para el análisis de datos.** 📈
