# Configuración de Usuario Específico - Tienda Virtual

## Descripción

La tienda virtual ha sido configurada para mostrar específicamente los productos y categorías del usuario **'admin'**. Esta configuración permite que la tienda funcione como una tienda dedicada a un usuario particular del sistema.

## Archivos Modificados

### 1. `/src/config/user.ts` (NUEVO)
- Configuración centralizada del usuario específico
- Define que la tienda mostrará datos del usuario 'admin'
- Incluye funciones helper para construir URLs con parámetros de usuario

### 2. `/src/hooks/useProductos.ts` (MODIFICADO)
- Ahora obtiene productos específicamente del usuario 'admin'
- Mantiene el filtro de productos públicos
- URL de consulta: `/api/productos/productos/?usuario=admin&publicos=true`

### 3. `/src/hooks/useCategorias.ts` (MODIFICADO)
- Ahora obtiene categorías específicamente del usuario 'admin'
- Mantiene el filtro de categorías activas
- URL de consulta: `/api/categorias/?usuario=admin&activa=true`

### 4. `/src/config/api.ts` (ACTUALIZADO)
- Agregados filtros de configuración para usuarios
- Constantes para parámetros de consulta

## Configuración Actual

```typescript
export const USER_CONFIG = {
  USERNAME: 'admin',
  DISPLAY_NAME: 'Admin Store',
  STORE_DESCRIPTION: 'Tienda oficial del administrador',
  FILTERS: {
    PRODUCTOS_PUBLICOS: true,
    CATEGORIAS_ACTIVAS: true,
  }
};
```

## URLs de la API

La tienda ahora consulta:

- **Productos**: `http://softwarebycg.shop/api/productos/productos/?usuario=admin&publicos=true`
- **Categorías**: `http://softwarebycg.shop/api/categorias/?usuario=admin&activa=true`

## Cómo Cambiar el Usuario

Para cambiar la tienda a otro usuario:

1. Editar `/src/config/user.ts`
2. Cambiar el valor de `USERNAME` por el usuario deseado
3. Opcionalmente actualizar `DISPLAY_NAME` y `STORE_DESCRIPTION`
4. Reiniciar la aplicación

```typescript
// Ejemplo para cambiar a otro usuario
export const USER_CONFIG = {
  USERNAME: 'otro_usuario', // Cambiar aquí
  DISPLAY_NAME: 'Tienda de Otro Usuario',
  STORE_DESCRIPTION: 'Tienda oficial de otro usuario',
  // ... resto de la configuración
};
```

## Verificación

Para verificar que la configuración funciona correctamente:

1. Abrir las herramientas de desarrollador del navegador
2. Ir a la pestaña Network/Red
3. Recargar la página
4. Verificar que las peticiones a la API incluyan el parámetro `usuario=admin`

## Notas Importantes

- La tienda solo mostrará productos y categorías del usuario especificado
- Los productos deben estar marcados como públicos para aparecer
- Las categorías deben estar activas para aparecer
- El backend debe soportar el filtrado por usuario en los endpoints correspondientes