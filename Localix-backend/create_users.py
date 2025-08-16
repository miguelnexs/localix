#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_users():
    """Crear usuarios de prueba"""
    
    print("👤 Creando usuarios de prueba...")
    
    # Crear superusuario
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
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
    
    # Crear usuario vendedor
    if not User.objects.filter(username='vendedor').exists():
        vendedor_user = User.objects.create_user(
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
    
    # Crear usuario inventario
    if not User.objects.filter(username='inventario').exists():
        inventario_user = User.objects.create_user(
            username='inventario',
            email='inventario@localix.com',
            password='inventario123',
            nombre_completo='Encargado de Inventario',
            rol='inventario'
        )
        print("✅ Usuario inventario creado:")
        print("   Usuario: inventario")
        print("   Contraseña: inventario123")
    else:
        print("✅ Usuario inventario ya existe")
    
    print("\n🎉 Usuarios creados exitosamente!")
    print("Puedes usar cualquiera de estos usuarios para hacer login.")

if __name__ == '__main__':
    create_users()
