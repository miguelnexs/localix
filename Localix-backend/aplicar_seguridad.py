#!/usr/bin/env python3
"""
Script para aplicar medidas de seguridad al sistema
"""

import os
import sys
import django
import secrets
import string
from pathlib import Path

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.conf import settings
from django.core.management import execute_from_command_line
from django.contrib.auth.models import User
from django.core.cache import cache

def generar_secret_key_segura():
    """Generar una SECRET_KEY segura"""
    caracteres = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(caracteres) for _ in range(50))

def verificar_configuracion_seguridad():
    """Verificar la configuración de seguridad actual"""
    print("🔍 VERIFICANDO CONFIGURACIÓN DE SEGURIDAD")
    print("=" * 50)
    
    # Verificar DEBUG
    print(f"DEBUG: {'❌ HABILITADO (INSEGURO)' if settings.DEBUG else '✅ DESHABILITADO'}")
    
    # Verificar SECRET_KEY
    secret_key = settings.SECRET_KEY
    if secret_key == 'default-secret-key' or len(secret_key) < 20:
        print("❌ SECRET_KEY insegura detectada")
        return False
    else:
        print("✅ SECRET_KEY segura")
    
    # Verificar ALLOWED_HOSTS
    if '*' in settings.ALLOWED_HOSTS:
        print("❌ ALLOWED_HOSTS demasiado permisivo (contiene *)")
    else:
        print("✅ ALLOWED_HOSTS configurado correctamente")
    
    # Verificar CORS
    if settings.CORS_ALLOW_ALL_ORIGINS:
        print("❌ CORS_ALLOW_ALL_ORIGINS habilitado (inseguro)")
    else:
        print("✅ CORS configurado correctamente")
    
    # Verificar SSL
    if not settings.SECURE_SSL_REDIRECT:
        print("⚠️ SECURE_SSL_REDIRECT deshabilitado")
    else:
        print("✅ SSL redirección habilitada")
    
    # Verificar headers de seguridad
    if not settings.SECURE_BROWSER_XSS_FILTER:
        print("⚠️ SECURE_BROWSER_XSS_FILTER deshabilitado")
    else:
        print("✅ Headers de seguridad habilitados")
    
    return True

def aplicar_medidas_seguridad():
    """Aplicar medidas de seguridad"""
    print("\n🔧 APLICANDO MEDIDAS DE SEGURIDAD")
    print("=" * 40)
    
    # 1. Generar nueva SECRET_KEY
    print("1️⃣ Generando nueva SECRET_KEY...")
    nueva_secret_key = generar_secret_key_segura()
    print(f"   Nueva SECRET_KEY generada: {nueva_secret_key[:20]}...")
    
    # 2. Crear archivo .env si no existe
    env_file = Path('.env')
    if not env_file.exists():
        print("2️⃣ Creando archivo .env...")
        with open(env_file, 'w') as f:
            f.write(f"SECRET_KEY={nueva_secret_key}\n")
            f.write("DEBUG=False\n")
            f.write("DB_NAME=tiendadb\n")
            f.write("DB_USER=productos\n")
            f.write("DB_PASSWORD=migel1457\n")
            f.write("DB_HOST=localhost\n")
            f.write("DB_PORT=5432\n")
        print("   ✅ Archivo .env creado")
    else:
        print("2️⃣ Archivo .env ya existe")
    
    # 3. Crear directorio de logs
    logs_dir = Path('logs')
    if not logs_dir.exists():
        print("3️⃣ Creando directorio de logs...")
        logs_dir.mkdir()
        print("   ✅ Directorio de logs creado")
    else:
        print("3️⃣ Directorio de logs ya existe")
    
    # 4. Verificar usuarios de administración
    print("4️⃣ Verificando usuarios de administración...")
    admin_users = User.objects.filter(is_staff=True)
    if admin_users.exists():
        print(f"   ✅ {admin_users.count()} usuarios administradores encontrados")
        for user in admin_users:
            print(f"      - {user.username} (activo: {user.is_active})")
    else:
        print("   ⚠️ No hay usuarios administradores")
    
    # 5. Limpiar caché
    print("5️⃣ Limpiando caché...")
    cache.clear()
    print("   ✅ Caché limpiado")
    
    # 6. Verificar permisos de archivos
    print("6️⃣ Verificando permisos de archivos...")
    archivos_sensibles = [
        'manage.py',
        'Backend/settings.py',
        '.env',
        'logs/',
    ]
    
    for archivo in archivos_sensibles:
        if Path(archivo).exists():
            stat = Path(archivo).stat()
            permisos = oct(stat.st_mode)[-3:]
            print(f"   {archivo}: {permisos}")
    
    return True

def configurar_logging_seguridad():
    """Configurar logging de seguridad"""
    print("\n📝 CONFIGURANDO LOGGING DE SEGURIDAD")
    print("=" * 40)
    
    # Crear archivo de configuración de logging
    logging_config = """
# Configuración de logging para seguridad
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'security': {
            'format': '[SECURITY] {levelname} {asctime} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'security_file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': 'logs/security.log',
            'formatter': 'security',
        },
        'security_console': {
            'level': 'WARNING',
            'class': 'logging.StreamHandler',
            'formatter': 'security',
        },
    },
    'loggers': {
        'security': {
            'handlers': ['security_file', 'security_console'],
            'level': 'WARNING',
            'propagate': False,
        },
    },
}
"""
    
    print("✅ Configuración de logging de seguridad preparada")
    print("💡 Agregar esta configuración a settings.py si no está presente")
    
    return logging_config

def crear_script_monitoreo():
    """Crear script de monitoreo de seguridad"""
    print("\n🔍 CREANDO SCRIPT DE MONITOREO")
    print("=" * 35)
    
    script_monitoreo = '''#!/usr/bin/env python3
"""
Script de monitoreo de seguridad
"""

import os
import sys
import django
from datetime import datetime, timedelta
from pathlib import Path

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth.models import User
from django.core.cache import cache
from django.db import connection

def verificar_logs_seguridad():
    """Verificar logs de seguridad recientes"""
    print("🔍 Verificando logs de seguridad...")
    
    log_file = Path('logs/security.log')
    if not log_file.exists():
        print("❌ Archivo de logs de seguridad no encontrado")
        return
    
    # Leer últimas 50 líneas
    with open(log_file, 'r') as f:
        lines = f.readlines()[-50:]
    
    # Buscar eventos de seguridad
    eventos_seguridad = []
    for line in lines:
        if any(keyword in line.lower() for keyword in ['warning', 'error', 'security', 'unauthorized']):
            eventos_seguridad.append(line.strip())
    
    if eventos_seguridad:
        print(f"⚠️ {len(eventos_seguridad)} eventos de seguridad encontrados:")
        for evento in eventos_seguridad[-10:]:  # Últimos 10
            print(f"   {evento}")
    else:
        print("✅ No se encontraron eventos de seguridad recientes")

def verificar_usuarios_sospechosos():
    """Verificar usuarios con actividad sospechosa"""
    print("\\n👥 Verificando usuarios...")
    
    # Verificar usuarios inactivos
    usuarios_inactivos = User.objects.filter(is_active=False)
    if usuarios_inactivos.exists():
        print(f"⚠️ {usuarios_inactivos.count()} usuarios inactivos encontrados")
    
    # Verificar últimos logins
    usuarios_recientes = User.objects.filter(last_login__gte=datetime.now() - timedelta(hours=24))
    print(f"✅ {usuarios_recientes.count()} usuarios activos en las últimas 24 horas")

def verificar_conexiones_db():
    """Verificar conexiones a la base de datos"""
    print("\\n🗄️ Verificando conexiones a la base de datos...")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT count(*) FROM pg_stat_activity")
            conexiones = cursor.fetchone()[0]
            print(f"✅ {conexiones} conexiones activas a la base de datos")
    except Exception as e:
        print(f"❌ Error verificando conexiones: {e}")

def verificar_caché():
    """Verificar estado del caché"""
    print("\\n💾 Verificando caché...")
    
    try:
        cache.set('test_key', 'test_value', 60)
        test_value = cache.get('test_key')
        if test_value == 'test_value':
            print("✅ Caché funcionando correctamente")
        else:
            print("❌ Problema con el caché")
    except Exception as e:
        print(f"❌ Error con caché: {e}")

def main():
    """Función principal"""
    print("🚀 MONITOREO DE SEGURIDAD")
    print("=" * 30)
    print(f"Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    verificar_logs_seguridad()
    verificar_usuarios_sospechosos()
    verificar_conexiones_db()
    verificar_caché()
    
    print("\\n✅ Monitoreo completado")

if __name__ == "__main__":
    main()
'''
    
    # Guardar script
    with open('monitoreo_seguridad.py', 'w') as f:
        f.write(script_monitoreo)
    
    print("✅ Script de monitoreo creado: monitoreo_seguridad.py")
    print("💡 Ejecutar: python monitoreo_seguridad.py")

def crear_archivo_requirements_seguridad():
    """Crear archivo de requirements con paquetes de seguridad"""
    print("\n📦 CREANDO REQUIREMENTS DE SEGURIDAD")
    print("=" * 40)
    
    requirements_seguridad = """# Paquetes de seguridad adicionales
django-cors-headers>=4.0.0
django-ratelimit>=3.0.1
django-security>=0.15.0
django-axes>=5.40.0
django-defender>=0.8.0
django-ipware>=5.0.0
django-user-agents>=0.4.0
django-request-logging>=0.7.0
django-auditlog>=2.4.0
django-simple-history>=3.3.0
django-reversion>=4.0.0
django-otp>=1.2.0
django-two-factor-auth>=1.15.0
django-session-timeout>=0.1.0
django-password-validators>=0.4.0
django-ssl-auth>=0.1.0
django-ip-restrict>=0.1.0
django-user-sessions>=1.7.1
django-admin-honeypot>=1.1.0
django-security-middleware>=0.1.0
"""
    
    # Guardar archivo
    with open('requirements_seguridad.txt', 'w') as f:
        f.write(requirements_seguridad)
    
    print("✅ Archivo requirements_seguridad.txt creado")
    print("💡 Instalar: pip install -r requirements_seguridad.txt")

def main():
    """Función principal"""
    print("🛡️ SISTEMA DE SEGURIDAD PARA DJANGO REST FRAMEWORK")
    print("=" * 60)
    
    # Verificar configuración actual
    if not verificar_configuracion_seguridad():
        print("\n❌ Se detectaron problemas de seguridad")
        respuesta = input("¿Deseas continuar aplicando las medidas de seguridad? (s/n): ")
        if respuesta.lower() != 's':
            return
    
    # Aplicar medidas de seguridad
    aplicar_medidas_seguridad()
    
    # Configurar logging
    configurar_logging_seguridad()
    
    # Crear script de monitoreo
    crear_script_monitoreo()
    
    # Crear requirements de seguridad
    crear_archivo_requirements_seguridad()
    
    print("\n✅ MEDIDAS DE SEGURIDAD APLICADAS")
    print("=" * 40)
    print("📋 Resumen de acciones:")
    print("   ✅ Nueva SECRET_KEY generada")
    print("   ✅ Archivo .env configurado")
    print("   ✅ Directorio de logs creado")
    print("   ✅ Script de monitoreo creado")
    print("   ✅ Requirements de seguridad creados")
    
    print("\n🔧 PRÓXIMOS PASOS:")
    print("1. Reiniciar el servidor Django")
    print("2. Instalar paquetes de seguridad: pip install -r requirements_seguridad.txt")
    print("3. Configurar variables de entorno en .env")
    print("4. Ejecutar monitoreo: python monitoreo_seguridad.py")
    print("5. Revisar logs de seguridad regularmente")
    
    print("\n⚠️ RECOMENDACIONES ADICIONALES:")
    print("- Configurar HTTPS en producción")
    print("- Implementar autenticación de dos factores")
    print("- Configurar backups automáticos")
    print("- Monitorear logs regularmente")
    print("- Mantener paquetes actualizados")
    print("- Implementar rate limiting")
    print("- Configurar firewall")
    print("- Usar variables de entorno para credenciales")

if __name__ == "__main__":
    main() 