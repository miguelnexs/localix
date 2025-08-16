#!/usr/bin/env python3
"""
Script para limpiar todas las categorías de prueba del usuario admin
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from categorias.models import CategoriaProducto
from usuarios.models import Usuario

def clean_test_categories():
    """Limpiar categorías de prueba"""
    print("🧹 Limpiando categorías de prueba...")
    
    try:
        # Obtener el usuario admin
        admin_user = Usuario.objects.get(username='admin')
        print(f"Usuario encontrado: {admin_user.username}")
        
        # Obtener todas las categorías del usuario admin
        categories = CategoriaProducto.objects.filter(usuario=admin_user)
        print(f"Total de categorías encontradas: {categories.count()}")
        
        # Mostrar categorías antes de eliminar
        if categories.exists():
            print("\n📋 Categorías que serán eliminadas:")
            for cat in categories:
                print(f"  - {cat.nombre} (ID: {cat.id}, Slug: {cat.slug})")
        
        # Confirmar eliminación
        confirm = input("\n¿Estás seguro de que quieres eliminar todas las categorías? (s/N): ")
        if confirm.lower() != 's':
            print("❌ Operación cancelada")
            return
        
        # Eliminar categorías
        deleted_count = categories.delete()[0]
        print(f"\n✅ {deleted_count} categorías eliminadas exitosamente")
        
        # Verificar que se eliminaron
        remaining = CategoriaProducto.objects.filter(usuario=admin_user).count()
        print(f"📊 Categorías restantes: {remaining}")
        
    except Usuario.DoesNotExist:
        print("❌ Usuario 'admin' no encontrado")
    except Exception as e:
        print(f"❌ Error al limpiar categorías: {str(e)}")

def list_categories():
    """Listar categorías existentes"""
    print("\n📋 Categorías existentes:")
    
    try:
        admin_user = Usuario.objects.get(username='admin')
        categories = CategoriaProducto.objects.filter(usuario=admin_user)
        
        if categories.exists():
            for cat in categories:
                print(f"  - {cat.nombre} (ID: {cat.id}, Slug: {cat.slug})")
        else:
            print("  No hay categorías")
            
    except Usuario.DoesNotExist:
        print("❌ Usuario 'admin' no encontrado")
    except Exception as e:
        print(f"❌ Error al listar categorías: {str(e)}")

def main():
    print("🔧 Herramienta de limpieza de categorías")
    print("=" * 50)
    
    # Listar categorías actuales
    list_categories()
    
    # Preguntar qué hacer
    print("\nOpciones:")
    print("1. Limpiar todas las categorías")
    print("2. Solo listar categorías")
    print("3. Salir")
    
    option = input("\nSelecciona una opción (1-3): ")
    
    if option == '1':
        clean_test_categories()
    elif option == '2':
        list_categories()
    elif option == '3':
        print("👋 ¡Hasta luego!")
    else:
        print("❌ Opción inválida")

if __name__ == "__main__":
    main()
