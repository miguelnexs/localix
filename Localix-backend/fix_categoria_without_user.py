#!/usr/bin/env python3
"""
Script para arreglar la categoría que se creó sin usuario asignado
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from categorias.models import CategoriaProducto
from usuarios.models import Usuario

def fix_categoria_without_user():
    """Arreglar categoría sin usuario asignado"""
    print("🔧 Arreglando categoría sin usuario asignado...")
    
    try:
        # Buscar categorías sin usuario asignado
        categorias_sin_usuario = CategoriaProducto.objects.filter(usuario__isnull=True)
        print(f"Categorías sin usuario encontradas: {categorias_sin_usuario.count()}")
        
        if categorias_sin_usuario.exists():
            print("\n📋 Categorías que necesitan usuario:")
            for cat in categorias_sin_usuario:
                print(f"  - ID: {cat.id}, Nombre: '{cat.nombre}', Slug: '{cat.slug}'")
            
            # Obtener el usuario admin
            try:
                admin_user = Usuario.objects.get(username='admin')
                print(f"\n👤 Usuario admin encontrado: {admin_user.username}")
                
                # Asignar usuario admin a todas las categorías sin usuario
                updated_count = categorias_sin_usuario.update(usuario=admin_user)
                print(f"✅ {updated_count} categorías actualizadas con usuario admin")
                
                # Verificar que se arreglaron
                remaining = CategoriaProducto.objects.filter(usuario__isnull=True).count()
                print(f"📊 Categorías sin usuario restantes: {remaining}")
                
            except Usuario.DoesNotExist:
                print("❌ Usuario 'admin' no encontrado")
                return
        else:
            print("✅ No hay categorías sin usuario asignado")
            
    except Exception as e:
        print(f"❌ Error al arreglar categorías: {str(e)}")

def list_categorias_without_user():
    """Listar categorías sin usuario"""
    print("\n📋 Categorías sin usuario asignado:")
    
    try:
        categorias_sin_usuario = CategoriaProducto.objects.filter(usuario__isnull=True)
        
        if categorias_sin_usuario.exists():
            for cat in categorias_sin_usuario:
                print(f"  - ID: {cat.id}, Nombre: '{cat.nombre}', Slug: '{cat.slug}'")
        else:
            print("  No hay categorías sin usuario")
            
    except Exception as e:
        print(f"❌ Error al listar categorías: {str(e)}")

def delete_categoria_without_user():
    """Eliminar categoría sin usuario"""
    print("\n🗑️ Eliminando categoría sin usuario...")
    
    try:
        # Buscar categorías sin usuario
        categorias_sin_usuario = CategoriaProducto.objects.filter(usuario__isnull=True)
        
        if categorias_sin_usuario.exists():
            print("Categorías que serán eliminadas:")
            for cat in categorias_sin_usuario:
                print(f"  - ID: {cat.id}, Nombre: '{cat.nombre}'")
            
            # Confirmar eliminación
            confirm = input("\n¿Estás seguro de que quieres eliminar estas categorías? (s/N): ")
            if confirm.lower() != 's':
                print("❌ Operación cancelada")
                return
            
            # Eliminar categorías
            deleted_count = categorias_sin_usuario.delete()[0]
            print(f"✅ {deleted_count} categorías eliminadas exitosamente")
        else:
            print("✅ No hay categorías sin usuario para eliminar")
            
    except Exception as e:
        print(f"❌ Error al eliminar categorías: {str(e)}")

def main():
    print("🔧 Herramienta para arreglar categorías sin usuario")
    print("=" * 60)
    
    # Listar categorías sin usuario
    list_categorias_without_user()
    
    # Preguntar qué hacer
    print("\nOpciones:")
    print("1. Asignar usuario admin a categorías sin usuario")
    print("2. Eliminar categorías sin usuario")
    print("3. Solo listar categorías sin usuario")
    print("4. Salir")
    
    option = input("\nSelecciona una opción (1-4): ")
    
    if option == '1':
        fix_categoria_without_user()
    elif option == '2':
        delete_categoria_without_user()
    elif option == '3':
        list_categorias_without_user()
    elif option == '4':
        print("👋 ¡Hasta luego!")
    else:
        print("❌ Opción inválida")

if __name__ == "__main__":
    main()
