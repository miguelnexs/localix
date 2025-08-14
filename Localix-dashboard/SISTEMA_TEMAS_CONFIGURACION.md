# 🎨 Sistema de Temas y Configuración - Localix Dashboard

## 📋 Descripción General

El sistema de temas y configuración permite personalizar completamente la apariencia y comportamiento del dashboard de Localix. Incluye múltiples temas predefinidos, configuraciones de interfaz y opciones de notificaciones.

## 🚀 Características Principales

### 🎨 Temas Disponibles

1. **Tema Claro** - Fondo blanco con acentos azules
2. **Tema Oscuro** - Negro puro con acentos índigo
3. **Tema Azul** - Azul profundo con tonos slate

### ⚙️ Configuraciones de Interfaz

- **Animaciones**: Habilitar/deshabilitar transiciones y efectos
- **Modo Compacto**: Reducir espaciado y tamaños de elementos
- **Sidebar**: Control de colapso/expansión
- **Notificaciones**: Gestión de alertas del sistema

## 🛠️ Implementación Técnica

### Estructura de Archivos

```
src/
├── context/
│   └── SettingsContext.jsx          # Contexto principal de configuración
├── components/layout/
│   ├── SettingsPanel.jsx            # Panel de configuración
│   ├── ThemeIndicator.jsx           # Indicador de tema actual
│   └── Sidebar.jsx                  # Sidebar con botón de configuración
├── hooks/
│   └── useTheme.jsx                 # Hook personalizado para temas
└── index.css                        # Variables CSS y estilos
```

### Contexto de Configuración

El `SettingsContext` maneja:
- Estado global de configuración
- Persistencia en localStorage
- Aplicación automática de temas
- Sincronización entre componentes

```javascript
const {
  settings,           // Configuración actual
  themes,            // Temas disponibles
  currentTheme,      // Tema activo
  updateTheme,       // Cambiar tema
  toggleAnimations,  // Toggle animaciones
  toggleCompactMode, // Toggle modo compacto
  resetSettings      // Restablecer configuración
} = useSettings();
```

### Variables CSS

El sistema utiliza variables CSS para aplicar colores dinámicamente:

```css
:root {
  --color-primary: #1e40af;
  --color-secondary: #374151;
  --color-accent: #3b82f6;
  --color-background: #111827;
  --color-surface: #1f2937;
  --color-text: #f9fafb;
  --color-textSecondary: #9ca3af;
  --color-border: #374151;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
}
```

## 🎯 Uso del Sistema

### Acceso a Configuración

1. **Desde el Sidebar**: Click en el botón "Configuración" en la sección "Sistema"
2. **Panel Modal**: Se abre un panel completo con pestañas organizadas

### Cambiar Tema

1. Abrir panel de configuración
2. Ir a pestaña "Temas"
3. Seleccionar tema deseado
4. Los cambios se aplican automáticamente

### Configurar Interfaz

1. **Animaciones**: Toggle para habilitar/deshabilitar efectos
2. **Modo Compacto**: Reduce espaciado y tamaños
3. **Notificaciones**: Control de alertas del sistema

## 🔧 Personalización Avanzada

### Agregar Nuevo Tema

1. **Definir tema en SettingsContext.jsx**:

```javascript
const themes = {
  // ... temas existentes
  custom: {
    name: 'Mi Tema Personalizado',
    colors: {
      primary: '#tu-color',
      secondary: '#tu-color',
      // ... resto de colores
    }
  }
};
```

2. **Agregar icono en SettingsPanel.jsx**:

```javascript
const themeIcons = {
  // ... iconos existentes
  custom: TuIcono
};
```

3. **Agregar estilos específicos en index.css**:

```css
[data-theme="custom"] {
  --color-background: #tu-color;
  --color-surface: #tu-color;
}
```

### Hook Personalizado

El hook `useTheme` proporciona utilidades adicionales:

```javascript
const {
  getThemeColor,      // Obtener color específico
  getThemeStyles,     // Obtener estilos completos
  isCompactMode,      // Estado modo compacto
  animationsEnabled,  // Estado animaciones
} = useTheme();
```

## 🎨 Clases CSS Utilitarias

### Fondos
- `.bg-theme-primary`
- `.bg-theme-secondary`
- `.bg-theme-accent`
- `.bg-theme-background`
- `.bg-theme-surface`

### Texto
- `.text-theme-primary`
- `.text-theme-secondary`
- `.text-theme-accent`
- `.text-theme-text`
- `.text-theme-textSecondary`

### Bordes
- `.border-theme-primary`
- `.border-theme-secondary`
- `.border-theme-border`

## 🔄 Persistencia

- **localStorage**: Configuración se guarda automáticamente
- **Sincronización**: Cambios se aplican inmediatamente
- **Restauración**: Al recargar, se mantienen las preferencias

## 🚀 Optimizaciones

### Rendimiento
- Transiciones CSS para cambios suaves
- Lazy loading de componentes
- Memoización de configuraciones

### Accesibilidad
- Contraste adecuado en todos los temas
- Indicadores visuales claros
- Navegación por teclado

## 🐛 Solución de Problemas

### Tema no se aplica
1. Verificar que el tema existe en `themes`
2. Revisar variables CSS en `index.css`
3. Comprobar que `SettingsProvider` envuelve la app

### Configuración no se guarda
1. Verificar localStorage disponible
2. Revisar errores en consola
3. Comprobar permisos del navegador

### Animaciones no funcionan
1. Verificar estado `animations` en settings
2. Comprobar clases CSS `.animations-enabled`
3. Revisar conflictos con otros estilos

## 📝 Notas de Desarrollo

- Los temas se aplican mediante variables CSS para mejor rendimiento
- El sistema es extensible y permite agregar nuevos temas fácilmente
- La configuración se sincroniza automáticamente entre componentes
- Se mantiene compatibilidad con el diseño existente

## 🔮 Futuras Mejoras

- [ ] Temas personalizados por usuario
- [ ] Importar/exportar configuraciones
- [ ] Temas automáticos basados en hora del día
- [ ] Más opciones de personalización
- [ ] Temas estacionales
