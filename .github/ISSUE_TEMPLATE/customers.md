---
name: Customers Issue
about: Report a problem with customer management or suggest improvements
title: '[CUSTOMERS] '
labels: 'customers'
assignees: 'miguelnexs'

---

## 👥 Reporte de Clientes

### 🔍 Tipo de Problema

- [ ] **Crear cliente**: Problema al crear un nuevo cliente
- [ ] **Editar cliente**: Problema al editar información del cliente
- [ ] **Eliminar cliente**: Problema al eliminar un cliente
- [ ] **Buscar cliente**: Problema con búsqueda de clientes
- [ ] **Historial**: Problema con historial de compras
- [ ] **Estadísticas**: Problema con estadísticas del cliente
- [ ] **Importar**: Problema con importación de clientes
- [ ] **Exportar**: Problema con exportación de clientes
- [ ] **Validación**: Problema con validación de datos

### 📋 Descripción

Describe el problema de clientes de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de clientes tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a 'Clientes'
2. Haz clic en '....'
3. Ingresa '....'
4. Observa el error '....'

### 👤 Información del Cliente

- **Nombre**: [ej. Juan Pérez, María García]
- **Email**: [ej. juan@example.com, maria@example.com]
- **Teléfono**: [ej. +1234567890, +0987654321]
- **Dirección**: [ej. Calle Principal 123, Ciudad]
- **Tipo**: [Cliente regular, Cliente VIP, Cliente corporativo]

### 📊 Información de Compras

- **Total de compras**: [ej. 15 compras, 0 compras]
- **Valor total**: [ej. $1,500.00, €2,000.00]
- **Última compra**: [ej. 2024-01-15, Nunca]
- **Productos favoritos**: [ej. Camisetas, Laptops, Sin preferencias]

### 🔍 Información de Búsqueda

- **Término de búsqueda**: [ej. "Juan", "juan@example.com", "1234567890"]
- **Filtros aplicados**: [ej. Cliente VIP, Últimos 30 días, Sin filtros]
- **Resultados esperados**: [ej. 1 cliente, 5 clientes, 0 clientes]
- **Resultados obtenidos**: [ej. 0 clientes, 10 clientes, Error]

### 📝 Datos de Entrada

Si es un problema con datos de entrada:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "address": "Calle Principal 123",
  "city": "Ciudad",
  "country": "País"
}
```

### 📤 Datos de Salida

Si hay un problema con los datos mostrados:

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+1234567890",
  "total_purchases": 15,
  "total_value": 1500.00,
  "last_purchase": "2024-01-15"
}
```

### 🐛 Error de Clientes

Si hay un error durante la operación:

```javascript
// Error en la consola
Error: Failed to create customer
    at handleCreateCustomer (CustomerForm.jsx:123)
    at onSubmit (CustomerForm.jsx:145)
```

### 📈 Información de Estadísticas

Si es un problema con estadísticas:

- **Período**: [ej. Últimos 30 días, Este año, Todo el tiempo]
- **Métrica**: [ej. Total de compras, Valor promedio, Frecuencia]
- **Datos faltantes**: [ej. Compras de ayer, Clientes nuevos]
- **Cálculo**: [ej. Suma, Promedio, Conteo]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de clientes
- [ ] **Backend**: Lógica de clientes
- [ ] **Base de datos**: Modelos de clientes
- [ ] **API**: Endpoints de clientes
- [ ] **Validación**: Validación de datos
- [ ] **Búsqueda**: Funcionalidad de búsqueda

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Node.js**: [ej. 18.0.0]
- **Base de datos**: [ej. SQLite, PostgreSQL]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de clientes**: Lista, formulario, detalles
- **Error durante operación**: Mensaje de error
- **Búsqueda problemática**: Resultados de búsqueda
- **Consola**: Errores en la consola

### 📝 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos del cliente
const customerData = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "+1234567890",
  address: "Calle Principal 123",
  purchases: [
    { id: 1, date: "2024-01-15", total: 150.00 },
    { id: 2, date: "2024-01-10", total: 200.00 }
  ]
};
```

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar la gestión de clientes:

- **Funcionalidad**: Nuevas características
- **Interfaz**: Mejoras en la UI
- **Búsqueda**: Mejoras en la búsqueda
- **Reportes**: Nuevos tipos de reportes

### 🔗 Enlaces Útiles

- [Guía de Clientes](https://github.com/miguelnexs/localix/wiki/customers)
- [Gestión de Clientes](https://github.com/miguelnexs/localix/wiki/customer-management)
- [Reportes de Clientes](https://github.com/miguelnexs/localix/wiki/customer-reports)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de clientes.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la gestión de clientes?
- **Volumen**: ¿Cuántos clientes gestionas normalmente?
- **Frecuencia**: ¿Con qué frecuencia agregas/editas clientes?

### 📊 Métricas

Si es relevante, incluye métricas:

- **Total de clientes**: [ej. 500 clientes]
- **Clientes activos**: [ej. 300 clientes]
- **Clientes nuevos por mes**: [ej. 20 clientes]
- **Tiempo promedio de creación**: [ej. 2 minutos]

### 🔍 Validación

Si es un problema de validación:

- **Campo problemático**: [ej. email, teléfono, nombre]
- **Valor ingresado**: [ej. "juan@", "123", ""]
- **Error esperado**: [ej. "Email inválido", "Teléfono requerido"]
- **Error obtenido**: [ej. "Error interno", Sin error]

---

**Gracias por reportar este problema de clientes. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para la gestión de clientes.** 👥
