#!/usr/bin/env python3
"""
Script para debuggear la creación de categorías con datos exactos del frontend
"""
import os
import sys
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import RequestFactory
from rest_framework.test import APIClient
from categorias.models import CategoriaProducto
from categorias.serializers import CategoriaSerializer

User = get_user_model()

def debug_categoria_creation():
    print("🔍 Debuggeando creación de categoría...")
    
    # Obtener usuario de prueba
    try:
        user = User.objects.get(username='vendedor1')
        print(f"✅ Usuario encontrado: {user.username}")
    except User.DoesNotExist:
        print("❌ Usuario de prueba no encontrado")
        return False
    
    # Datos exactos que envía el frontend
    categoria_data = {
        'nombre': 'categoria',
        'descripcion': 'Esta es la descripcion de la categoria',
        'activa': True
    }
    
    print(f"\n📤 Datos a enviar: {categoria_data}")
    
    # Probar con serializer directamente
    print(f"\n🧪 Probando serializer...")
    factory = RequestFactory()
    request = factory.post('/api/categorias/')
    request.user = user
    
    serializer = CategoriaSerializer(data=categoria_data, context={'request': request})
    
    print(f"   Serializer válido: {serializer.is_valid()}")
    if not serializer.is_valid():
        print(f"   ❌ Errores de validación: {serializer.errors}")
        return False
    
    # Intentar crear la categoría
    try:
        categoria = serializer.save(usuario=user)
        print(f"   ✅ Categoría creada: {categoria.nombre} (ID: {categoria.id})")
    except Exception as e:
        print(f"   ❌ Error al guardar: {str(e)}")
        import traceback
        print(f"   Traceback: {traceback.format_exc()}")
        return False
    
    # Probar con API client
    print(f"\n🌐 Probando API client...")
    client = APIClient()
    client.force_authenticate(user=user)
    
    response = client.post('/api/categorias/', categoria_data, format='json')
    
    print(f"   Status Code: {response.status_code}")
    print(f"   Response Data: {response.data}")
    
    if response.status_code == 201:
        print(f"   ✅ API funcionando correctamente")
        return True
    else:
        print(f"   ❌ Error en API: {response.data}")
        return False

def test_existing_categories():
    print(f"\n📊 Verificando categorías existentes...")
    
    try:
        user = User.objects.get(username='vendedor1')
        categorias = CategoriaProducto.objects.filter(usuario=user)
        
        print(f"   Categorías de {user.username}: {categorias.count()}")
        for cat in categorias:
            print(f"     - {cat.nombre} (slug: {cat.slug})")
            
        # Verificar si ya existe una categoría con el nombre "categoria"
        existing = CategoriaProducto.objects.filter(usuario=user, nombre__iexact='categoria').first()
        if existing:
            print(f"   ⚠️ Ya existe una categoría con nombre 'categoria': {existing.nombre}")
            return True
        else:
            print(f"   ✅ No existe categoría con nombre 'categoria'")
            return False
            
    except Exception as e:
        print(f"   ❌ Error verificando categorías: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🔍 DEBUG CREACIÓN DE CATEGORÍAS")
    print("=" * 60)
    
    # Verificar si ya existe la categoría
    exists = test_existing_categories()
    
    if exists:
        print(f"\n⚠️ La categoría 'categoria' ya existe. Esto podría causar el error 400.")
        print(f"💡 Intenta con un nombre diferente.")
    else:
        success = debug_categoria_creation()
        if success:
            print(f"\n✅ Debug completado exitosamente")
        else:
            print(f"\n❌ Debug falló")
    
    print("=" * 60)

if __name__ == '__main__':
    main()
