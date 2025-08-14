---
name: Search Issue
about: Report a problem with search functionality or suggest improvements
title: '[SEARCH] '
labels: 'search'
assignees: 'miguelnexs'

---

## 🔍 Reporte de Búsqueda

### 🔍 Tipo de Problema

- [ ] **Búsqueda básica**: Problema con búsqueda simple
- [ ] **Búsqueda avanzada**: Problema con filtros avanzados
- [ ] **Búsqueda en tiempo real**: Problema con autocompletado
- [ ] **Resultados**: Problema con resultados de búsqueda
- [ ] **Filtros**: Problema con filtros de búsqueda
- [ ] **Ordenamiento**: Problema con ordenamiento de resultados
- [ ] **Paginación**: Problema con paginación de resultados
- [ ] **Rendimiento**: Problema de rendimiento en búsquedas
- [ ] **Sugerencias**: Problema con sugerencias de búsqueda

### 📋 Descripción

Describe el problema de búsqueda de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de búsqueda tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a '....'
2. Escribe '....' en el campo de búsqueda
3. Aplica filtros '....'
4. Observa el error '....'

### 🔎 Información de Búsqueda

- **Término de búsqueda**: [ej. "laptop", "camiseta roja", "cliente juan"]
- **Tipo de búsqueda**: [ej. Productos, Clientes, Ventas, Categorías]
- **Filtros aplicados**: [ej. Categoría=Electronics, Precio>100, Estado=Activo]
- **Ordenamiento**: [ej. Por nombre, Por precio, Por fecha]

### 📊 Información de Resultados

- **Resultados esperados**: [ej. 10 productos, 5 clientes, 20 ventas]
- **Resultados obtenidos**: [ej. 0 resultados, 50 resultados, Error]
- **Resultados incorrectos**: [ej. Productos no relacionados, Clientes equivocados]
- **Resultados faltantes**: [ej. Productos que deberían aparecer]

### ⚡ Información de Rendimiento

- **Tiempo de búsqueda**: [ej. 5 segundos]
- **Tiempo esperado**: [ej. 1 segundo]
- **Cantidad de datos**: [ej. 10,000 productos, 5,000 clientes]
- **Recursos**: [ej. CPU 80%, RAM 2GB, Base de datos lenta]

### 🔍 Información de Filtros

- **Filtro problemático**: [ej. Rango de precios, Categoría, Fecha]
- **Valores del filtro**: [ej. $100-$500, Electronics, Últimos 30 días]
- **Comportamiento**: [ej. No filtra, Filtra incorrectamente, Error]
- **Opciones disponibles**: [ej. Todas las categorías, Solo activos]

### 📱 Información de Dispositivos

- **Dispositivo**: [ej. Desktop, Tablet, Mobile]
- **Navegador**: [ej. Chrome, Firefox, Safari, Edge]
- **Versión**: [ej. Chrome 96, Firefox 95]
- **Resolución**: [ej. 1920x1080, 768x1024, 375x667]

### 🐛 Error de Búsqueda

Si hay un error durante la búsqueda:

```javascript
// Error en la consola
Error: Search failed
    at performSearch (Search.jsx:123)
    at handleSearch (Search.jsx:145)
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos de búsqueda
const searchData = {
  query: "laptop",
  filters: {
    category: "Electronics",
    priceRange: { min: 100, max: 1000 },
    status: "active"
  },
  results: [
    { id: 1, name: "Laptop HP", price: 500, category: "Electronics" },
    { id: 2, name: "Laptop Dell", price: 600, category: "Electronics" }
  ],
  totalResults: 2
};
```

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de búsqueda
- [ ] **Backend**: Lógica de búsqueda
- [ ] **Base de datos**: Consultas de búsqueda
- [ ] **API**: Endpoints de búsqueda
- [ ] **Índices**: Índices de búsqueda
- [ ] **Caché**: Sistema de caché

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Base de datos**: [ej. PostgreSQL, MySQL, SQLite]
- **Motor de búsqueda**: [ej. Elasticsearch, Solr, Búsqueda nativa]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de búsqueda**: Campo de búsqueda y filtros
- **Resultados problemáticos**: Resultados incorrectos o faltantes
- **Error durante búsqueda**: Mensaje de error
- **Consola**: Errores en la consola del navegador

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar la búsqueda:

- **Nuevos filtros**: Filtros que te gustaría ver
- **Mejor algoritmo**: Mejoras en el algoritmo de búsqueda
- **Autocompletado**: Sugerencias de búsqueda
- **Búsqueda avanzada**: Operadores de búsqueda

### 🔗 Enlaces Útiles

- [Guía de Búsqueda](https://github.com/miguelnexs/localix/wiki/search)
- [Filtros](https://github.com/miguelnexs/localix/wiki/search-filters)
- [Optimización](https://github.com/miguelnexs/localix/wiki/search-optimization)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de búsqueda.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la búsqueda?
- **Frecuencia**: ¿Con qué frecuencia haces búsquedas?
- **Propósito**: ¿Qué información buscas normalmente?

### 🔍 Tipos de Búsqueda

- **Búsqueda por texto**: [ej. Nombre de producto, Descripción]
- **Búsqueda por filtros**: [ej. Categoría, Precio, Estado]
- **Búsqueda combinada**: [ej. Texto + filtros]
- **Búsqueda avanzada**: [ej. Operadores booleanos, Rangos]

### 📊 Métricas de Búsqueda

- **Búsquedas por día**: [ej. 500 búsquedas]
- **Tiempo promedio**: [ej. 2 segundos]
- **Tasa de éxito**: [ej. 85% encuentran lo que buscan]
- **Términos populares**: [ej. "laptop", "camiseta", "cliente"]

### 🔄 Autocompletado

- **Sugerencias**: [ej. Basadas en historial, Basadas en popularidad]
- **Comportamiento**: [ej. Mientras escribes, Al hacer clic]
- **Fuente**: [ej. Base de datos, Cache, API externa]

### 📈 Optimización

- **Índices**: [ej. Índices de base de datos, Índices de texto]
- **Caché**: [ej. Resultados cacheados, Consultas cacheadas]
- **Compresión**: [ej. Datos comprimidos, Respuestas optimizadas]

---

**Gracias por reportar este problema de búsqueda. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para encontrar información rápidamente.** 🔍
