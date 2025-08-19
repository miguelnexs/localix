#!/usr/bin/env python3
"""
Script para crear usuario administrador
"""

import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from usuarios.models import Usuario

def crear_admin():
    """Crear usuario administrador si no existe"""
    try:
        admin_user = Usuario.objects.get(username='admin')
        print("✅ Usuario administrador ya existe")
        return admin_user
    except Usuario.DoesNotExist:
        admin_user = Usuario.objects.create_superuser(
            username='admin',
            email='admin@localix.com',
            password='admin123'
        )
        print("✅ Usuario administrador creado")
        print("   Usuario: admin")
        print("   Contraseña: admin123")
        return admin_user

if __name__ == "__main__":
    crear_admin() 