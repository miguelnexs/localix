# 🎨 Sistema de Generación de PDFs con HTML - Localix

## 📋 Resumen

El sistema de generación de PDFs ha sido completamente renovado para usar **HTML + CSS + jsPDF + html2canvas**, proporcionando una experiencia de desarrollo más moderna, flexible y mantenible.

## ✨ Nuevas Características

### 🎨 Diseño HTML
- **Templates HTML**: Los PDFs se crean usando HTML y CSS estándar
- **Diseño Responsive**: Se adapta automáticamente al contenido
- **CSS Moderno**: Soporte completo para CSS3, gradientes, sombras, etc.
- **Fácil Personalización**: Modificar el diseño es tan simple como editar HTML/CSS

### 🖼️ Imagen de Fondo
- **Transparencia**: Imagen de fondo con 30% de opacidad
- **Cobertura Completa**: La imagen cubre toda la página
- **Fondo Semi-transparente**: Fondo blanco con 90% de opacidad para legibilidad
- **Fallback Graceful**: Si la imagen no carga, el PDF se genera normalmente

### ⚡ Alta Calidad
- **Alta Resolución**: Generación en 2x escala para mejor calidad
- **Optimización**: Conversión eficiente de HTML a PDF
- **Múltiples Páginas**: Soporte automático para páginas adicionales
- **Compatibilidad**: Funciona en navegadores y Electron

## 🔧 Arquitectura del Sistema

### Componentes Principales

1. **`createReciboHTML()`**: Crea el HTML del recibo con todos los estilos
2. **`generatePDFFromHTML()`**: Convierte HTML a PDF usando html2canvas
3. **`loadBackgroundImage()`**: Carga la imagen de fondo
4. **`loadRealLogo()`**: Carga el logo de la empresa

### Flujo de Generación

```
Datos de Venta → HTML Template → html2canvas → jsPDF → PDF Final
```

## 📁 Estructura de Archivos

```
Localix-dashboard/
├── src/renderer/src/utils/
│   └── ventaPDFGenerator.js     # Generador principal de PDFs
├── test-html-pdf.html          # Página de prueba completa
├── test-background-image.html  # Página de prueba de imagen de fondo
└── SISTEMA_PDF_HTML.md         # Esta documentación
```

## 🚀 Funciones Disponibles

### `generarReciboVenta(venta, autoPrint)`
Genera un recibo completo con diseño HTML.

**Parámetros:**
- `venta`: Objeto con datos de la venta
- `autoPrint`: Boolean para imprimir automáticamente

**Retorna:** Objeto PDF de jsPDF

### `generarReciboSimple(venta)`
Genera un recibo simple con diseño HTML.

**Parámetros:**
- `venta`: Objeto con datos de la venta

**Retorna:** Objeto PDF de jsPDF

### `testPDFGeneration()`
Función de prueba para generar un PDF de ejemplo.

**Retorna:** Objeto PDF de jsPDF

## 🎯 Ventajas del Nuevo Sistema

### ✅ Comparación con el Sistema Anterior

| Aspecto | Sistema Anterior | Nuevo Sistema |
|---------|------------------|---------------|
| **Diseño** | Posicionamiento manual | HTML + CSS |
| **Mantenimiento** | Código complejo | Código limpio |
| **Personalización** | Difícil | Muy fácil |
| **Calidad** | Básica | Alta resolución |
| **Flexibilidad** | Limitada | Total |
| **Debugging** | Difícil | Fácil (HTML) |

### 🎨 Características de Diseño

- **Gradientes**: Fondos con gradientes CSS
- **Sombras**: Efectos de sombra en elementos
- **Bordes Redondeados**: Diseño moderno
- **Colores Personalizados**: Paleta de colores consistente
- **Tipografía**: Fuentes web modernas
- **Espaciado**: Diseño bien balanceado

## 🛠️ Configuración y Personalización

### Configuración de la Tienda

```javascript
const TIENDA_CONFIG = {
  nombre: 'Carolina González Sarta',
  direccion: 'Cra 7 # 15 57 local 101',
  telefono: '3147435305',
  email: 'carolina.gonzalez@localix.com',
  ruc: '1088297299-0',
  web: 'www.carolinagonzalez.com'
};
```

### Personalización de Colores

Los colores principales se pueden modificar en el CSS:

```css
/* Colores principales */
--primary-color: #ffb6c1;    /* Rosa claro */
--secondary-color: #ff69b4;  /* Rosa oscuro */
--text-color: #8b4513;       /* Marrón oscuro */
--background-color: #ffffff; /* Blanco */
```

### Ajuste de Transparencia

```javascript
// En la función addBackgroundImage()
doc.setGlobalAlpha(0.3); // 30% de opacidad para imagen de fondo
doc.setGlobalAlpha(0.9); // 90% de opacidad para fondo blanco
```

## 📱 Responsive Design

El sistema incluye diseño responsive que se adapta automáticamente:

- **A4 Portrait**: Formato estándar para recibos
- **Auto-scaling**: Se ajusta al contenido
- **Múltiples Páginas**: División automática si es necesario
- **Print Media**: Optimizado para impresión

## 🔍 Debugging y Pruebas

### Funciones de Prueba

```javascript
// Probar carga de logo
await testLogoLoading();

// Probar carga de imagen de fondo
await testBackgroundImageLoading();

// Generar PDF de prueba
await testPDFGeneration();
```

### Páginas de Prueba

1. **`test-html-pdf.html`**: Prueba completa del sistema
2. **`test-background-image.html`**: Prueba específica de imagen de fondo

## 📦 Dependencias

### Nuevas Dependencias

```json
{
  "html2canvas": "^1.4.1"
}
```

### Dependencias Existentes

```json
{
  "jspdf": "^3.0.1"
}
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
npm install html2canvas
```

### 2. Importar en tu Componente

```javascript
import { generarReciboVenta, generarReciboSimple } from '../utils/ventaPDFGenerator.js';
```

### 3. Usar las Funciones

```javascript
// Generar recibo con impresión automática
await generarReciboVenta(ventaData, true);

// Generar recibo simple
await generarReciboSimple(ventaData);
```

## 🎨 Personalización Avanzada

### Modificar el Template HTML

El template HTML se encuentra en la función `createReciboHTML()`. Puedes:

1. **Cambiar Colores**: Modificar las variables CSS
2. **Agregar Elementos**: Incluir nuevos campos o secciones
3. **Modificar Layout**: Cambiar la estructura del diseño
4. **Agregar Animaciones**: Incluir efectos CSS (aunque no se verán en PDF)

### Ejemplo de Personalización

```javascript
// Agregar un nuevo campo al template
const htmlContent = `
  <div class="nueva-seccion">
    <h3>Información Adicional</h3>
    <p>${venta.informacionAdicional || 'Sin información adicional'}</p>
  </div>
`;
```

## 🔧 Optimización

### Rendimiento

- **Lazy Loading**: Las imágenes se cargan solo cuando es necesario
- **Caching**: Las imágenes se almacenan en memoria
- **Compresión**: Optimización automática de calidad vs tamaño

### Calidad

- **Escala 2x**: Para mejor calidad en dispositivos de alta resolución
- **Anti-aliasing**: Suavizado automático de bordes
- **Optimización de Fuentes**: Uso de fuentes web optimizadas

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Imagen de fondo no aparece**
   - Verificar que el archivo existe en `/img/logo_Mesa de trabajo 1.png`
   - Usar `testBackgroundImageLoading()` para diagnosticar

2. **Logo no se carga**
   - Verificar que el archivo existe en `/img/Logo.png`
   - Usar `testLogoLoading()` para diagnosticar

3. **PDF se ve pixelado**
   - Aumentar la escala en html2canvas (actualmente 2x)
   - Verificar que las imágenes son de alta calidad

4. **Error de CORS**
   - Asegurar que las imágenes están en el mismo dominio
   - Usar `useCORS: true` en html2canvas

### Logs de Debug

El sistema incluye logs detallados:

```javascript
console.log('🔍 Intentando cargar imagen de fondo...');
console.log('✅ Imagen de fondo cargada exitosamente');
console.log('❌ Error al cargar la imagen de fondo:', error);
```

## 📈 Futuras Mejoras

### Funcionalidades Planificadas

1. **Múltiples Templates**: Diferentes diseños para diferentes tipos de documentos
2. **Editor Visual**: Interfaz para personalizar templates sin código
3. **Watermarks**: Marcas de agua personalizables
4. **Firmas Digitales**: Soporte para firmas electrónicas
5. **Compresión Avanzada**: Optimización de tamaño de archivo

### Optimizaciones Técnicas

1. **Web Workers**: Generación de PDFs en segundo plano
2. **Streaming**: Generación progresiva para archivos grandes
3. **Caching**: Almacenamiento en caché de templates
4. **Lazy Loading**: Carga diferida de recursos

## 📞 Soporte

Para problemas o preguntas sobre el sistema de PDFs:

1. **Revisar esta documentación**
2. **Usar las funciones de prueba**
3. **Verificar los logs de consola**
4. **Probar con los archivos HTML de ejemplo**

---

**Desarrollado para Localix Dashboard**  
*Sistema de gestión empresarial moderno y eficiente* 