# Sistema de Login - Localix

## 🚀 Características Implementadas

### Backend (Django)
- ✅ Modelo de usuario personalizado con roles
- ✅ Autenticación JWT (JSON Web Tokens)
- ✅ API REST para login/logout
- ✅ Gestión de usuarios (CRUD)
- ✅ Protección de rutas por roles
- ✅ Refresh tokens automático
- ✅ Validación de contraseñas
- ✅ Admin de Django personalizado

### Frontend (React + Electron)
- ✅ Página de login moderna y responsiva
- ✅ Context de autenticación con React
- ✅ Protección de rutas
- ✅ Interceptores de axios para tokens
- ✅ Gestión de estado de autenticación
- ✅ Logout automático
- ✅ Información del usuario en sidebar
- ✅ Redirección automática

## 👥 Usuarios de Prueba

Se han creado los siguientes usuarios para testing:

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `admin123`
- **Rol:** Administrador
- **Permisos:** Acceso completo al sistema

### Vendedor
- **Usuario:** `vendedor`
- **Contraseña:** `vendedor123`
- **Rol:** Vendedor
- **Permisos:** Gestión de ventas y productos

### Inventario
- **Usuario:** `inventario`
- **Contraseña:** `inventario123`
- **Rol:** Inventario
- **Permisos:** Gestión de productos y stock

## 🔧 Configuración

### Backend
1. **Modelo de Usuario:** `Localix-backend/usuarios/models.py`
2. **API Views:** `Localix-backend/usuarios/views.py`
3. **Serializers:** `Localix-backend/usuarios/serializers.py`
4. **URLs:** `Localix-backend/usuarios/urls.py`
5. **Configuración JWT:** `Localix-backend/Backend/settings.py`

### Frontend
1. **Context de Auth:** `Localix-dashboard/src/renderer/src/context/AuthContext.jsx`
2. **Página de Login:** `Localix-dashboard/src/renderer/src/pages/LoginPage.jsx`
3. **Protección de Rutas:** `Localix-dashboard/src/renderer/src/components/auth/ProtectedRoute.jsx`
4. **Router:** `Localix-dashboard/src/renderer/src/routes/AppRouter.jsx`

## 🌐 Endpoints de la API

### Autenticación
- `POST /api/usuarios/login/` - Iniciar sesión
- `POST /api/usuarios/logout/` - Cerrar sesión
- `GET /api/usuarios/profile/` - Obtener perfil del usuario
- `PUT /api/usuarios/profile/` - Actualizar perfil
- `POST /api/usuarios/change-password/` - Cambiar contraseña

### Gestión de Usuarios (Solo Admin)
- `GET /api/usuarios/usuarios/` - Listar usuarios
- `POST /api/usuarios/usuarios/create/` - Crear usuario
- `GET /api/usuarios/usuarios/{id}/` - Obtener usuario
- `PUT /api/usuarios/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/usuarios/{id}/` - Eliminar usuario
- `POST /api/usuarios/usuarios/{id}/toggle-status/` - Activar/desactivar usuario

## 🔐 Roles y Permisos

### Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios
- Configuración del sistema
- Reportes y estadísticas

### Vendedor
- Gestión de ventas
- Gestión de clientes
- Consulta de productos
- Gestión de pedidos

### Inventario
- Gestión de productos
- Gestión de categorías
- Control de stock
- Gestión de colores y variantes

### Solo Lectura
- Consulta de datos
- Sin permisos de modificación

## 🚀 Cómo Usar

### 1. Iniciar el Backend
```bash
cd Localix-backend
python manage.py runserver 8000
```

### 2. Iniciar el Frontend
```bash
cd Localix-dashboard
npm run dev
```

### 3. Acceder al Sistema
1. Abrir la aplicación en el navegador
2. Serás redirigido automáticamente a `/login`
3. Usar cualquiera de los usuarios de prueba
4. Después del login exitoso, serás redirigido al dashboard

## 🔄 Flujo de Autenticación

1. **Login:** Usuario ingresa credenciales
2. **Validación:** Backend valida credenciales
3. **Tokens:** Se generan access y refresh tokens
4. **Almacenamiento:** Tokens se guardan en localStorage
5. **Interceptores:** Axios incluye automáticamente el token en las peticiones
6. **Refresh:** Si el token expira, se renueva automáticamente
7. **Logout:** Se invalidan los tokens y se limpia el localStorage

## 🛡️ Seguridad

- **JWT Tokens:** Autenticación stateless
- **Refresh Tokens:** Renovación automática de sesiones
- **Validación de Contraseñas:** Requisitos mínimos de seguridad
- **Protección de Rutas:** Verificación de autenticación y roles
- **Interceptores:** Manejo automático de tokens expirados
- **Logout Seguro:** Invalidación de tokens en el servidor

## 🎨 Características de la UI

- **Diseño Responsivo:** Funciona en desktop y móvil
- **Tema Oscuro/Claro:** Soporte para múltiples temas
- **Validación en Tiempo Real:** Feedback inmediato al usuario
- **Estados de Carga:** Indicadores visuales durante operaciones
- **Mensajes de Error:** Información clara sobre problemas
- **Navegación Intuitiva:** Flujo de usuario optimizado

## 🔧 Personalización

### Agregar Nuevos Roles
1. Modificar `ROLES` en `usuarios/models.py`
2. Actualizar permisos en las vistas
3. Modificar la lógica de `ProtectedRoute`

### Cambiar Configuración JWT
1. Editar `SIMPLE_JWT` en `settings.py`
2. Ajustar tiempos de expiración
3. Configurar algoritmos de encriptación

### Personalizar UI de Login
1. Modificar `LoginPage.jsx`
2. Cambiar estilos CSS
3. Agregar validaciones adicionales

## 🐛 Solución de Problemas

### Error de Conexión
- Verificar que el backend esté corriendo en puerto 8000
- Revisar configuración de CORS en `settings.py`

### Token Expirado
- El sistema renueva automáticamente los tokens
- Si persiste, hacer logout y login nuevamente

### Error de Permisos
- Verificar que el usuario tenga el rol correcto
- Revisar configuración de `ProtectedRoute`

### Problemas de Migración
- Ejecutar `python manage.py migrate`
- Si hay conflictos, usar `python create_table_manually.py`

## 📝 Notas Importantes

- Los tokens JWT tienen una duración de 1 hora (access) y 7 días (refresh)
- El sistema maneja automáticamente la renovación de tokens
- Todos los endpoints (excepto login) requieren autenticación
- Los usuarios inactivos no pueden hacer login
- El logout invalida los tokens en el servidor

## 🎯 Próximas Mejoras

- [ ] Autenticación de dos factores (2FA)
- [ ] Recuperación de contraseña por email
- [ ] Historial de sesiones
- [ ] Notificaciones de seguridad
- [ ] Integración con OAuth (Google, Facebook)
- [ ] Auditoría de acciones de usuarios
