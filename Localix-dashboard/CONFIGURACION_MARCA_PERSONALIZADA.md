# Configuración de Marca Personalizada

## Resumen

Se ha implementado una nueva funcionalidad que permite personalizar el logo y el nombre de la empresa que aparece en el sidebar de la aplicación.

## Características Implementadas

### 1. Nueva Pestaña "Marca" en Configuraciones

Se agregó una nueva pestaña en el panel de configuraciones que incluye:

- **Configuración de Logo**: Permite subir y gestionar el logo de la empresa
- **Configuración de Nombre**: Permite personalizar el nombre que aparece en el sidebar
- **Vista Previa**: Muestra cómo se verá el sidebar con los cambios aplicados

### 2. Componente ImageUpload

Se creó un componente reutilizable para la subida de imágenes con las siguientes características:

- **Drag & Drop**: Arrastrar y soltar archivos de imagen
- **Click para seleccionar**: Click en el área para abrir el selector de archivos
- **Validación de archivos**: Verifica tipo y tamaño de imagen
- **Vista previa**: Muestra la imagen seleccionada
- **Eliminación**: Botón para remover la imagen actual
- **Mensajes de error**: Información clara sobre errores de validación

### 3. Configuración en Contexto

Se extendió el contexto de configuración (`SettingsContext`) para incluir:

```javascript
customBrand: {
  logo: null, // URL de la imagen del logo
  companyName: 'Carolina González',
  showLogo: true,
  showCompanyName: true
}
```

### 4. Funciones de Gestión

Se agregaron las siguientes funciones al contexto:

- `updateLogo(logoUrl)`: Actualiza la URL del logo
- `updateCompanyName(name)`: Actualiza el nombre de la empresa
- `toggleLogoVisibility()`: Activa/desactiva la visualización del logo
- `toggleCompanyNameVisibility()`: Activa/desactiva la visualización del nombre

## Uso de la Funcionalidad

### 1. Acceder a la Configuración

1. Abrir el panel de configuraciones desde el sidebar
2. Ir a la pestaña "Marca"
3. Configurar logo y nombre según se desee

### 2. Configurar el Logo

1. **Activar logo**: Usar el toggle para habilitar la visualización del logo
2. **Subir imagen**: 
   - Arrastrar una imagen al área de subida, o
   - Hacer click para seleccionar un archivo
3. **Formatos soportados**: JPG, PNG, GIF, SVG
4. **Tamaño máximo**: 2MB
5. **Tamaño recomendado**: 200x200px o superior

### 3. Configurar el Nombre

1. **Activar nombre**: Usar el toggle para habilitar la visualización del nombre
2. **Editar nombre**: Escribir el nombre deseado en el campo de texto
3. **Vista previa**: Ver cómo se verá en el sidebar

### 4. Vista Previa

La sección de vista previa muestra exactamente cómo se verá el encabezado del sidebar con los cambios aplicados, permitiendo verificar la configuración antes de aplicarla.

## Persistencia de Datos

- La configuración se guarda automáticamente en `localStorage`
- Los cambios se aplican inmediatamente en la interfaz
- La configuración persiste entre sesiones

## Componentes Afectados

### Nuevos Componentes
- `ImageUpload.jsx`: Componente para subida de imágenes
- `CONFIGURACION_MARCA_PERSONALIZADA.md`: Documentación

### Componentes Modificados
- `SettingsContext.jsx`: Extendido con configuración de marca
- `SettingsPanel.jsx`: Agregada nueva pestaña de marca
- `Sidebar.jsx`: Integrada configuración personalizada

## Validaciones Implementadas

### Validación de Archivos
- **Tipo de archivo**: Solo imágenes (image/*)
- **Tamaño máximo**: 2MB para logos
- **Formatos soportados**: JPG, PNG, GIF, SVG

### Validación de Interfaz
- **Campos requeridos**: Validación de entrada de texto
- **Feedback visual**: Mensajes de error y éxito
- **Estados de carga**: Indicadores durante la subida

## Beneficios

1. **Personalización**: Permite adaptar la aplicación a la marca de cada empresa
2. **Flexibilidad**: Opción de mostrar/ocultar logo y nombre
3. **Experiencia de usuario**: Interfaz intuitiva con drag & drop
4. **Validación robusta**: Previene errores de archivos incorrectos
5. **Vista previa**: Permite verificar cambios antes de aplicarlos
6. **Persistencia**: Los cambios se mantienen entre sesiones

## Notas Técnicas

- Las imágenes se convierten a base64 para almacenamiento en localStorage
- Se utiliza FileReader API para la lectura de archivos
- Los cambios se aplican en tiempo real sin necesidad de recargar
- Compatible con todos los navegadores modernos
- Optimizado para rendimiento con validaciones eficientes 