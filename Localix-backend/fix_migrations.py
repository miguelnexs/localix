#!/usr/bin/env python
import os
import django
import sys

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model
from django.core.management import execute_from_command_line

User = get_user_model()

def fix_migrations():
    """Arreglar las migraciones y crear superusuario"""
    
    print("🔧 Arreglando migraciones...")
    
    # Marcar la migración de usuarios como aplicada
    with connection.cursor() as cursor:
        cursor.execute("""
            INSERT INTO django_migrations (app, name, applied) 
            VALUES ('usuarios', '0001_initial', NOW())
        """)
    
    print("✅ Migración de usuarios marcada como aplicada")
    
    # Crear superusuario si no existe
    if not User.objects.filter(username='admin').exists():
        print("👤 Creando superusuario...")
        User.objects.create_superuser(
            username='admin',
            email='admin@localix.com',
            password='admin123',
            nombre_completo='Administrador del Sistema',
            rol='admin'
        )
        print("✅ Superusuario creado:")
        print("   Usuario: admin")
        print("   Contraseña: admin123")
    else:
        print("✅ Superusuario ya existe")
    
    # Crear usuario de prueba
    if not User.objects.filter(username='vendedor').exists():
        print("👤 Creando usuario vendedor...")
        User.objects.create_user(
            username='vendedor',
            email='vendedor@localix.com',
            password='vendedor123',
            nombre_completo='Vendedor de Prueba',
            rol='vendedor'
        )
        print("✅ Usuario vendedor creado:")
        print("   Usuario: vendedor")
        print("   Contraseña: vendedor123")
    else:
        print("✅ Usuario vendedor ya existe")

if __name__ == '__main__':
    fix_migrations()
