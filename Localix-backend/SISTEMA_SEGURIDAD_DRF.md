# Sistema de Seguridad para Django REST Framework

## 🛡️ Resumen Ejecutivo

Este documento describe el sistema de seguridad implementado para proteger tu API de Django REST Framework contra manipulaciones no autorizadas, manteniendo la funcionalidad completa del dashboard.

## 🔧 Medidas de Seguridad Implementadas

### 1. **Configuración de Producción Segura**
- **Archivo**: `Backend/settings_production.py`
- **Características**:
  - DEBUG deshabilitado
  - CORS configurado de forma restrictiva
  - Headers de seguridad habilitados
  - SSL/HTTPS forzado
  - Cookies seguras configuradas

### 2. **Middleware de Seguridad Personalizado**
- **Archivo**: `Backend/middleware.py`
- **Funcionalidades**:
  - Logging de seguridad en tiempo real
  - Detección de actividad sospechosa
  - Rate limiting automático
  - Bloqueo de IPs maliciosas
  - Headers de seguridad adicionales

### 3. **Sistema de Permisos Avanzado**
- **Archivo**: `Backend/permissions.py`
- **Permisos implementados**:
  - `SecureIsAuthenticated`: Autenticación con logging
  - `RateLimitPermission`: Rate limiting personalizado
  - `OwnerPermission`: Verificación de propiedad
  - `AdminOnlyPermission`: Solo administradores
  - `SecureModelPermission`: Permisos por modelo
  - `AuditPermission`: Auditoría completa

### 4. **Scripts de Seguridad**
- **Archivo**: `aplicar_seguridad.py`
- **Funcionalidades**:
  - Generación de SECRET_KEY segura
  - Verificación de configuración
  - Aplicación automática de medidas
  - Creación de scripts de monitoreo

## 🚀 Instalación y Configuración

### Paso 1: Aplicar Medidas de Seguridad
```bash
cd Localix-backend
python aplicar_seguridad.py
```

### Paso 2: Instalar Paquetes de Seguridad
```bash
pip install -r requirements_seguridad.txt
```

### Paso 3: Configurar Variables de Entorno
Crear archivo `.env`:
```env
SECRET_KEY=tu_secret_key_generada
DEBUG=False
DB_NAME=tiendadb
DB_USER=productos
DB_PASSWORD=tu_password_seguro
DB_HOST=localhost
DB_PORT=5432
```

### Paso 4: Usar Configuración de Producción
```bash
export DJANGO_SETTINGS_MODULE=Backend.settings_production
python manage.py runserver
```

## 🔒 Características de Seguridad

### **Autenticación y Autorización**
- ✅ JWT tokens con rotación automática
- ✅ Tokens de acceso cortos (30 minutos)
- ✅ Refresh tokens con blacklist
- ✅ Verificación de usuarios activos
- ✅ Permisos granulares por modelo

### **Rate Limiting**
- ✅ 100 requests/hora para usuarios anónimos
- ✅ 1000 requests/hora para usuarios autenticados
- ✅ Rate limiting personalizado por endpoint
- ✅ Cache-based rate limiting

### **Logging y Auditoría**
- ✅ Logging de seguridad en tiempo real
- ✅ Auditoría de todas las acciones
- ✅ Detección de actividad sospechosa
- ✅ Logs separados para seguridad

### **Protección contra Ataques**
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Clickjacking protection
- ✅ Content type sniffing protection
- ✅ SQL injection protection
- ✅ IP blocking
- ✅ User-Agent filtering

### **Headers de Seguridad**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy configurado

## 📊 Monitoreo y Alertas

### **Script de Monitoreo**
```bash
python monitoreo_seguridad.py
```

**Funcionalidades**:
- Verificación de logs de seguridad
- Monitoreo de usuarios sospechosos
- Verificación de conexiones a BD
- Estado del caché
- Alertas automáticas

### **Logs de Seguridad**
- **Archivo**: `logs/security.log`
- **Contenido**:
  - Intentos de acceso no autorizado
  - Actividad sospechosa
  - Rate limit excedido
  - Errores de autenticación
  - Cambios en modelos sensibles

## 🔧 Configuración por Endpoint

### **Ejemplo de View Seguro**
```python
from Backend.permissions import SecureIsAuthenticated, RateLimitPermission, AuditPermission

class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [
        SecureIsAuthenticated,
        RateLimitPermission,
        AuditPermission
    ]
    rate_limit = 100  # 100 requests por hora
    model_name = 'pedidos'
    
    def get_queryset(self):
        # Solo mostrar pedidos del usuario autenticado
        return Pedido.objects.filter(usuario=self.request.user)
```

### **Permisos por Método HTTP**
```python
class ProductoViewSet(viewsets.ModelViewSet):
    permission_classes = [SecureIsAuthenticated]
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            return [AdminOnlyPermission()]
        return [SecureIsAuthenticated()]
```

## 🛡️ Protección Específica

### **Contra Manipulación de Serializers**
- ✅ Validación estricta de datos
- ✅ Sanitización de entrada
- ✅ Verificación de permisos por campo
- ✅ Auditoría de cambios

### **Contra Acceso No Autorizado**
- ✅ Autenticación requerida en todos los endpoints
- ✅ Verificación de propiedad de recursos
- ✅ Permisos granulares por modelo
- ✅ Logging de intentos de acceso

### **Contra Ataques de Fuerza Bruta**
- ✅ Rate limiting por IP
- ✅ Rate limiting por usuario
- ✅ Bloqueo temporal de IPs
- ✅ Detección de patrones sospechosos

## 📈 Métricas de Seguridad

### **Monitoreo en Tiempo Real**
- Número de intentos de acceso fallidos
- IPs bloqueadas
- Usuarios con actividad sospechosa
- Endpoints más atacados
- Tiempo de respuesta de la API

### **Alertas Automáticas**
- Múltiples intentos de login fallidos
- Acceso desde IPs no conocidas
- Actividad fuera de horario normal
- Rate limit excedido frecuentemente
- Errores de autenticación masivos

## 🔄 Mantenimiento

### **Tareas Diarias**
1. Revisar logs de seguridad
2. Verificar usuarios activos
3. Monitorear conexiones a BD
4. Revisar alertas automáticas

### **Tareas Semanales**
1. Actualizar paquetes de seguridad
2. Revisar IPs bloqueadas
3. Analizar patrones de acceso
4. Verificar backups

### **Tareas Mensuales**
1. Rotar SECRET_KEY
2. Revisar permisos de usuarios
3. Actualizar lista de IPs permitidas
4. Revisar configuración de seguridad

## 🚨 Respuesta a Incidentes

### **Procedimiento de Emergencia**
1. **Identificar**: Revisar logs de seguridad
2. **Contener**: Bloquear IPs sospechosas
3. **Eliminar**: Limpiar accesos no autorizados
4. **Recuperar**: Restaurar desde backup si es necesario
5. **Documentar**: Registrar incidente y lecciones aprendidas

### **Contactos de Emergencia**
- **Administrador del Sistema**: [Tu email]
- **Soporte Técnico**: [Email de soporte]
- **Backup**: [Ubicación de backups]

## ✅ Verificación de Seguridad

### **Comandos de Verificación**
```bash
# Verificar configuración
python aplicar_seguridad.py

# Monitoreo en tiempo real
python monitoreo_seguridad.py

# Verificar logs
tail -f logs/security.log

# Verificar permisos de archivos
ls -la Backend/settings.py
ls -la .env
```

### **Tests de Seguridad**
```bash
# Test de rate limiting
curl -X GET http://localhost:8000/api/pedidos/ -H "Authorization: Bearer $TOKEN"

# Test de autenticación
curl -X GET http://localhost:8000/api/pedidos/ -H "Authorization: Bearer invalid_token"

# Test de CORS
curl -X OPTIONS http://localhost:8000/api/pedidos/ -H "Origin: http://malicious-site.com"
```

## 📋 Checklist de Seguridad

### **Configuración Inicial**
- [ ] SECRET_KEY generada y configurada
- [ ] DEBUG deshabilitado en producción
- [ ] CORS configurado correctamente
- [ ] SSL/HTTPS habilitado
- [ ] Headers de seguridad configurados

### **Monitoreo Continuo**
- [ ] Logs de seguridad habilitados
- [ ] Script de monitoreo configurado
- [ ] Alertas automáticas configuradas
- [ ] Backups automáticos configurados

### **Mantenimiento Regular**
- [ ] Paquetes actualizados
- [ ] Logs revisados
- [ ] Usuarios auditados
- [ ] Configuración verificada

## 🎯 Beneficios del Sistema

### **Para el Dashboard**
- ✅ Funcionalidad completa mantenida
- ✅ Acceso seguro y controlado
- ✅ Performance optimizada
- ✅ Monitoreo en tiempo real

### **Para la API**
- ✅ Protección contra ataques
- ✅ Auditoría completa
- ✅ Rate limiting inteligente
- ✅ Logging detallado

### **Para el Negocio**
- ✅ Datos protegidos
- ✅ Cumplimiento de seguridad
- ✅ Confianza de usuarios
- ✅ Continuidad del servicio

## 🔮 Próximas Mejoras

### **Fase 2 - Seguridad Avanzada**
- [ ] Autenticación de dos factores (2FA)
- [ ] Biometría para acceso crítico
- [ ] Machine learning para detección de anomalías
- [ ] Encriptación de datos sensibles

### **Fase 3 - Automatización**
- [ ] Respuesta automática a incidentes
- [ ] Auto-scaling de recursos de seguridad
- [ ] Integración con SIEM
- [ ] Dashboard de seguridad en tiempo real

---

**Estado**: ✅ **IMPLEMENTADO Y FUNCIONAL**

**Última actualización**: [Fecha actual]
**Versión**: 1.0
**Responsable**: [Tu nombre] 