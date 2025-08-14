---
name: API Issue
about: Report a problem with API functionality or suggest improvements
title: '[API] '
labels: 'api'
assignees: 'miguelnexs'

---

## 🌐 Reporte de API

### 🔍 Tipo de Problema

- [ ] **Endpoint**: Problema con endpoint específico
- [ ] **Autenticación**: Problema con autenticación API
- [ ] **Autorización**: Problema con permisos/roles
- [ ] **Validación**: Problema con validación de datos
- [ ] **Rendimiento**: Problema de rendimiento de API
- [ ] **Rate limiting**: Problema con límites de tasa
- [ ] **Documentación**: Problema con documentación API
- [ ] **Versionado**: Problema con versiones de API
- [ ] **Webhooks**: Problema con webhooks

### 📋 Descripción

Describe el problema de API de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de API tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Haz una petición a '....'
2. Usa método '....'
3. Envía datos '....'
4. Observa el error '....'

### 🌐 Información del Endpoint

- **URL**: [ej. /api/productos/productos/]
- **Método**: [GET, POST, PUT, DELETE, PATCH]
- **Versión**: [ej. v1, v2, Sin versión]
- **Parámetros**: [ej. page=1, search=producto, category=electronics]

### 🔐 Información de Autenticación

- **Tipo**: [ej. JWT, API Key, OAuth, Session]
- **Token**: [ej. Bearer token, API key en header, Cookie]
- **Usuario**: [ej. admin, user123, anonymous]
- **Permisos**: [ej. read, write, admin, superuser]

### 📝 Información de Request

- **Headers**: [ej. Content-Type: application/json, Authorization: Bearer token]
- **Body**: [ej. JSON, Form data, Multipart]
- **Query params**: [ej. page=1&size=10&search=producto]
- **Path params**: [ej. /api/productos/{id}/]

### 📤 Información de Response

- **Status code**: [ej. 200, 400, 401, 500]
- **Content-Type**: [ej. application/json, text/html, application/xml]
- **Body**: [ej. JSON response, Error message, HTML]
- **Headers**: [ej. X-Total-Count, X-Rate-Limit, Cache-Control]

### 🐛 Error de API

Si hay un error específico:

```json
{
  "error": "Validation failed",
  "status_code": 400,
  "details": {
    "name": ["This field is required"],
    "price": ["Must be a positive number"]
  },
  "timestamp": "2024-01-15T10:30:45Z"
}
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```json
// Request example
{
  "method": "POST",
  "url": "/api/productos/productos/",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "body": {
    "name": "Producto Test",
    "price": 99.99,
    "category": 1,
    "description": "Descripción del producto"
  }
}

// Response example
{
  "id": 123,
  "name": "Producto Test",
  "price": "99.99",
  "category": {
    "id": 1,
    "name": "Electronics"
  },
  "created_at": "2024-01-15T10:30:45Z"
}
```

### ⏱️ Información de Rendimiento

- **Tiempo de respuesta**: [ej. 5 segundos]
- **Tiempo esperado**: [ej. 1 segundo]
- **Tamaño de respuesta**: [ej. 2MB, 500KB]
- **Throughput**: [ej. 100 requests/segundo]

### 🎯 Área Afectada

- [ ] **Frontend**: Llamadas desde frontend
- [ ] **Backend**: Lógica del endpoint
- [ ] **Base de datos**: Consultas de base de datos
- [ ] **Middleware**: Middleware de autenticación/validación
- [ ] **Serialización**: Serialización de datos
- [ ] **Documentación**: Documentación de la API

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **DRF**: [ej. 3.14.0]
- **Base de datos**: [ej. PostgreSQL, MySQL, SQLite]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Herramienta de testing**: Postman, Insomnia, cURL
- **Response del error**: Respuesta de error completa
- **Headers**: Headers de request/response
- **Logs**: Logs del servidor

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar la API:

- **Nuevos endpoints**: Endpoints que te gustaría ver
- **Mejor documentación**: Mejoras en la documentación
- **Mejor rendimiento**: Optimizaciones
- **Mejor seguridad**: Mejoras de seguridad

### 🔗 Enlaces Útiles

- [Documentación de la API](https://github.com/miguelnexs/localix/wiki/api)
- [Guía de Autenticación](https://github.com/miguelnexs/localix/wiki/authentication)
- [Ejemplos de Uso](https://github.com/miguelnexs/localix/wiki/api-examples)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de API.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la API?
- **Frecuencia**: ¿Con qué frecuencia haces llamadas?
- **Propósito**: ¿Qué datos obtienes/modificas?

### 📊 Métricas de API

- **Requests por día**: [ej. 10,000 requests]
- **Tiempo promedio**: [ej. 500ms]
- **Tasa de éxito**: [ej. 95% exitosos]
- **Endpoints más usados**: [ej. /api/productos/, /api/ventas/]

### 🔄 Rate Limiting

- **Límites actuales**: [ej. 100 requests/minuto]
- **Límites esperados**: [ej. 1000 requests/minuto]
- **Comportamiento**: [ej. 429 Too Many Requests, 503 Service Unavailable]

### 📈 Versionado

- **Versión actual**: [ej. v1, v2]
- **Compatibilidad**: [ej. Backward compatible, Breaking changes]
- **Migración**: [ej. Guía de migración, Herramientas]

### 🔒 Seguridad

- **Autenticación**: [ej. JWT, API Key, OAuth]
- **Autorización**: [ej. Roles, Permisos, Scopes]
- **Validación**: [ej. Input validation, Output sanitization]
- **Rate limiting**: [ej. Por IP, Por usuario, Por endpoint]

---

**Gracias por reportar este problema de API. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para la integración de datos.** 🌐
