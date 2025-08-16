#!/usr/bin/env python3
"""
Script para crear un usuario de prueba
"""
import os
import sys
import django
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import Usuario

User = get_user_model()

def create_test_user():
    """Crear un usuario de prueba"""
    
    # Verificar si ya existe el usuario
    username = 'testuser'
    email = 'test@example.com'
    
    try:
        # Intentar obtener el usuario existente
        user = User.objects.get(username=username)
        print(f"✅ Usuario '{username}' ya existe (ID: {user.id})")
        print(f"   Email: {user.email}")
        print(f"   Activo: {user.es_activo}")
        print(f"   Staff: {user.is_staff}")
        return user
    except User.DoesNotExist:
        pass
    
    try:
        # Crear nuevo usuario
        user = User.objects.create_user(
            username=username,
            email=email,
            password='testpass123',
            first_name='Usuario',
            last_name='Prueba',
            es_activo=True,
            is_staff=True,
            is_superuser=True
        )
        
        print(f"✅ Usuario '{username}' creado exitosamente (ID: {user.id})")
        print(f"   Email: {user.email}")
        print(f"   Contraseña: testpass123")
        print(f"   Activo: {user.es_activo}")
        print(f"   Staff: {user.is_staff}")
        print(f"   Superuser: {user.is_superuser}")
        
        return user
        
    except Exception as e:
        print(f"❌ Error creando usuario: {e}")
        return None

if __name__ == "__main__":
    print("=" * 50)
    print("CREANDO USUARIO DE PRUEBA")
    print("=" * 50)
    
    user = create_test_user()
    
    if user:
        print("\n" + "=" * 50)
        print("CREDENCIALES DE PRUEBA")
        print("=" * 50)
        print(f"Username: {user.username}")
        print(f"Password: testpass123")
        print(f"Email: {user.email}")
        print("=" * 50)
    else:
        print("\n❌ No se pudo crear el usuario de prueba")
