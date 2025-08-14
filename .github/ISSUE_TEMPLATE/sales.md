---
name: Sales Issue
about: Report a problem with sales functionality or suggest improvements
title: '[SALES] '
labels: 'sales'
assignees: 'miguelnexs'

---

## 🛒 Reporte de Ventas

### 🔍 Tipo de Problema

- [ ] **Venta rápida**: Problema con ventas rápidas
- [ ] **Historial**: Problema con historial de ventas
- [ ] **Cliente**: Problema con gestión de clientes
- [ ] **Inventario**: Problema con control de inventario
- [ ] **Precios**: Problema con cálculo de precios
- [ ] **Descuentos**: Problema con descuentos y promociones
- [ ] **Reportes**: Problema con reportes de ventas
- [ ] **Estadísticas**: Problema con estadísticas de ventas
- [ ] **Exportación**: Problema con exportación de ventas

### 📋 Descripción

Describe el problema de ventas de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de ventas tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a 'Ventas'
2. Haz clic en '....'
3. Selecciona '....'
4. Observa el error '....'

### 🛒 Información de la Venta

- **Tipo de venta**: [Venta rápida, Venta normal, Venta con cliente]
- **Productos**: [ej. 3 productos, 1 producto]
- **Cliente**: [ej. Cliente registrado, Cliente anónimo]
- **Total**: [ej. $150.00, €200.00]
- **Método de pago**: [Efectivo, Tarjeta, Transferencia]

### 👥 Información del Cliente

- **Cliente**: [ej. Juan Pérez, Cliente anónimo]
- **Email**: [ej. juan@example.com]
- **Teléfono**: [ej. +1234567890]
- **Historial**: [ej. 5 compras anteriores, Cliente nuevo]

### 📦 Información de Productos

- **Producto**: [ej. Camiseta Básica, Laptop HP]
- **Cantidad**: [ej. 2 unidades, 1 unidad]
- **Precio unitario**: [ej. $25.00, $999.99]
- **Color**: [ej. Rojo, Azul, Sin color]
- **Stock disponible**: [ej. 10 unidades, 0 unidades]

### 💰 Información de Precios

- **Precio base**: [ej. $100.00]
- **Descuento**: [ej. 10%, $20.00]
- **Impuestos**: [ej. 16% IVA, 0%]
- **Total final**: [ej. $95.20]

### 📊 Información de Inventario

- **Stock antes**: [ej. 50 unidades]
- **Stock después**: [ej. 48 unidades]
- **Stock mínimo**: [ej. 5 unidades]
- **Alerta**: [ej. Stock bajo, Sin stock]

### 🐛 Error de Ventas

Si hay un error durante la venta:

```javascript
// Error en la consola
Error: Failed to create sale
    at handleCreateSale (SalesForm.jsx:123)
    at onSubmit (SalesForm.jsx:145)
```

### 📈 Información de Reportes

Si es un problema con reportes:

- **Período**: [ej. Enero 2024, Últimos 30 días]
- **Tipo de reporte**: [Ventas por día, Ventas por producto, Ventas por cliente]
- **Datos faltantes**: [ej. Ventas de ayer, Productos específicos]
- **Formato**: [Excel, PDF, Gráfico]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de ventas
- [ ] **Backend**: Lógica de ventas
- [ ] **Base de datos**: Modelos de ventas
- [ ] **API**: Endpoints de ventas
- [ ] **Reportes**: Generación de reportes
- [ ] **Inventario**: Control de stock

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Node.js**: [ej. 18.0.0]
- **Base de datos**: [ej. SQLite, PostgreSQL]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de ventas**: Formulario, lista, detalles
- **Error durante venta**: Mensaje de error
- **Reporte problemático**: Vista del reporte
- **Consola**: Errores en la consola

### 📝 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos de la venta
const saleData = {
  customer: "Juan Pérez",
  products: [
    { id: 1, name: "Camiseta", quantity: 2, price: 25.00 },
    { id: 2, name: "Pantalón", quantity: 1, price: 50.00 }
  ],
  total: 100.00,
  discount: 10.00,
  finalTotal: 90.00
};
```

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar las ventas:

- **Flujo**: Mejoras en el flujo de venta
- **Reportes**: Nuevos tipos de reportes
- **Automatización**: Procesos automáticos
- **Integración**: Integración con otros sistemas

### 🔗 Enlaces Útiles

- [Guía de Ventas](https://github.com/miguelnexs/localix/wiki/sales)
- [Reportes](https://github.com/miguelnexs/localix/wiki/reports)
- [Clientes](https://github.com/miguelnexs/localix/wiki/customers)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de ventas.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente las ventas?
- **Volumen**: ¿Cuántas ventas procesas normalmente?
- **Frecuencia**: ¿Con qué frecuencia haces ventas?

### 📊 Métricas

Si es relevante, incluye métricas:

- **Ventas por día**: [ej. 50 ventas]
- **Ticket promedio**: [ej. $75.00]
- **Productos por venta**: [ej. 3 productos]
- **Tiempo de venta**: [ej. 2 minutos]

---

**Gracias por reportar este problema de ventas. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para la gestión de ventas.** 🛒
