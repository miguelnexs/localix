# 🔧 Solución al Bucle Infinito de Refresh Tokens

## Problema
El AuthContext está intentando refrescar tokens inválidos en un bucle infinito, causando errores 401 repetitivos.

## Causa
Los tokens almacenados en localStorage han expirado o son inválidos, pero el interceptor de Axios sigue intentando refrescarlos.

## Solución

### Opción 1: Limpiar tokens desde la consola del navegador (Recomendado)

1. Abre la aplicación en el navegador
2. Presiona `F12` para abrir las herramientas de desarrollador
3. Ve a la pestaña "Console"
4. Copia y pega el siguiente código:

```javascript
// Limpiar tokens
localStorage.removeItem('access_token');
localStorage.removeItem('refresh_token');

// Limpiar cualquier otro token
const keys = Object.keys(localStorage);
keys.forEach(key => {
  if (key.includes('token') || key.includes('auth') || key.includes('user')) {
    localStorage.removeItem(key);
  }
});

// Recargar página
window.location.reload();
```

5. Presiona Enter para ejecutar
6. La página se recargará automáticamente y te llevará al login

### Opción 2: Usar la página de limpieza

1. Abre `http://localhost:3000/clear-tokens.html` en tu navegador
2. Haz clic en "🗑️ Limpiar Todos los Tokens"
3. Haz clic en "🚀 Ir a la Aplicación"

### Opción 3: Limpiar manualmente desde las herramientas de desarrollador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Application" o "Storage"
3. Busca "Local Storage" en el panel izquierdo
4. Elimina manualmente:
   - `access_token`
   - `refresh_token`
   - Cualquier otro token relacionado
5. Recarga la página

## Verificación

Después de limpiar los tokens:

1. Deberías ver la página de login
2. No deberían aparecer más errores 401 en la consola
3. Puedes hacer login nuevamente con tus credenciales

## Prevención

El AuthContext ha sido mejorado para:

- Evitar múltiples intentos simultáneos de refresh
- Manejar correctamente los errores de refresh token
- Hacer logout automático cuando el refresh token es inválido
- Usar una cola para manejar múltiples requests durante el refresh

## Archivos Modificados

- `src/context/AuthContext.jsx` - Mejorado el manejo de refresh tokens
- `clear-tokens.html` - Página para limpiar tokens
- `clear-tokens-console.js` - Script para consola del navegador

## Notas Técnicas

- El backend está funcionando correctamente
- Los tokens se generan y validan apropiadamente
- El problema era específicamente en el frontend con tokens expirados
- La solución implementa un sistema de cola para evitar condiciones de carrera
