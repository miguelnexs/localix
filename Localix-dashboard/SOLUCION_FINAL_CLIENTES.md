# Solución Final para Error de Clientes

## Problema Identificado
```
❌ window.clientesAPI no está disponible
```

## Diagnóstico
El problema es que los handlers de clientes no se están registrando correctamente en el main process de Electron, lo que impide que `window.clientesAPI` esté disponible en el renderer process.

## Solución Paso a Paso

### Paso 1: Verificar el Backend (Ya Completado)
✅ El backend está funcionando correctamente:
- Base de datos conectada
- Migraciones aplicadas
- Permisos correctos
- API de clientes funcionando

### Paso 2: Reiniciar Completamente la Aplicación

#### Opción A: Script Automático (Recomendado)
```bash
# Windows
Localix-dashboard/reiniciar_completo.bat

# Linux/Mac
./Localix-dashboard/reiniciar_completo.sh
```

#### Opción B: Manual
1. **Cerrar completamente** la aplicación Electron
2. **Esperar 5 segundos**
3. **Eliminar cache** (opcional):
   - Windows: `%APPDATA%\Localix`
   - Linux/Mac: `~/.config/Localix`
4. **Reiniciar** la aplicación

### Paso 3: Verificar la Solución

1. **Abrir la aplicación Electron**
2. **Presionar F12** para abrir herramientas de desarrollador
3. **Ir a la pestaña Console**
4. **Copiar y pegar** el siguiente código:

```javascript
// Verificación rápida
console.log('🔍 Verificando API de clientes...');
console.log('window.clientesAPI:', window.clientesAPI ? '✅ Disponible' : '❌ No disponible');

if (window.clientesAPI) {
  console.log('Métodos disponibles:', Object.keys(window.clientesAPI));
  console.log('crear disponible:', typeof window.clientesAPI.crear === 'function' ? '✅ Sí' : '❌ No');
  
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
  console.log('❌ PROBLEMA: window.clientesAPI no está disponible');
  console.log('🔧 Solución: Reiniciar la aplicación Electron');
}
```

### Paso 4: Si el Problema Persiste

#### Ejecutar Diagnóstico Completo
Copiar y pegar el contenido de `verificacion_rapida.js` en la consola del navegador.

#### Verificar Logs del Main Process
En la consola donde ejecutaste `npm run dev`, buscar mensajes que contengan:
- `[CLIENTE HANDLERS]`
- `[MAIN]`
- `Handlers de clientes`

#### Verificar que el Servidor Django esté Ejecutándose
```bash
cd Localix-backend
python manage.py runserver
```

## Verificación de la Solución

Después de aplicar la solución, deberías ver:

### En la Consola del Navegador:
```
✅ window.clientesAPI está disponible
✅ Métodos disponibles: ['obtenerTodos', 'crear', 'actualizar', 'eliminar', 'buscar']
✅ crear disponible: Sí
✅ Cliente creado: {success: true, data: {...}}
```

### En la Aplicación:
- ✅ Poder crear clientes sin errores
- ✅ Ver mensajes de éxito
- ✅ Los clientes se guardan correctamente

## Logs Útiles para Debugging

### Backend (Django)
```bash
cd Localix-backend
python manage.py runserver --verbosity=2
```

### Frontend (Electron)
En la consola del navegador, buscar:
- `[CLIENTE HANDLERS]`
- `[MAIN]`
- `window.clientesAPI`

### Main Process
En la terminal donde ejecutas `npm run dev`:
- `[MAIN] 👥 Configurando handlers de clientes...`
- `[MAIN] ✅ Handlers de clientes configurados exitosamente`

## Problemas Comunes y Soluciones

### Problema: "window.clientesAPI no está disponible"
**Solución**: Reiniciar la aplicación Electron

### Problema: "Handlers no se registraron correctamente"
**Solución**: Verificar que no haya errores en la importación de handlers

### Problema: "Error de autenticación"
**Solución**: Iniciar sesión nuevamente

### Problema: "Servidor no responde"
**Solución**: Iniciar el servidor Django

## Contacto

Si el problema persiste después de seguir estos pasos:

1. **Ejecutar el diagnóstico completo** con `verificacion_rapida.js`
2. **Revisar todos los logs** (backend, frontend, main process)
3. **Verificar la configuración** de la base de datos
4. **Probar en un entorno limpio**

## Notas Importantes

- **Siempre reiniciar** la aplicación Electron después de cambios en el código
- **Los handlers se registran** cuando se inicia la aplicación Electron
- **El preload se ejecuta** en cada ventana de la aplicación
- **Verificar que el servidor Django** esté ejecutándose antes de abrir la aplicación 