# 🔌 Sistema de Detección de Conexión a la Base de Datos

## 📋 Descripción

Este sistema detecta automáticamente cuando no hay conexión a la base de datos y muestra mensajes elegantes al usuario. **Solo se activa cuando realmente hay problemas de conexión**.

## 🎯 Características

### ✅ **Detección Automática**
- Verifica la conexión al iniciar la aplicación
- Detecta errores de red en tiempo real
- Reintentos automáticos cada 30 segundos
- Interceptores de axios para detección continua

### ✅ **Interfaz de Usuario**
- **Modal elegante** cuando no hay conexión
- **Indicador superior** en tiempo real
- **Página de error** para páginas protegidas
- **Mensajes claros** y útiles

### ✅ **Tipos de Errores Detectados**
- ❌ Servidor no disponible
- ❌ Base de datos fuera de servicio
- ❌ Problemas de red
- ❌ Timeouts de conexión
- ❌ Errores HTTP 500+

## 🚀 Componentes

### 1. **ConnectionErrorModal**
Modal que aparece cuando no hay conexión a la base de datos.

**Cuándo aparece:**
- Al iniciar la aplicación sin conexión
- Cuando se pierde la conexión durante el uso
- Cuando el servidor responde con errores 500+

**Características:**
- Diseño elegante y responsive
- Lista de posibles causas
- Botones de acción (reintentar, recargar)
- Soporte para modo oscuro

### 2. **ConnectionStatusIndicator**
Indicador pequeño en la esquina superior derecha.

**Cuándo aparece:**
- Solo cuando hay problemas de conexión
- Muestra estado de verificación
- Botón de reintento rápido

### 3. **ConnectionErrorPage**
Página completa de error para páginas que requieren conexión.

**Uso:**
```jsx
import { useConnectionGuard } from '../hooks/useConnectionGuard';

const ProductsPage = () => {
  const { ConnectionGuard } = useConnectionGuard();
  
  return (
    <ConnectionGuard>
      <div>Contenido que requiere BD</div>
    </ConnectionGuard>
  );
};
```

## 🔧 Configuración

### **Archivo de Configuración**
`src/utils/connectionConfig.js`

```javascript
export const CONNECTION_CONFIG = {
  TEST_ENDPOINT: '/api/categorias/test_connection/',
  CHECK_INTERVAL: 30000, // 30 segundos
  REQUEST_TIMEOUT: 10000, // 10 segundos
  
  // Mensajes personalizables
  MESSAGES: {
    TITLE: 'Sin Conexión a la Base de Datos',
    DESCRIPTION: 'No se puede establecer conexión con la base de datos del sistema.',
    // ... más configuraciones
  }
};
```

### **Configuración de Debug**
```javascript
DEBUG: {
  ENABLED: false, // Solo true para desarrollo
  LOG_LEVEL: 'error', // Solo errores importantes
  SHOW_TEST_PANEL: false // Panel de prueba deshabilitado
}
```

## 📱 Cómo Funciona

### **1. Verificación Inicial**
- Al cargar la aplicación, se verifica la conexión
- Si hay error, se muestra el modal inmediatamente

### **2. Detección en Tiempo Real**
- Interceptores de axios detectan errores automáticamente
- Cualquier petición fallida activa el sistema de error

### **3. Reintentos Automáticos**
- Cada 30 segundos se verifica la conexión
- Si se restaura, se oculta automáticamente el error

### **4. Verificación Manual**
- El usuario puede reintentar manualmente
- Botón "Recargar Página" como alternativa

## 🎨 Personalización

### **Mensajes**
Modifica los mensajes en `connectionConfig.js`:

```javascript
MESSAGES: {
  TITLE: 'Tu título personalizado',
  DESCRIPTION: 'Tu descripción personalizada',
  CAUSES: ['Causa 1', 'Causa 2', 'Causa 3'],
  SOLUTIONS: ['Solución 1', 'Solución 2', 'Solución 3']
}
```

### **Colores y Estilos**
Los componentes usan Tailwind CSS y pueden ser personalizados:

```jsx
// Ejemplo de personalización
<div className="bg-red-500 text-white px-4 py-2 rounded-lg">
  Tu mensaje personalizado
</div>
```

### **Intervalos**
Ajusta los tiempos de verificación:

```javascript
CHECK_INTERVAL: 60000, // 1 minuto
REQUEST_TIMEOUT: 15000, // 15 segundos
```

## 🧪 Testing

### **Para Probar el Sistema:**

1. **Detener el servidor backend:**
   ```bash
   # En el directorio del backend
   Ctrl+C # Para detener Django
   ```

2. **Cambiar la URL del backend:**
   - Modifica `apiConfig.js` temporalmente
   - Cambia a una URL inexistente

3. **Desconectar internet:**
   - Desconecta temporalmente la red
   - El sistema detectará el error

### **Verificar que Funciona:**
- ✅ Modal aparece automáticamente
- ✅ Indicador superior se muestra
- ✅ Botones de acción funcionan
- ✅ Se oculta cuando se restaura la conexión

## 🐛 Solución de Problemas

### **El modal no aparece:**
1. Verifica que el backend esté ejecutándose
2. Revisa la consola del navegador
3. Asegúrate de que el endpoint `/api/categorias/test_connection/` funcione

### **Aparece cuando no debería:**
1. Verifica la configuración de errores en `connectionConfig.js`
2. Revisa los logs de consola
3. Ajusta los umbrales de detección

### **No se oculta al restaurar conexión:**
1. Verifica que el endpoint de prueba responda correctamente
2. Revisa los interceptores de axios
3. Comprueba que no haya errores en la consola

## 📞 Soporte

Si tienes problemas:

1. **Revisa la consola del navegador** para errores
2. **Verifica que el backend esté funcionando**
3. **Comprueba la configuración** en `connectionConfig.js`
4. **Revisa los logs del servidor** para errores 500+

---

**Sistema desarrollado para Localix Dashboard** 🚀

*El sistema está diseñado para ser discreto y solo aparecer cuando realmente hay problemas de conexión a la base de datos.*
