# Configuración de Datos de Empresa para PDFs

## Resumen

Se ha implementado una nueva funcionalidad que permite personalizar todos los datos de la empresa que aparecen en los recibos PDF y documentos oficiales, incluyendo dirección, NIT, teléfono, email y demás información.

## Características Implementadas

### 1. Nueva Pestaña "Empresa" en Configuraciones

Se agregó una nueva pestaña en el panel de configuraciones que incluye:

- **Información Básica**: Nombre, dirección, ciudad y país
- **Información de Contacto**: Teléfono, email y sitio web
- **Información Fiscal**: NIT y RUC
- **Vista Previa**: Muestra cómo se verá el encabezado en los PDFs

### 2. Configuración Extendida

Se extendió el contexto de configuración (`SettingsContext`) para incluir:

```javascript
companyData: {
  nombre: 'Carolina González Sarta',
  direccion: 'Cra 7 # 15 57 local 101',
  telefono: '3147435305',
  email: 'carolina.gonzalez@localix.com',
  nit: '1088297299-0',
  ruc: '1088297299-0',
  web: 'www.carolinagonzalez.com',
  ciudad: 'Bogotá',
  pais: 'Colombia'
}
```

### 3. Utilidades de Configuración

Se creó un archivo utilitario (`companyConfig.js`) con funciones para:

- **Obtener datos**: `getCompanyData()`, `getCompanyField()`
- **Actualizar datos**: `updateCompanyData()`, `updateCompanyField()`
- **Formatear información**: `getFormattedAddress()`, `getFormattedContact()`
- **Validar datos**: `validateCompanyData()`
- **Importar/Exportar**: `exportCompanyData()`, `importCompanyData()`

### 4. Generadores de PDF Actualizados

Se actualizaron ambos generadores de PDF para usar la configuración dinámica:

- **ventaPDFGenerator.js**: Recibos de venta
- **pedidoPDFGenerator.js**: Reportes de pedidos

## Campos Configurables

### Información Básica
- **Nombre de la empresa** (requerido)
- **Dirección** (requerido)
- **Ciudad** (opcional)
- **País** (opcional)

### Información de Contacto
- **Teléfono** (requerido)
- **Email** (opcional, con validación)
- **Sitio web** (opcional, con validación)

### Información Fiscal
- **NIT** (requerido)
- **RUC** (opcional)

## Uso de la Funcionalidad

### 1. Acceder a la Configuración

1. Abrir el panel de configuraciones desde el sidebar
2. Ir a la pestaña "Empresa"
3. Configurar los datos según se necesite

### 2. Configurar Datos

1. **Información Básica**: Completar nombre, dirección, ciudad y país
2. **Información de Contacto**: Agregar teléfono, email y sitio web
3. **Información Fiscal**: Ingresar NIT y RUC
4. **Vista previa**: Verificar cómo se verá en los PDFs

### 3. Validaciones

- **Campos requeridos**: Nombre, dirección, teléfono y NIT
- **Validación de email**: Formato válido de correo electrónico
- **Validación de URL**: Formato válido de sitio web
- **Feedback visual**: Mensajes de error y éxito

## Persistencia de Datos

- La configuración se guarda automáticamente en `localStorage`
- Los cambios se aplican inmediatamente en los PDFs generados
- La configuración persiste entre sesiones

## Componentes Afectados

### Nuevos Componentes
- `companyConfig.js`: Utilidades para manejo de datos de empresa
- `CONFIGURACION_DATOS_EMPRESA_PDF.md`: Documentación

### Componentes Modificados
- `SettingsContext.jsx`: Extendido con configuración de empresa
- `SettingsPanel.jsx`: Agregada nueva pestaña de empresa
- `ventaPDFGenerator.js`: Integrada configuración dinámica
- `pedidoPDFGenerator.js`: Integrada configuración dinámica

## Funciones Utilitarias

### Obtener Datos
```javascript
import { getCompanyData, getCompanyField } from './companyConfig.js';

// Obtener todos los datos
const companyData = getCompanyData();

// Obtener un campo específico
const nombre = getCompanyField('nombre');
```

### Actualizar Datos
```javascript
import { updateCompanyData, updateCompanyField } from './companyConfig.js';

// Actualizar un campo
updateCompanyField('telefono', '3001234567');

// Actualizar múltiples campos
updateCompanyData({
  nombre: 'Nueva Empresa',
  direccion: 'Nueva Dirección'
});
```

### Formatear Información
```javascript
import { getFormattedAddress, getFormattedContact } from './companyConfig.js';

// Dirección completa
const direccion = getFormattedAddress(); // "Cra 7 # 15 57 local 101, Bogotá, Colombia"

// Contacto formateado
const contacto = getFormattedContact(); // "3147435305 | 1088297299-0"
```

## Validaciones Implementadas

### Validación de Campos
- **Campos requeridos**: Se validan que no estén vacíos
- **Email**: Formato válido de correo electrónico
- **URL**: Formato válido de sitio web
- **Feedback**: Mensajes de error específicos

### Validación de Datos
```javascript
import { validateCompanyData } from './companyConfig.js';

const validation = validateCompanyData(companyData);
if (!validation.isValid) {
  console.log('Errores:', validation.errors);
}
```

## Importar/Exportar Configuración

### Exportar Datos
```javascript
import { exportCompanyData } from './companyConfig.js';

// Exporta los datos como archivo JSON
exportCompanyData();
```

### Importar Datos
```javascript
import { importCompanyData } from './companyConfig.js';

// Importa datos desde un archivo JSON
const file = event.target.files[0];
importCompanyData(file)
  .then(data => console.log('Datos importados:', data))
  .catch(error => console.error('Error:', error));
```

## Beneficios

1. **Personalización Completa**: Todos los datos de la empresa son configurables
2. **Consistencia**: Los mismos datos aparecen en todos los PDFs
3. **Validación Robusta**: Previene errores en los datos
4. **Vista Previa**: Permite verificar cambios antes de aplicarlos
5. **Persistencia**: Los cambios se mantienen entre sesiones
6. **Flexibilidad**: Campos opcionales y requeridos bien definidos
7. **Importar/Exportar**: Facilita la migración de datos

## Notas Técnicas

- Los datos se almacenan en `localStorage` como parte de la configuración general
- Los generadores de PDF obtienen los datos dinámicamente en tiempo de generación
- Se mantiene compatibilidad con configuraciones existentes
- Las validaciones se ejecutan tanto en el frontend como en las utilidades
- Los cambios se aplican inmediatamente sin necesidad de reiniciar la aplicación 