# Corrección de Problemas con la Creación de Clientes

## Descripción del Problema

Se han identificado problemas en la funcionalidad de creación de clientes en el sistema Localix. Este documento proporciona las herramientas y pasos para diagnosticar y corregir estos problemas.

## Herramientas de Diagnóstico

### 1. Script de Prueba del Backend
**Archivo**: `Localix-backend/test_cliente_creation.py`

Este script verifica:
- Conectividad con la base de datos
- Migraciones aplicadas
- Permisos de usuario
- Creación de clientes de prueba

**Uso**:
```bash
cd Localix-backend
python test_cliente_creation.py
```

### 2. Script de Corrección del Backend
**Archivo**: `Localix-backend/fix_cliente_creation.py`

Este script corrige automáticamente:
- Problemas de migraciones
- Usuarios faltantes
- Permisos de base de datos
- Configuración del modelo Cliente

**Uso**:
```bash
cd Localix-backend
python fix_cliente_creation.py
```

### 3. Script de Diagnóstico del Frontend
**Archivo**: `Localix-dashboard/fix_frontend_cliente.js`

Este script verifica:
- Conectividad con el servidor
- Autenticación
- API de clientes
- Componentes React

**Uso**:
1. Cargar el script en la consola del navegador
2. Ejecutar: `window.diagnosticoClientes.main()`

## Pasos de Corrección

### Paso 1: Verificar el Backend

1. **Navegar al directorio del backend**:
   ```bash
   cd Localix-backend
   ```

2. **Ejecutar el script de corrección**:
   ```bash
   python fix_cliente_creation.py
   ```

3. **Verificar que el servidor esté ejecutándose**:
   ```bash
   python manage.py runserver
   ```

### Paso 2: Verificar el Frontend

1. **Abrir la aplicación Electron**

2. **Abrir las herramientas de desarrollador** (F12)

3. **Cargar el script de diagnóstico**:
   ```javascript
   // Copiar y pegar el contenido de fix_frontend_cliente.js en la consola
   ```

4. **Ejecutar el diagnóstico**:
   ```javascript
   window.diagnosticoClientes.main()
   ```

### Paso 3: Verificar la Base de Datos

1. **Conectar a PostgreSQL**:
   ```bash
   psql -U productos -d tiendadb -h localhost
   ```

2. **Verificar la tabla de clientes**:
   ```sql
   \dt ventas_cliente
   ```

3. **Verificar permisos**:
   ```sql
   SELECT has_table_privilege('productos', 'ventas_cliente', 'INSERT');
   SELECT has_table_privilege('productos', 'ventas_cliente', 'SELECT');
   ```

### Paso 4: Verificar Migraciones

1. **Verificar migraciones pendientes**:
   ```bash
   python manage.py showmigrations ventas
   ```

2. **Aplicar migraciones si es necesario**:
   ```bash
   python manage.py migrate ventas
   ```

3. **Crear migraciones si es necesario**:
   ```bash
   python manage.py makemigrations ventas
   ```

## Problemas Comunes y Soluciones

### Problema 1: "No se puede conectar al servidor"
**Síntomas**: Error de conexión al intentar crear clientes

**Soluciones**:
1. Verificar que Django esté ejecutándose en puerto 8000
2. Verificar la configuración de CORS en settings.py
3. Verificar que no haya firewall bloqueando el puerto

### Problema 2: "Token inválido o expirado"
**Síntomas**: Error 401 al intentar crear clientes

**Soluciones**:
1. Iniciar sesión nuevamente en la aplicación
2. Verificar que el token esté en localStorage
3. Verificar la configuración de JWT en el backend

### Problema 3: "API de clientes no disponible"
**Síntomas**: window.clientesAPI no está definido

**Soluciones**:
1. Reiniciar la aplicación Electron
2. Verificar que el preload esté configurado correctamente
3. Verificar que los handlers estén registrados

### Problema 4: "Error en la base de datos"
**Síntomas**: Error al crear cliente en la base de datos

**Soluciones**:
1. Verificar que la tabla ventas_cliente existe
2. Verificar permisos del usuario de la base de datos
3. Verificar que las migraciones estén aplicadas

### Problema 5: "Error de validación"
**Síntomas**: Error 400 con mensajes de validación

**Soluciones**:
1. Verificar que todos los campos requeridos estén completos
2. Verificar el formato de los datos (email, teléfono, etc.)
3. Verificar que el usuario esté autenticado

## Verificación de la Corrección

### 1. Prueba de Creación de Cliente
1. Abrir la aplicación
2. Ir a la sección de clientes
3. Hacer clic en "Nuevo Cliente"
4. Llenar el formulario con datos válidos
5. Hacer clic en "Crear Cliente"
6. Verificar que el cliente se cree exitosamente

### 2. Prueba de Listado de Clientes
1. Ir a la lista de clientes
2. Verificar que se muestren los clientes existentes
3. Verificar que se pueda buscar clientes
4. Verificar que se pueda editar clientes

### 3. Prueba de Integración
1. Crear un cliente
2. Crear una venta con ese cliente
3. Verificar que la venta se asocie correctamente al cliente

## Logs y Debugging

### Backend Logs
Para ver logs detallados del backend:
```bash
python manage.py runserver --verbosity=2
```

### Frontend Logs
Para ver logs del frontend:
1. Abrir herramientas de desarrollador (F12)
2. Ir a la pestaña Console
3. Ejecutar el script de diagnóstico

### Base de Datos Logs
Para ver logs de PostgreSQL:
```bash
tail -f /var/log/postgresql/postgresql-*.log
```

## Configuración de Desarrollo

### Variables de Entorno
Asegúrate de que estas variables estén configuradas:

```bash
# Backend
export DJANGO_SETTINGS_MODULE=Backend.settings
export DEBUG=True
export API_BASE_URL=http://localhost:8000

# Frontend
export REACT_APP_API_URL=http://localhost:8000
```

### Configuración de CORS
En `Backend/settings.py`, asegúrate de que CORS esté configurado:

```python
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # Agregar otros orígenes según sea necesario
]
```

## Contacto y Soporte

Si los problemas persisten después de seguir estos pasos:

1. **Revisar los logs** para errores específicos
2. **Verificar la configuración** de la base de datos
3. **Probar en un entorno limpio** para aislar el problema
4. **Documentar los errores** específicos encontrados

## Notas Importantes

- Siempre hacer backup de la base de datos antes de ejecutar scripts de corrección
- Verificar que las credenciales de la base de datos sean correctas
- Asegurarse de que el usuario tenga permisos suficientes
- Mantener actualizadas las dependencias del proyecto 