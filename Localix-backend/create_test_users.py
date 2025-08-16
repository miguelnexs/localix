#!/usr/bin/env python3
"""
Script para crear usuarios de prueba para el sistema multi-tenancy
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_test_users():
    """Crear usuarios de prueba"""
    print("👥 Creando usuarios de prueba...")
    
    users_data = [
        {
            'username': 'admin',
            'email': 'admin@localix.com',
            'password': 'admin123',
            'first_name': 'Administrador',
            'last_name': 'Sistema',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'username': 'vendedor1',
            'email': 'vendedor1@localix.com',
            'password': 'vendedor123',
            'first_name': 'Juan',
            'last_name': 'Pérez',
            'is_staff': True,
            'is_superuser': False
        },
        {
            'username': 'vendedor2',
            'email': 'vendedor2@localix.com',
            'password': 'vendedor123',
            'first_name': 'María',
            'last_name': 'García',
            'is_staff': True,
            'is_superuser': False
        },
        {
            'username': 'inventario1',
            'email': 'inventario1@localix.com',
            'password': 'inventario123',
            'first_name': 'Carlos',
            'last_name': 'López',
            'is_staff': True,
            'is_superuser': False
        },
        {
            'username': 'tienda1',
            'email': 'tienda1@localix.com',
            'password': 'tienda123',
            'first_name': 'Ana',
            'last_name': 'Martínez',
            'is_staff': False,
            'is_superuser': False
        },
        {
            'username': 'tienda2',
            'email': 'tienda2@localix.com',
            'password': 'tienda123',
            'first_name': 'Roberto',
            'last_name': 'Rodríguez',
            'is_staff': False,
            'is_superuser': False
        }
    ]
    
    created_users = []
    
    for user_data in users_data:
        try:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                defaults={
                    'email': user_data['email'],
                    'first_name': user_data['first_name'],
                    'last_name': user_data['last_name'],
                    'is_staff': user_data['is_staff'],
                    'is_superuser': user_data['is_superuser']
                }
            )
            
            if created:
                user.set_password(user_data['password'])
                user.save()
                print(f"✅ Usuario creado: {user.username} ({user.get_full_name()})")
                created_users.append(user)
            else:
                print(f"⚠️ Usuario ya existe: {user.username}")
                
        except Exception as e:
            print(f"❌ Error creando usuario {user_data['username']}: {e}")
    
    return created_users

def main():
    """Función principal"""
    print("=" * 60)
    print("👥 CREADOR DE USUARIOS DE PRUEBA")
    print("=" * 60)
    
    users = create_test_users()
    
    print(f"\n📊 Resumen:")
    print(f"   Usuarios creados: {len(users)}")
    print(f"   Total usuarios en el sistema: {User.objects.count()}")
    
    print(f"\n🔑 Credenciales de acceso:")
    print(f"   Admin: admin / admin123")
    print(f"   Vendedor 1: vendedor1 / vendedor123")
    print(f"   Vendedor 2: vendedor2 / vendedor123")
    print(f"   Inventario: inventario1 / inventario123")
    print(f"   Tienda 1: tienda1 / tienda123")
    print(f"   Tienda 2: tienda2 / tienda123")
    
    print("\n" + "=" * 60)
    print("✅ Sistema multi-tenancy listo")
    print("=" * 60)

if __name__ == '__main__':
    main()
