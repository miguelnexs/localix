"""
Middleware personalizado para logging de seguridad y auditoría
"""

import logging
import time
from django.utils.deprecation import MiddlewareMixin
from django.conf import settings
from django.http import HttpResponseForbidden
from django.core.cache import cache
from django.contrib.auth.models import AnonymousUser

logger = logging.getLogger('security')

class SecurityLoggingMiddleware(MiddlewareMixin):
    """
    Middleware para logging de seguridad y detección de actividad sospechosa
    """
    
    def process_request(self, request):
        # Marcar tiempo de inicio
        request.start_time = time.time()
        
        # Obtener información de la solicitud
        ip = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        method = request.method
        path = request.path
        
        # Excluir endpoints de autenticación de las verificaciones de seguridad
        auth_endpoints = [
            '/api/auth/token/',
            '/api/auth/token/refresh/',
            '/api/usuarios/login/',
            '/api/usuarios/refresh/',
            '/health/',
            '/',
        ]
        
        is_auth_endpoint = any(path.endswith(endpoint) for endpoint in auth_endpoints)
        
        # Verificar IPs bloqueadas (excepto para endpoints de auth)
        if not is_auth_endpoint and hasattr(settings, 'BLOCKED_IPS') and ip in settings.BLOCKED_IPS:
            logger.warning(f'IP bloqueada intentó acceder: {ip} - {method} {path}')
            return HttpResponseForbidden('Acceso denegado')
        
        # Verificar User-Agents bloqueados (excepto para endpoints de auth)
        if not is_auth_endpoint and hasattr(settings, 'BLOCKED_USER_AGENTS'):
            for blocked_ua in settings.BLOCKED_USER_AGENTS:
                if blocked_ua.lower() in user_agent.lower():
                    logger.warning(f'User-Agent bloqueado: {user_agent} - IP: {ip}')
                    return HttpResponseForbidden('Acceso denegado')
        
        # Rate limiting básico (excepto para endpoints de auth)
        if not is_auth_endpoint and self.is_rate_limited(request, ip):
            logger.warning(f'Rate limit excedido para IP: {ip}')
            return HttpResponseForbidden('Demasiadas solicitudes')
        
        # Log de solicitudes sospechosas (excepto para endpoints de auth)
        if not is_auth_endpoint and self.is_suspicious_request(request, ip, user_agent):
            logger.warning(f'Solicitud sospechosa: {ip} - {method} {path} - UA: {user_agent}')
        
        return None
    
    def process_response(self, request, response):
        # Calcular tiempo de respuesta
        if hasattr(request, 'start_time'):
            duration = time.time() - request.start_time
            ip = self.get_client_ip(request)
            method = request.method
            path = request.path
            status = response.status_code
            
            # Log de respuestas lentas
            if duration > 5.0:  # Más de 5 segundos
                logger.warning(f'Respuesta lenta: {method} {path} - {duration:.2f}s - IP: {ip}')
            
            # Log de errores
            if status >= 400:
                logger.error(f'Error {status}: {method} {path} - IP: {ip} - UA: {request.META.get("HTTP_USER_AGENT", "")}')
            
            # Log de actividad de autenticación
            if hasattr(request, 'user') and not isinstance(request.user, AnonymousUser):
                if path.startswith('/api/auth/'):
                    logger.info(f'Actividad de autenticación: {request.user.username} - {method} {path}')
        
        return response
    
    def get_client_ip(self, request):
        """Obtener IP real del cliente"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
    
    def is_rate_limited(self, request, ip):
        """Verificar rate limiting"""
        if not getattr(settings, 'RATE_LIMIT_ENABLED', False):
            return False
        
        cache_key = f"rate_limit:{ip}"
        requests_count = cache.get(cache_key, 0)
        
        # Límite: 1000 requests por hora
        if requests_count >= 1000:
            return True
        
        cache.set(cache_key, requests_count + 1, 3600)  # 1 hora
        return False
    
    def is_suspicious_request(self, request, ip, user_agent):
        """Detectar solicitudes sospechosas"""
        path = request.path.lower()
        method = request.method
        
        # Patrones sospechosos
        suspicious_patterns = [
            '/admin/',
            '/php',
            '/wp-admin',
            '/wp-login',
            '/.env',
            '/config',
            '/backup',
            '/sql',
            '/shell',
            '/cmd',
            '/exec',
        ]
        
        # Verificar patrones sospechosos
        for pattern in suspicious_patterns:
            if pattern in path:
                return True
        
        # Verificar métodos HTTP sospechosos
        if method not in ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']:
            return True
        
        # Verificar User-Agent vacío o sospechoso
        if not user_agent or len(user_agent) < 10:
            return True
        
        return False


class AuditLogMiddleware(MiddlewareMixin):
    """
    Middleware para logging de auditoría de cambios en modelos
    """
    
    def process_request(self, request):
        # Solo para usuarios autenticados
        if hasattr(request, 'user') and not isinstance(request.user, AnonymousUser):
            request.audit_user = request.user.username
        else:
            request.audit_user = 'anonymous'
        
        return None
    
    def process_response(self, request, response):
        # Log de cambios en modelos importantes
        if hasattr(request, 'audit_user') and request.audit_user != 'anonymous':
            if request.method in ['POST', 'PUT', 'PATCH', 'DELETE']:
                path = request.path
                if any(model_path in path for model_path in ['/pedidos/', '/ventas/', '/productos/', '/usuarios/']):
                    logger.info(f'Auditoría: {request.audit_user} - {request.method} {path}')
        
        return response


class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    Middleware para agregar headers de seguridad
    """
    
    def process_response(self, request, response):
        # Headers de seguridad básicos
        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'DENY'
        response['X-XSS-Protection'] = '1; mode=block'
        response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        
        # Headers adicionales si están configurados
        if hasattr(settings, 'SECURE_HEADERS'):
            for header, value in settings.SECURE_HEADERS.items():
                response[header] = value
        
        return response


class APIVersionMiddleware(MiddlewareMixin):
    """
    Middleware para versionado de API
    """
    
    def process_request(self, request):
        # Verificar header de versión de API
        api_version = request.META.get('HTTP_X_API_VERSION', 'v1')
        request.api_version = api_version
        
        # Log de versiones de API
        if request.path.startswith('/api/'):
            logger.info(f'API Version: {api_version} - {request.method} {request.path}')
        
        return None 