# 🔌 Sistema de Manejo de Errores de Conexión

## 📋 Descripción General

Este sistema proporciona una experiencia de usuario elegante cuando no hay conexión a la base de datos. Incluye múltiples componentes y hooks para manejar diferentes escenarios de error de conexión.

## 🎯 Características Principales

### ✅ Componentes Implementados

1. **ConnectionErrorModal** - Modal elegante para errores de conexión
2. **ConnectionStatusIndicator** - Indicador en tiempo real en la barra superior
3. **ConnectionErrorPage** - Página completa de error de conexión
4. **useConnectionStatus** - Hook para manejar el estado de conexión
5. **useConnectionGuard** - Hook para proteger páginas que requieren conexión

### 🔄 Funcionalidades

- ✅ Detección automática de errores de conexión
- ✅ Verificación periódica de conectividad (cada 30 segundos)
- ✅ Reintentos automáticos y manuales
- ✅ Interceptores de axios para detección en tiempo real
- ✅ Interfaz de usuario elegante y responsive
- ✅ Soporte para modo oscuro
- ✅ Animaciones y transiciones suaves

## 🚀 Componentes Disponibles

### 1. ConnectionErrorModal

Modal que se muestra cuando hay errores de conexión.

```jsx
import ConnectionErrorModal from './components/ui/ConnectionErrorModal';

<ConnectionErrorModal 
  isVisible={connectionError} 
  onRetry={retryConnection} 
/>
```

**Props:**
- `isVisible` (boolean): Controla la visibilidad del modal
- `onRetry` (function): Función para reintentar la conexión

### 2. ConnectionStatusIndicator

Indicador pequeño en la esquina superior derecha.

```jsx
import ConnectionStatusIndicator from './components/ui/ConnectionStatusIndicator';

<ConnectionStatusIndicator />
```

**Características:**
- Se muestra automáticamente cuando hay problemas
- Incluye botón de reintento rápido
- Animaciones suaves

### 3. ConnectionErrorPage

Página completa de error de conexión.

```jsx
import ConnectionErrorPage from './components/ui/ConnectionErrorPage';

<ConnectionErrorPage>
  {/* Contenido de la página */}
</ConnectionErrorPage>
```

**Características:**
- Página completa con diseño elegante
- Lista de posibles soluciones
- Botones de acción (reintentar, recargar)
- Información de soporte técnico

## 🎣 Hooks Disponibles

### 1. useConnectionStatus

Hook principal para manejar el estado de conexión.

```jsx
import { useConnectionStatus } from './hooks/useConnectionStatus';

const {
  connectionError,
  isCheckingConnection,
  lastCheckTime,
  checkConnection,
  retryConnection
} = useConnectionStatus();
```

**Valores retornados:**
- `connectionError` (boolean): Si hay error de conexión
- `isCheckingConnection` (boolean): Si está verificando conexión
- `lastCheckTime` (Date): Última verificación realizada
- `checkConnection` (function): Función para verificar conexión
- `retryConnection` (function): Función para reintentar

### 2. useConnectionGuard

Hook para proteger páginas que requieren conexión.

```jsx
import { useConnectionGuard } from './hooks/useConnectionGuard';

const { ConnectionGuard } = useConnectionGuard();

<ConnectionGuard showOnError={true}>
  {/* Contenido que requiere conexión */}
</ConnectionGuard>
```

**Props del ConnectionGuard:**
- `showOnError` (boolean): Si mostrar la página de error (default: true)
- `children` (ReactNode): Contenido a proteger

## 🔧 Configuración Automática

El sistema se configura automáticamente en el `AppContext`:

```jsx
// src/context/AppContext.jsx
import { useConnectionStatus } from '../hooks/useConnectionStatus';

export const AppProvider = ({ children }) => {
  const connectionStatus = useConnectionStatus();
  
  return (
    <AppContext.Provider value={{
      ...connectionStatus,
      // otros valores del contexto
    }}>
      {children}
    </AppContext.Provider>
  );
};
```

## 📱 Uso en Páginas

### Página que requiere conexión:

```jsx
import React from 'react';
import { useConnectionGuard } from '../hooks/useConnectionGuard';

const ProductsPage = () => {
  const { ConnectionGuard } = useConnectionGuard();

  return (
    <ConnectionGuard>
      <div className="p-6">
        <h1>Productos</h1>
        {/* Contenido que requiere datos de la BD */}
      </div>
    </ConnectionGuard>
  );
};
```

### Página que NO requiere conexión:

```jsx
import React from 'react';
import { useConnectionGuard } from '../hooks/useConnectionGuard';

const SettingsPage = () => {
  const { ConnectionGuard } = useConnectionGuard();

  return (
    <ConnectionGuard showOnError={false}>
      <div className="p-6">
        <h1>Configuración</h1>
        {/* Contenido que no requiere BD */}
      </div>
    </ConnectionGuard>
  );
};
```

## 🔍 Detección de Errores

El sistema detecta automáticamente los siguientes tipos de errores:

- **ECONNREFUSED**: Conexión rechazada
- **NETWORK_ERROR**: Error de red
- **ERR_NETWORK**: Error de red (Chrome)
- **ERR_CONNECTION_REFUSED**: Conexión rechazada (Chrome)
- **Sin respuesta del servidor**: Timeout o servidor no disponible

## ⚙️ Configuración Avanzada

### Endpoint de verificación

El sistema usa el endpoint `/api/categorias/test_connection/` para verificar la conexión. Puedes modificar esto en el hook `useConnectionStatus`:

```jsx
// En useConnectionStatus.jsx
await api.get('/api/categorias/test_connection/');
```

### Intervalo de verificación

El intervalo de verificación automática se puede modificar:

```jsx
// En useConnectionStatus.jsx
const interval = setInterval(() => {
  checkConnection();
}, 30000); // 30 segundos
```

## 🎨 Personalización

### Colores y estilos

Los componentes usan Tailwind CSS y pueden ser personalizados modificando las clases:

```jsx
// Ejemplo de personalización
<div className="bg-red-500 text-white px-4 py-2 rounded-lg">
  {/* Contenido personalizado */}
</div>
```

### Iconos

Los iconos son SVG de Lucide React y pueden ser reemplazados:

```jsx
import { Wifi, WifiOff } from 'lucide-react';

<Wifi className="w-4 h-4" />
```

## 🐛 Solución de Problemas

### El modal no se muestra

1. Verifica que el `AppContext` esté configurado correctamente
2. Asegúrate de que el endpoint de verificación esté disponible
3. Revisa la consola del navegador para errores

### Verificación muy frecuente

1. Modifica el intervalo en `useConnectionStatus`
2. Ajusta la lógica de verificación según tus necesidades

### Personalización de mensajes

1. Modifica los textos en los componentes
2. Usa variables de entorno para mensajes dinámicos
3. Implementa internacionalización (i18n)

## 📞 Soporte

Si tienes problemas con el sistema de manejo de errores de conexión:

1. Revisa la documentación de axios
2. Verifica la configuración del backend
3. Consulta los logs del navegador
4. Contacta al equipo de desarrollo

---

**Desarrollado para Localix Dashboard** 🚀
