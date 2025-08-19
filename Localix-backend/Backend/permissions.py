"""
Sistema de permisos personalizado para mayor seguridad
"""

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger('security')

class SecureIsAuthenticated(permissions.BasePermission):
    """
    Permiso personalizado que verifica autenticación con logging de seguridad
    """
    
    def has_permission(self, request, view):
        # Verificar si el usuario está autenticado
        if not request.user.is_authenticated:
            logger.warning(f'Acceso no autorizado: {request.method} {request.path} - IP: {self.get_client_ip(request)}')
            return False
        
        # Verificar si el usuario está activo
        if not request.user.is_active:
            logger.warning(f'Usuario inactivo intentó acceder: {request.user.username} - {request.method} {request.path}')
            return False
        
        # Log de acceso exitoso para endpoints sensibles
        if self.is_sensitive_endpoint(request.path):
            logger.info(f'Acceso a endpoint sensible: {request.user.username} - {request.method} {request.path}')
        
        return True
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def is_sensitive_endpoint(self, path):
        """Identificar endpoints sensibles"""
        sensitive_patterns = [
            '/api/admin/',
            '/api/usuarios/',
            '/api/pedidos/',
            '/api/ventas/',
            '/api/productos/',
        ]
        return any(pattern in path for pattern in sensitive_patterns)


class RateLimitPermission(permissions.BasePermission):
    """
    Permiso para rate limiting personalizado
    """
    
    def has_permission(self, request, view):
        # Obtener límites específicos del view
        rate_limit = getattr(view, 'rate_limit', None)
        if not rate_limit:
            return True
        
        # Verificar rate limit
        cache_key = f"rate_limit:{request.user.id}:{view.__class__.__name__}"
        requests_count = cache.get(cache_key, 0)
        
        if requests_count >= rate_limit:
            logger.warning(f'Rate limit excedido: {request.user.username} - {view.__class__.__name__}')
            raise PermissionDenied('Demasiadas solicitudes. Inténtalo más tarde.')
        
        # Incrementar contador
        cache.set(cache_key, requests_count + 1, 3600)  # 1 hora
        return True


class OwnerPermission(permissions.BasePermission):
    """
    Permiso para verificar que el usuario es propietario del recurso
    """
    
    def has_object_permission(self, request, view, obj):
        # Verificar si el usuario es propietario
        if hasattr(obj, 'usuario'):
            if obj.usuario != request.user:
                logger.warning(f'Acceso no autorizado a objeto: {request.user.username} intentó acceder a {obj.__class__.__name__} {obj.id}')
                return False
        
        # Verificar si el usuario es propietario por campo específico
        if hasattr(obj, 'propietario'):
            if obj.propietario != request.user:
                logger.warning(f'Acceso no autorizado a objeto: {request.user.username} intentó acceder a {obj.__class__.__name__} {obj.id}')
                return False
        
        return True


class AdminOnlyPermission(permissions.BasePermission):
    """
    Permiso solo para administradores
    """
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        if not request.user.is_staff:
            logger.warning(f'Usuario no admin intentó acceder: {request.user.username} - {request.method} {request.path}')
            return False
        
        return True


class ReadOnlyPermission(permissions.BasePermission):
    """
    Permiso de solo lectura
    """
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        logger.warning(f'Intento de escritura en endpoint de solo lectura: {request.user.username} - {request.method} {request.path}')
        return False


class TimeBasedPermission(permissions.BasePermission):
    """
    Permiso basado en horario de trabajo
    """
    
    def has_permission(self, request, view):
        from datetime import datetime
        
        now = datetime.now()
        hour = now.hour
        
        # Solo permitir acceso entre 8 AM y 6 PM
        if hour < 8 or hour >= 18:
            logger.warning(f'Acceso fuera de horario: {request.user.username} - {hour}:{now.minute} - {request.method} {request.path}')
            return False
        
        return True


class IPWhitelistPermission(permissions.BasePermission):
    """
    Permiso basado en IPs permitidas
    """
    
    def has_permission(self, request, view):
        # Obtener IPs permitidas del view
        allowed_ips = getattr(view, 'allowed_ips', [])
        if not allowed_ips:
            return True
        
        client_ip = self.get_client_ip(request)
        if client_ip not in allowed_ips:
            logger.warning(f'IP no permitida: {client_ip} - {request.method} {request.path}')
            return False
        
        return True
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SecureModelPermission(permissions.BasePermission):
    """
    Permiso personalizado para modelos específicos con logging detallado
    """
    
    def has_permission(self, request, view):
        # Verificar autenticación básica
        if not request.user.is_authenticated:
            return False
        
        # Verificar permisos específicos del modelo
        model_name = getattr(view, 'model_name', None)
        if model_name:
            if not self.has_model_permission(request.user, model_name, request.method):
                logger.warning(f'Permiso denegado para modelo: {request.user.username} - {model_name} - {request.method}')
                return False
        
        return True
    
    def has_model_permission(self, user, model_name, method):
        """Verificar permisos específicos del modelo"""
        # Mapeo de permisos por modelo
        model_permissions = {
            'pedidos': {
                'GET': True,
                'POST': True,
                'PUT': True,
                'DELETE': user.is_staff,
            },
            'ventas': {
                'GET': True,
                'POST': True,
                'PUT': True,
                'DELETE': user.is_staff,
            },
            'productos': {
                'GET': True,
                'POST': user.is_staff,
                'PUT': user.is_staff,
                'DELETE': user.is_staff,
            },
            'usuarios': {
                'GET': user.is_staff,
                'POST': user.is_staff,
                'PUT': user.is_staff,
                'DELETE': user.is_staff,
            },
        }
        
        permissions = model_permissions.get(model_name, {})
        return permissions.get(method, False)


class AuditPermission(permissions.BasePermission):
    """
    Permiso que registra todas las acciones para auditoría
    """
    
    def has_permission(self, request, view):
        # Registrar la acción
        self.log_action(request, view, 'permission_check')
        return True
    
    def has_object_permission(self, request, view, obj):
        # Registrar la acción
        self.log_action(request, view, 'object_permission_check', obj)
        return True
    
    def log_action(self, request, view, action_type, obj=None):
        """Registrar acción para auditoría"""
        log_data = {
            'user': request.user.username if request.user.is_authenticated else 'anonymous',
            'action': action_type,
            'method': request.method,
            'path': request.path,
            'ip': self.get_client_ip(request),
            'view': view.__class__.__name__,
            'object_id': obj.id if obj else None,
            'object_type': obj.__class__.__name__ if obj else None,
        }
        
        logger.info(f'Auditoría: {log_data}')
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip 