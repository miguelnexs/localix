#!/usr/bin/env python
"""
Script de diagnóstico para problemas con categorías
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from categorias.models import CategoriaProducto
from django.utils.text import slugify
from django.db import connection

def test_database_connection():
    """Probar conexión a la base de datos"""
    print("🔍 Probando conexión a la base de datos...")
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
        print("✅ Conexión a la base de datos exitosa")
        return True
    except Exception as e:
        print(f"❌ Error de conexión a la base de datos: {e}")
        return False

def test_model_operations():
    """Probar operaciones básicas del modelo"""
    print("\n🔍 Probando operaciones del modelo...")
    try:
        # Contar categorías existentes
        count = CategoriaProducto.objects.count()
        print(f"✅ Categorías existentes: {count}")
        
        # Listar categorías existentes
        categorias = CategoriaProducto.objects.all()[:5]
        print(f"✅ Primeras {len(categorias)} categorías:")
        for cat in categorias:
            print(f"   - {cat.nombre} (slug: {cat.slug})")
        
        return True
    except Exception as e:
        print(f"❌ Error en operaciones del modelo: {e}")
        return False

def test_slug_generation():
    """Probar generación de slugs"""
    print("\n🔍 Probando generación de slugs...")
    try:
        test_names = ["General", "Test Category", "Categoría de Prueba"]
        for name in test_names:
            slug = slugify(name)
            print(f"✅ '{name}' -> '{slug}'")
        return True
    except Exception as e:
        print(f"❌ Error en generación de slugs: {e}")
        return False

def test_category_creation():
    """Probar creación de categoría"""
    print("\n🔍 Probando creación de categoría...")
    try:
        # Verificar si ya existe una categoría "General"
        existing = CategoriaProducto.objects.filter(nombre__iexact='General').first()
        if existing:
            print(f"✅ Categoría 'General' ya existe: {existing.nombre} (ID: {existing.id})")
            return True
        
        # Crear categoría de prueba
        categoria = CategoriaProducto.objects.create(
            nombre="General",
            descripcion="Categoría general para productos sin clasificación específica",
            activa=True,
            orden=0
        )
        print(f"✅ Categoría creada exitosamente: {categoria.nombre} (ID: {categoria.id}, slug: {categoria.slug})")
        
        # Limpiar categoría de prueba
        categoria.delete()
        print("✅ Categoría de prueba eliminada")
        return True
        
    except Exception as e:
        print(f"❌ Error creando categoría: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def test_serializer():
    """Probar serializer"""
    print("\n🔍 Probando serializer...")
    try:
        from categorias.serializers import CategoriaSerializer
        
        # Datos de prueba
        test_data = {
            'nombre': 'Test Category',
            'descripcion': 'Categoría de prueba',
            'activa': True,
            'orden': 999
        }
        
        serializer = CategoriaSerializer(data=test_data)
        if serializer.is_valid():
            print("✅ Serializer válido")
            categoria = serializer.save()
            print(f"✅ Categoría creada via serializer: {categoria.nombre} (ID: {categoria.id})")
            
            # Limpiar
            categoria.delete()
            print("✅ Categoría de prueba eliminada")
            return True
        else:
            print(f"❌ Errores de validación: {serializer.errors}")
            return False
            
    except Exception as e:
        print(f"❌ Error en serializer: {e}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return False

def main():
    """Función principal de diagnóstico"""
    print("🚀 Iniciando diagnóstico de categorías...\n")
    
    tests = [
        ("Conexión a BD", test_database_connection),
        ("Operaciones del modelo", test_model_operations),
        ("Generación de slugs", test_slug_generation),
        ("Creación de categoría", test_category_creation),
        ("Serializer", test_serializer),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ Error en {test_name}: {e}")
            results.append((test_name, False))
    
    print("\n" + "="*50)
    print("📊 RESUMEN DE DIAGNÓSTICO")
    print("="*50)
    
    all_passed = True
    for test_name, result in results:
        status = "✅ PASÓ" if result else "❌ FALLÓ"
        print(f"{test_name}: {status}")
        if not result:
            all_passed = False
    
    print("\n" + "="*50)
    if all_passed:
        print("🎉 TODOS LOS TESTS PASARON - El sistema está funcionando correctamente")
    else:
        print("⚠️ ALGUNOS TESTS FALLARON - Revisar los errores arriba")
    print("="*50)

if __name__ == "__main__":
    main()
