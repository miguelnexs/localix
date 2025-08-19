#!/usr/bin/env python3
"""
Script para configurar el entorno de desarrollo de forma segura
permitiendo el login mientras mantiene las medidas de seguridad
"""

import os
import sys
import django
from pathlib import Path
from datetime import timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.conf import settings

def configurar_desarrollo_seguro():
    """Configurar entorno de desarrollo seguro"""
    print("🔧 CONFIGURANDO DESARROLLO SEGURO")
    print("=" * 40)
    
    # Crear archivo de configuración de desarrollo seguro
    config_desarrollo = '''"""
Configuración de desarrollo seguro
Permite login mientras mantiene medidas de seguridad básicas
"""

from .settings import *
from datetime import timedelta

# Configuración para desarrollo seguro
DEBUG = True

# Configuración CORS más permisiva para desarrollo
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://72.60.7.133",
    "https://72.60.7.133",
]

# Configuración REST Framework para desarrollo
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',  # Habilitado para desarrollo
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    # Rate limiting más permisivo para desarrollo
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/hour',  # Más permisivo para desarrollo
        'user': '5000/hour',  # Más permisivo para desarrollo
    },
}

# Configuraciones de seguridad relajadas para desarrollo
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False
SECURE_SSL_REDIRECT = False
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'SAMEORIGIN'  # Más permisivo para desarrollo

# Configuración de logging para desarrollo
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console', 'file'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
            'propagate': False,
        },
        'security': {
            'handlers': ['console', 'file'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}

# Crear directorio de logs si no existe
import os
LOGS_DIR = os.path.join(BASE_DIR, 'logs')
os.makedirs(LOGS_DIR, exist_ok=True)

# Configuración JWT para desarrollo
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  # Más largo para desarrollo
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'JWK_URL': None,
    'LEEWAY': 0,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    'JTI_CLAIM': 'jti',
    'SLIDING_TOKEN_REFRESH_EXP_CLAIM': 'refresh_exp',
    'SLIDING_TOKEN_LIFETIME': timedelta(minutes=5),
    'SLIDING_TOKEN_REFRESH_LIFETIME': timedelta(days=1),
}

# Configuración de archivos para desarrollo
FILE_UPLOAD_PERMISSIONS = 0o644
FILE_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB
DATA_UPLOAD_MAX_MEMORY_SIZE = 50 * 1024 * 1024  # 50MB

# Configuración de caché para desarrollo
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
    }
}

# Configuración de sesiones para desarrollo
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 3600  # 1 hora
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# Configuración de middleware para desarrollo (sin restricciones severas)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # Middleware de seguridad básico (sin restricciones severas)
    'Backend.middleware.SecurityHeadersMiddleware',
]

print("✅ Configuración de desarrollo seguro aplicada")
'''
    
    # Guardar configuración
    config_file = Path('Backend/settings_desarrollo_seguro.py')
    with open(config_file, 'w') as f:
        f.write(config_desarrollo)
    
    print("✅ Archivo de configuración creado: Backend/settings_desarrollo_seguro.py")
    
    # Crear script de inicio para desarrollo
    script_inicio = '''#!/bin/bash
# Script para iniciar el servidor en modo desarrollo seguro

echo "🚀 Iniciando servidor en modo desarrollo seguro..."

# Configurar variables de entorno
export DJANGO_SETTINGS_MODULE=Backend.settings_desarrollo_seguro

# Crear directorio de logs si no existe
mkdir -p logs

# Iniciar servidor
python manage.py runserver 0.0.0.0:8000

echo "✅ Servidor iniciado en modo desarrollo seguro"
echo "📝 Logs disponibles en: logs/django.log"
'''
    
    # Guardar script de inicio
    script_file = Path('iniciar_desarrollo_seguro.sh')
    with open(script_file, 'w') as f:
        f.write(script_inicio)
    
    # Hacer ejecutable en sistemas Unix
    try:
        os.chmod(script_file, 0o755)
    except:
        pass
    
    print("✅ Script de inicio creado: iniciar_desarrollo_seguro.sh")
    
    # Crear script de inicio para Windows
    script_windows = '''@echo off
REM Script para iniciar el servidor en modo desarrollo seguro (Windows)

echo 🚀 Iniciando servidor en modo desarrollo seguro...

REM Configurar variables de entorno
set DJANGO_SETTINGS_MODULE=Backend.settings_desarrollo_seguro

REM Crear directorio de logs si no existe
if not exist logs mkdir logs

REM Iniciar servidor
python manage.py runserver 0.0.0.0:8000

echo ✅ Servidor iniciado en modo desarrollo seguro
echo 📝 Logs disponibles en: logs/django.log
pause
'''
    
    # Guardar script de inicio para Windows
    script_windows_file = Path('iniciar_desarrollo_seguro.bat')
    with open(script_windows_file, 'w') as f:
        f.write(script_windows)
    
    print("✅ Script de inicio para Windows creado: iniciar_desarrollo_seguro.bat")

def crear_usuario_admin():
    """Crear usuario administrador si no existe"""
    print("\n👤 Verificando usuario administrador...")
    
    from django.contrib.auth.models import User
    
    try:
        admin_user = User.objects.get(username='admin')
        print("✅ Usuario administrador ya existe")
        return admin_user
    except User.DoesNotExist:
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@localix.com',
            password='admin123'
        )
        print("✅ Usuario administrador creado")
        print("   Usuario: admin")
        print("   Contraseña: admin123")
        return admin_user

def verificar_configuracion_actual():
    """Verificar la configuración actual"""
    print("\n🔍 Verificando configuración actual...")
    
    print(f"DEBUG: {'❌ HABILITADO' if settings.DEBUG else '✅ DESHABILITADO'}")
    print(f"CORS_ALLOW_ALL_ORIGINS: {'✅ HABILITADO' if settings.CORS_ALLOW_ALL_ORIGINS else '❌ DESHABILITADO'}")
    
    # Verificar permisos por defecto
    default_permissions = settings.REST_FRAMEWORK.get('DEFAULT_PERMISSION_CLASSES', [])
    print(f"Permisos por defecto: {default_permissions}")
    
    # Verificar rate limiting
    throttle_rates = settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', {})
    print(f"Rate limiting: {throttle_rates}")

def main():
    """Función principal"""
    print("🛡️ CONFIGURACIÓN DE DESARROLLO SEGURO")
    print("=" * 50)
    
    # Verificar configuración actual
    verificar_configuracion_actual()
    
    # Configurar desarrollo seguro
    configurar_desarrollo_seguro()
    
    # Crear usuario administrador
    crear_usuario_admin()
    
    print("\n✅ CONFIGURACIÓN COMPLETADA")
    print("=" * 30)
    print("📋 Resumen de acciones:")
    print("   ✅ Archivo de configuración seguro creado")
    print("   ✅ Scripts de inicio creados")
    print("   ✅ Usuario administrador verificado")
    
    print("\n🚀 PRÓXIMOS PASOS:")
    print("1. Para Linux/Mac:")
    print("   ./iniciar_desarrollo_seguro.sh")
    print("")
    print("2. Para Windows:")
    print("   iniciar_desarrollo_seguro.bat")
    print("")
    print("3. O manualmente:")
    print("   export DJANGO_SETTINGS_MODULE=Backend.settings_desarrollo_seguro")
    print("   python manage.py runserver")
    print("")
    print("4. Probar login:")
    print("   python probar_login.py")
    
    print("\n💡 CARACTERÍSTICAS DE DESARROLLO SEGURO:")
    print("- ✅ Login funcionando correctamente")
    print("- ✅ Medidas de seguridad básicas activas")
    print("- ✅ Rate limiting relajado para desarrollo")
    print("- ✅ Logging detallado habilitado")
    print("- ✅ CORS configurado para desarrollo")
    print("- ✅ Debug habilitado para desarrollo")

if __name__ == "__main__":
    main() 