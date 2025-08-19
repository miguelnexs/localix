# Sistema de Generación de PDF para Pedidos

## Descripción

Se ha implementado una funcionalidad completa para generar reportes en PDF de los pedidos del sistema Localix. Esta funcionalidad permite crear reportes detallados y profesionales de cada pedido, incluyendo toda la información relevante como productos, cliente, estado, fechas importantes, etc.

## Características Principales

### 📄 Generación de PDFs Profesionales
- **Diseño moderno y profesional**: Utiliza un diseño limpio y moderno con el branding de la tienda
- **Logo personalizado**: Incluye el logo de la empresa en el encabezado
- **Imagen de fondo**: Opcional con marca de agua sutil
- **Formato A4**: Optimizado para impresión y visualización

### 📋 Información Completa del Pedido
- **Información del cliente**: Nombre, teléfono, email
- **Detalles del pedido**: Número, fecha, estado, tipo de venta
- **Lista de productos**: Con cantidades, precios unitarios y totales
- **Información de envío**: Código de seguimiento, empresa de envío
- **Fechas importantes**: Creación, confirmación, envío, entrega
- **Notas y observaciones**: Información adicional relevante

### 🎨 Estados Visuales
- **Colores diferenciados**: Cada estado del pedido tiene un color distintivo
- **Información clara**: Estados fácilmente identificables
- **Información de pago**: Estado de pago claramente marcado

## Ubicaciones de la Funcionalidad

### 1. Modal de Detalle de Pedido
**Ubicación**: `src/components/PedidoDetailModal.jsx`

**Funcionalidad**:
- Botón "Generar PDF" en la parte inferior del modal
- Genera un reporte completo del pedido actual
- Muestra estado de carga durante la generación

**Uso**:
1. Abrir el detalle de un pedido
2. Hacer clic en "Generar PDF"
3. El PDF se descargará automáticamente

### 2. Lista de Pedidos
**Ubicación**: `src/pages/OrdersPage.jsx`

**Funcionalidad**:
- Botón "PDF" en cada fila de la tabla de pedidos
- Genera reporte del pedido seleccionado
- Acceso rápido sin abrir el modal completo

**Uso**:
1. En la lista de pedidos, hacer clic en el botón "PDF"
2. El reporte se generará y descargará automáticamente

## Archivos Implementados

### 1. Generador de PDF
**Archivo**: `src/utils/pedidoPDFGenerator.js`

**Funciones principales**:
- `generarReportePedido(pedido, autoPrint)`: Genera PDF completo
- `generarReporteSimple(pedido)`: Genera PDF simplificado
- `testPedidoPDFGeneration()`: Función de prueba

### 2. Componentes Modificados
- **PedidoDetailModal.jsx**: Agregado botón de generación de PDF
- **OrdersPage.jsx**: Agregado botón de PDF en la tabla

## Estructura del PDF Generado

### Encabezado
```
┌─────────────────────────────────────────────────────────┐
│ [LOGO] Carolina González Sarta                          │
│ Cra 7 # 15 57 local 101                                │
│ 3147435305 | 1088297299-0                               │
│ carolina.gonzalez@localix.com                           │
└─────────────────────────────────────────────────────────┘
```

### Información del Pedido
```
PEDIDO #P-2024-001                    [Fecha de creación]
┌─────────────────────────────────────────────────────────┐
│ Cliente: Juan Pérez          Teléfono: 3001234567      │
│ Email: juan@email.com        Tipo: Venta Física        │
│                                                         │
│ Estado del Pedido: [En Preparación]                    │
└─────────────────────────────────────────────────────────┘
```

### Tabla de Productos
```
┌─────────────────┬──────────┬─────────────┬─────────────┐
│ Producto        │ Cantidad │ Precio Unit.│ Total       │
├─────────────────┼──────────┼─────────────┼─────────────┤
│ Camiseta (Rojo) │    2     │   $25.50    │   $51.00    │
│ Pantalón        │    1     │   $45.00    │   $45.00    │
└─────────────────┴──────────┴─────────────┴─────────────┘
```

### Totales y Información Adicional
```
Subtotal: $96.00
TOTAL: $96.00

Estado de Pago: Pagado
Método de Pago: Efectivo
Código Seguimiento: TRK123456789
Empresa de Envío: Servientrega
```

## Configuración

### Configuración de la Tienda
La información de la tienda se configura en el archivo `pedidoPDFGenerator.js`:

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

### Logos e Imágenes
- **Logo principal**: Se carga desde `Logo.png`
- **Imagen de fondo**: Se carga desde `logo_Mesa de trabajo 1.png`
- **Fallback**: Si no se encuentran las imágenes, se genera un logo simple

## Dependencias

### Librerías Requeridas
- `jspdf`: Para la generación de PDFs
- `html2canvas`: Para convertir HTML a imágenes
- `lucide-react`: Para los iconos (Download)

### Instalación
```bash
npm install jspdf html2canvas
```

## Uso en el Código

### Generar PDF desde un Componente
```javascript
import { generarReportePedido } from '../utils/pedidoPDFGenerator';

const handleGenerarPDF = async (pedido) => {
  try {
    await generarReportePedido(pedido, false);
    toast.success('Reporte PDF generado exitosamente');
  } catch (error) {
    toast.error('Error al generar el reporte PDF');
  }
};
```

### Función de Prueba
```javascript
import { testPedidoPDFGeneration } from '../utils/pedidoPDFGenerator';

// En la consola del navegador
testPedidoPDFGeneration();
```

## Personalización

### Modificar el Diseño
Para personalizar el diseño del PDF, editar la función `createPedidoHTML` en `pedidoPDFGenerator.js`:

```javascript
const createPedidoHTML = (pedido, logoImage, backgroundImage) => {
  // Modificar el HTML y CSS aquí
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Personalizar estilos aquí */
        </style>
      </head>
      <body>
        <!-- Personalizar estructura aquí -->
      </body>
    </html>
  `;
};
```

### Agregar Nuevos Campos
Para agregar nuevos campos al reporte:

1. Modificar la función `createPedidoHTML`
2. Agregar las secciones HTML correspondientes
3. Incluir los estilos CSS necesarios

## Solución de Problemas

### Error: "No se puede cargar la imagen"
- Verificar que los archivos de imagen existan en `/img/`
- Comprobar que las rutas sean correctas
- El sistema usará un logo generado como fallback

### Error: "Error al generar PDF"
- Verificar que las dependencias estén instaladas
- Comprobar que el objeto `pedido` tenga la estructura correcta
- Revisar la consola del navegador para errores específicos

### PDF no se descarga
- Verificar permisos del navegador para descargas
- Comprobar que no haya bloqueadores de popups activos
- El PDF se abrirá en una nueva ventana como fallback

## Mejoras Futuras

### Funcionalidades Planificadas
- [ ] Generación de PDFs en lote
- [ ] Plantillas personalizables
- [ ] Envío por email automático
- [ ] Impresión automática
- [ ] Reportes estadísticos en PDF

### Optimizaciones
- [ ] Compresión de imágenes
- [ ] Caché de logos
- [ ] Generación asíncrona mejorada
- [ ] Previsualización antes de generar

## Notas Técnicas

### Compatibilidad
- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Electron**: Compatible con la API de Electron
- **Dispositivos**: Desktop y tablet

### Rendimiento
- La generación toma aproximadamente 2-3 segundos
- El tamaño del PDF varía según el contenido
- Se recomienda no generar múltiples PDFs simultáneamente

### Seguridad
- Los PDFs se generan en el cliente
- No se envían datos sensibles al servidor
- Los archivos se descargan localmente 