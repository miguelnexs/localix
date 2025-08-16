#!/usr/bin/env python3
"""
Script para limpiar categorías de prueba
"""
import os
import sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from categorias.models import CategoriaProducto

User = get_user_model()

def clean_test_categories():
    print("🧹 Limpiando categorías de prueba...")
    
    try:
        # Obtener usuarios de prueba
        users = User.objects.filter(username__in=['vendedor1', 'vendedor2', 'tienda1', 'tienda2'])
        
        total_deleted = 0
        
        for user in users:
            categorias = CategoriaProducto.objects.filter(usuario=user)
            count = categorias.count()
            
            if count > 0:
                categorias.delete()
                print(f"   ✅ Eliminadas {count} categorías de {user.username}")
                total_deleted += count
            else:
                print(f"   ℹ️ No hay categorías para eliminar de {user.username}")
        
        print(f"\n📊 Total de categorías eliminadas: {total_deleted}")
        return True
        
    except Exception as e:
        print(f"❌ Error limpiando categorías: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🧹 LIMPIADOR DE CATEGORÍAS DE PRUEBA")
    print("=" * 60)
    
    success = clean_test_categories()
    
    if success:
        print("\n✅ Categorías de prueba limpiadas exitosamente")
        print("💡 Ahora puedes probar crear categorías desde el frontend")
    else:
        print("\n❌ Error al limpiar categorías")
    
    print("=" * 60)

if __name__ == '__main__':
    main()
