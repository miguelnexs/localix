# Solución Rápida para Error de Creación de Clientes

## Error Específico
```
TypeError: Cannot read properties of undefined (reading 'crear')
```

## Causa del Problema
El error indica que `window.clientesAPI` no está disponible o no tiene el método `crear`. Esto sucede cuando:
1. Los handlers de clientes no se registraron correctamente
2. El preload no se configuró correctamente
3. La aplicación Electron no se reinició después de cambios

## Solución Inmediata

### Paso 1: Reiniciar la Aplicación
**Windows:**
```bash
# Ejecutar el script de reinicio
Localix-dashboard/reiniciar_aplicacion.bat
```

**Linux/Mac:**
```bash
# Ejecutar el script de reinicio
./Localix-dashboard/reiniciar_aplicacion.sh
```

**Manual:**
1. Cerrar completamente la aplicación Electron
2. Esperar 5 segundos
3. Volver a abrir la aplicación

### Paso 2: Verificar que el Servidor Django esté Ejecutándose
```bash
cd Localix-backend
python manage.py runserver
```

### Paso 3: Verificar la API en la Consola
1. Abrir la aplicación Electron
2. Presionar F12 para abrir herramientas de desarrollador
3. Ir a la pestaña Console
4. Copiar y pegar el siguiente código:

```javascript
// Verificación rápida
console.log('🔍 Verificando API de clientes...');
console.log('window.clientesAPI:', window.clientesAPI ? '✅ Disponible' : '❌ No disponible');

if (window.clientesAPI) {
  console.log('Métodos disponibles:', Object.keys(window.clientesAPI));
  console.log('crear disponible:', typeof window.clientesAPI.crear === 'function' ? '✅ Sí' : '❌ No');
} else {
  console.log('❌ PROBLEMA: window.clientesAPI no está disponible');
  console.log('🔧 Solución: Reiniciar la aplicación Electron');
}
```

## Si el Problema Persiste

### Opción 1: Verificación Completa
Ejecutar el script completo de verificación:

```javascript
// Copiar y pegar el contenido de verificar_clientes_api.js en la consola
```

### Opción 2: Verificar Handlers
En la consola de la aplicación Electron, ejecutar:

```javascript
// Verificar si los handlers están registrados
console.log('🔍 Verificando handlers...');
console.log('window.electronAPI:', window.electronAPI ? '✅ Disponible' : '❌ No disponible');
console.log('window.ventasAPI:', window.ventasAPI ? '✅ Disponible' : '❌ No disponible');
console.log('window.pedidosAPI:', window.pedidosAPI ? '✅ Disponible' : '❌ No disponible');
```

### Opción 3: Limpiar Cache
1. Cerrar la aplicación
2. Eliminar la carpeta de cache:
   - **Windows**: `%APPDATA%\Localix`
   - **Linux/Mac**: `~/.config/Localix`
3. Reiniciar la aplicación

## Verificación de la Solución

Después de aplicar la solución, deberías poder:

1. **Crear un cliente** sin errores
2. **Ver en la consola** que `window.clientesAPI` está disponible
3. **Ver que el método `crear`** es una función

### Prueba Rápida
```javascript
// En la consola del navegador
if (window.clientesAPI && typeof window.clientesAPI.crear === 'function') {
  console.log('✅ API de clientes funcionando correctamente');
  
  // Probar creación
  window.clientesAPI.crear({
    nombre: 'Cliente Test',
    email: 'test@example.com',
    telefono: '3001234567',
    tipo_documento: 'dni',
    numero_documento: '12345678',
    direccion: 'Dirección test',
    activo: true
  }).then(result => {
    console.log('✅ Cliente creado:', result);
  }).catch(error => {
    console.log('❌ Error:', error);
  });
} else {
  console.log('❌ API de clientes no está funcionando');
}
```

## Logs Útiles

### Backend (Django)
```bash
cd Localix-backend
python manage.py runserver --verbosity=2
```

### Frontend (Electron)
En la consola del navegador, buscar mensajes que contengan:
- `[CLIENTE HANDLERS]`
- `[MAIN]`
- `window.clientesAPI`

## Contacto

Si el problema persiste después de seguir estos pasos:
1. Revisar los logs del backend y frontend
2. Verificar que todas las dependencias estén instaladas
3. Probar en un entorno limpio

## Notas Importantes

- **Siempre reiniciar** la aplicación Electron después de cambios en el código
- **Verificar que el servidor Django** esté ejecutándose antes de abrir la aplicación
- **Los handlers se registran** cuando se inicia la aplicación Electron
- **El preload se ejecuta** en cada ventana de la aplicación 