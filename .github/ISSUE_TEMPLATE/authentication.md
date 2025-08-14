---
name: Authentication Issue
about: Report a problem with authentication functionality or suggest improvements
title: '[AUTH] '
labels: 'authentication'
assignees: 'miguelnexs'

---

## 🔐 Reporte de Autenticación

### 🔍 Tipo de Problema

- [ ] **Login**: Problema con inicio de sesión
- [ ] **Logout**: Problema con cierre de sesión
- [ ] **Registro**: Problema con registro de usuarios
- [ ] **Recuperación**: Problema con recuperación de contraseña
- [ ] **Tokens**: Problema con tokens JWT
- [ ] **Sesiones**: Problema con sesiones
- [ ] **Permisos**: Problema con permisos/roles
- [ ] **OAuth**: Problema con autenticación OAuth
- [ ] **2FA**: Problema con autenticación de dos factores

### 📋 Descripción

Describe el problema de autenticación de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de autenticación tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a '....'
2. Ingresa '....'
3. Haz clic en '....'
4. Observa el error '....'

### 🔐 Información de Autenticación

- **Tipo de autenticación**: [ej. Email/contraseña, Usuario/contraseña, OAuth]
- **Proveedor**: [ej. Local, Google, Facebook, GitHub]
- **Método**: [ej. JWT, Session, Token, API Key]
- **Duración**: [ej. 1 hora, 24 horas, 7 días, Indefinido]

### 👤 Información del Usuario

- **Usuario**: [ej. admin, user123, test@example.com]
- **Rol**: [ej. Admin, User, Manager, Guest]
- **Permisos**: [ej. read, write, admin, superuser]
- **Estado**: [ej. Activo, Inactivo, Bloqueado, Pendiente]

### 🔑 Información de Credenciales

- **Tipo de credencial**: [ej. Email, Username, Phone]
- **Formato**: [ej. user@example.com, user123, +1234567890]
- **Validación**: [ej. Email válido, Username único, Phone requerido]
- **Seguridad**: [ej. Contraseña fuerte, 2FA, Captcha]

### 🐛 Error de Autenticación

Si hay un error específico:

```javascript
// Error en la consola
Error: Authentication failed
    at login (Auth.jsx:123)
    at handleSubmit (Auth.jsx:145)
```

```json
// Error de API
{
  "error": "Invalid credentials",
  "status_code": 401,
  "details": {
    "username": ["User not found"],
    "password": ["Incorrect password"]
  }
}
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```javascript
// Datos de login
const loginData = {
  username: "user@example.com",
  password: "password123",
  remember: true
};

// Datos de registro
const registerData = {
  username: "newuser",
  email: "newuser@example.com",
  password: "password123",
  confirmPassword: "password123"
};
```

### ⏱️ Información de Rendimiento

- **Tiempo de login**: [ej. 5 segundos]
- **Tiempo esperado**: [ej. 2 segundos]
- **Tiempo de logout**: [ej. 3 segundos]
- **Tiempo de registro**: [ej. 10 segundos]

### 🎯 Área Afectada

- [ ] **Frontend**: Interfaz de autenticación
- [ ] **Backend**: Lógica de autenticación
- [ ] **Base de datos**: Almacenamiento de usuarios
- [ ] **API**: Endpoints de autenticación
- [ ] **Middleware**: Middleware de autenticación
- [ ] **Sesiones**: Gestión de sesiones

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Librerías**: [ej. djangorestframework-simplejwt, django-allauth]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Interfaz de login**: Formulario de login
- **Error de autenticación**: Mensaje de error
- **Estado de sesión**: Estado actual de la sesión
- **Consola**: Errores en la consola del navegador

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar la autenticación:

- **Mejor seguridad**: Mejoras de seguridad
- **Mejor UX**: Mejoras en la experiencia de usuario
- **Nuevos métodos**: Nuevos métodos de autenticación
- **Mejor validación**: Mejoras en la validación

### 🔗 Enlaces Útiles

- [Guía de Autenticación](https://github.com/miguelnexs/localix/wiki/authentication)
- [Seguridad](https://github.com/miguelnexs/localix/wiki/security)
- [JWT](https://github.com/miguelnexs/localix/wiki/jwt)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de autenticación.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la autenticación?
- **Frecuencia**: ¿Con qué frecuencia haces login/logout?
- **Propósito**: ¿Qué haces después de autenticarte?

### 📊 Métricas de Autenticación

- **Logins por día**: [ej. 100 logins]
- **Tasa de éxito**: [ej. 95% exitosos]
- **Tiempo promedio**: [ej. 3 segundos]
- **Usuarios activos**: [ej. 50 usuarios]

### 🔄 Flujo de Autenticación

- **Login**: [ej. Email/contraseña, OAuth, SSO]
- **Logout**: [ej. Manual, Automático, Timeout]
- **Recuperación**: [ej. Email, SMS, Preguntas de seguridad]
- **Registro**: [ej. Email, Invitación, Auto-registro]

### 🔒 Seguridad

- **Contraseñas**: [ej. Mínimo 8 caracteres, Incluir números/símbolos]
- **2FA**: [ej. SMS, Email, App authenticator]
- **Rate limiting**: [ej. 5 intentos por minuto, Bloqueo temporal]
- **Sesiones**: [ej. Única, Múltiple, Timeout automático]

### 📱 Dispositivos

- **Dispositivo**: [ej. Desktop, Mobile, Tablet]
- **Navegador**: [ej. Chrome, Firefox, Safari, Edge]
- **OS**: [ej. Windows, macOS, Linux, iOS, Android]

### 🌐 Red

- **Conexión**: [ej. WiFi, Ethernet, Móvil]
- **Velocidad**: [ej. Rápida, Lenta, Inestable]
- **Proxy**: [ej. Sin proxy, Con proxy, VPN]

---

**Gracias por reportar este problema de autenticación. Tu feedback nos ayuda a mantener Localix como una herramienta segura y confiable.** 🔐
