# 🖨️ Sistema de Impresión Automática de Recibos

## 📋 Descripción

Este sistema permite que cuando se realice una venta rápida, se genere e imprima automáticamente el PDF del recibo. El sistema es completamente automático y configurable.

## 🎯 Características

### ✅ **Impresión Automática**
- Se genera e imprime el recibo automáticamente al completar una venta
- No requiere intervención manual del usuario
- Funciona tanto en ventas físicas como en línea

### ✅ **Configuración de Impresora**
- Selección de impresora específica para recibos
- Prueba de impresión para verificar configuración
- Fallback a impresora por defecto del sistema

### ✅ **Formatos de Recibo**
- **Recibo Completo**: Formato A5 con información detallada
- **Recibo Simple**: Formato de ticket para impresión rápida
- Diseño profesional y elegante

## 🚀 Componentes

### 1. **Generador de PDF**
`src/utils/ventaPDFGenerator.js`

**Funciones principales:**
- `generarReciboVenta(venta, autoPrint)`: Recibo completo en A5
- `generarReciboSimple(venta)`: Recibo tipo ticket

**Características:**
- Encabezado con información de la tienda
- Detalles completos de la venta
- Lista de productos con precios
- Totales y descuentos
- Información del cliente
- Pie de página profesional

### 2. **Handlers de PDF**
`src/main/handlers/pdfHandlers.js`

**Funciones disponibles:**
- `pdf:print`: Imprimir PDF automáticamente
- `pdf:save`: Guardar PDF en carpeta de descargas
- `printer:get-default`: Obtener impresora por defecto
- `printer:list`: Listar impresoras disponibles

### 3. **Configuración de Impresora**
`src/components/ventas/PrinterConfigModal.jsx`

**Características:**
- Lista de impresoras disponibles
- Selección de impresora específica
- Prueba de impresión
- Guardado de configuración

## 🔧 Configuración

### **Configuración de la Tienda**
Modifica `src/utils/ventaPDFGenerator.js`:

```javascript
const TIENDA_CONFIG = {
  nombre: 'Tu Tienda',
  direccion: 'Tu Dirección',
  telefono: 'Tu Teléfono',
  email: 'tu@email.com',
  ruc: 'Tu RUC',
  web: 'tu-sitio.com'
};
```

### **Configuración de Impresora**
1. Haz clic en el botón "Impresora" en la página de ventas
2. Selecciona la impresora deseada
3. Prueba la configuración
4. Guarda los cambios

## 📱 Cómo Funciona

### **1. Venta Rápida**
- El usuario completa una venta normal
- Al hacer clic en "Finalizar Venta"

### **2. Generación Automática**
- Se crea la venta en el backend
- Se emite un evento `venta-creada`
- El frontend recibe el evento

### **3. Impresión Automática**
- Se genera el PDF del recibo
- Se envía automáticamente a la impresora
- Se muestra confirmación al usuario

### **4. Configuración**
- El usuario puede configurar la impresora
- Se guarda la preferencia en localStorage
- Se usa la impresora configurada o la del sistema

## 🎨 Personalización

### **Diseño del Recibo**
Modifica las funciones en `ventaPDFGenerator.js`:

```javascript
// Cambiar colores
doc.setFillColor(30, 41, 59); // Azul oscuro
doc.setTextColor(37, 99, 235); // Azul

// Cambiar fuentes
doc.setFont('helvetica', 'bold');
doc.setFontSize(16);

// Cambiar formato
const doc = new jsPDF({ unit: 'mm', format: 'a5' });
```

### **Información del Recibo**
Personaliza qué información se muestra:

```javascript
// Agregar campos personalizados
doc.text(`Campo personalizado: ${valor}`, x, y);

// Modificar estructura
// Ver funciones generarReciboVenta y generarReciboSimple
```

## 🧪 Testing

### **Probar Impresión**
1. Ve a la página de ventas
2. Haz clic en "Impresora"
3. Selecciona una impresora
4. Haz clic en "Probar Impresión"
5. Verifica que se imprima la página de prueba

### **Probar Venta Completa**
1. Crea una venta rápida
2. Completa el proceso normal
3. Verifica que se imprima automáticamente
4. Revisa el recibo generado

## 🐛 Solución de Problemas

### **No se imprime automáticamente:**
1. Verifica que la impresora esté conectada
2. Revisa la configuración de impresora
3. Prueba la impresión manual
4. Revisa la consola para errores

### **Error al generar PDF:**
1. Verifica que jsPDF esté instalado
2. Revisa los datos de la venta
3. Comprueba la configuración de la tienda
4. Revisa la consola para errores

### **Impresora no aparece en la lista:**
1. Verifica que la impresora esté instalada
2. Reinicia la aplicación
3. Verifica los drivers de la impresora
4. Usa la impresora por defecto del sistema

## 📞 Soporte

Si tienes problemas:

1. **Verifica la impresora** esté conectada y funcionando
2. **Revisa la configuración** en el modal de impresora
3. **Prueba la impresión** con el botón de prueba
4. **Revisa la consola** para errores específicos
5. **Verifica los drivers** de la impresora

## 🔄 Flujo Completo

```
Usuario completa venta
         ↓
   Se crea en backend
         ↓
   Evento venta-creada
         ↓
   Frontend recibe evento
         ↓
   Genera PDF automáticamente
         ↓
   Envía a impresora configurada
         ↓
   Muestra confirmación
         ↓
   Recibo impreso ✅
```

---

**Sistema desarrollado para Localix Dashboard** 🚀

*El sistema está diseñado para ser completamente automático y profesional, mejorando la experiencia del usuario al eliminar pasos manuales.*
