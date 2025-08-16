#!/usr/bin/env python3
"""
Script para probar la creación de categorías con el sistema multi-tenancy
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

def test_categoria_creation():
    print("🧪 Probando creación de categorías con multi-tenancy...")
    
    # Obtener usuarios de prueba
    try:
        user1 = User.objects.get(username='vendedor1')
        user2 = User.objects.get(username='vendedor2')
        print(f"✅ Usuarios encontrados: {user1.username}, {user2.username}")
    except User.DoesNotExist:
        print("❌ Usuarios de prueba no encontrados. Ejecuta create_test_users.py primero.")
        return False
    
    # Crear request factory para simular requests
    factory = RequestFactory()
    
    # Probar creación para usuario 1
    print(f"\n📝 Probando creación para {user1.username}...")
    request1 = factory.post('/api/categorias/')
    request1.user = user1
    
    categoria_data1 = {
        'nombre': 'Electrónicos',
        'descripcion': 'Productos electrónicos',
        'activa': True,
        'orden': 1
    }
    
    serializer1 = CategoriaSerializer(data=categoria_data1, context={'request': request1})
    if serializer1.is_valid():
        categoria1 = serializer1.save(usuario=user1)
        print(f"   ✅ Categoría creada: {categoria1.nombre} (slug: {categoria1.slug})")
    else:
        print(f"   ❌ Error de validación: {serializer1.errors}")
        return False
    
    # Probar creación de categoría con mismo nombre para usuario 2 (debería funcionar)
    print(f"\n📝 Probando creación para {user2.username} con mismo nombre...")
    request2 = factory.post('/api/categorias/')
    request2.user = user2
    
    categoria_data2 = {
        'nombre': 'Electrónicos',  # Mismo nombre que usuario 1
        'descripcion': 'Electrónicos para tienda 2',
        'activa': True,
        'orden': 1
    }
    
    serializer2 = CategoriaSerializer(data=categoria_data2, context={'request': request2})
    if serializer2.is_valid():
        categoria2 = serializer2.save(usuario=user2)
        print(f"   ✅ Categoría creada: {categoria2.nombre} (slug: {categoria2.slug})")
    else:
        print(f"   ❌ Error de validación: {serializer2.errors}")
        return False
    
    # Probar creación de categoría con mismo nombre para usuario 1 (debería fallar)
    print(f"\n📝 Probando duplicado para {user1.username}...")
    categoria_data3 = {
        'nombre': 'Electrónicos',  # Mismo nombre que ya existe para usuario 1
        'descripcion': 'Duplicado',
        'activa': True,
        'orden': 2
    }
    
    serializer3 = CategoriaSerializer(data=categoria_data3, context={'request': request1})
    if serializer3.is_valid():
        print("   ❌ Debería haber fallado por duplicado")
        return False
    else:
        print(f"   ✅ Correctamente rechazado: {serializer3.errors}")
    
    # Verificar aislamiento de datos
    print(f"\n🔍 Verificando aislamiento de datos...")
    categorias_user1 = CategoriaProducto.objects.filter(usuario=user1)
    categorias_user2 = CategoriaProducto.objects.filter(usuario=user2)
    
    print(f"   Categorías de {user1.username}: {categorias_user1.count()}")
    print(f"   Categorías de {user2.username}: {categorias_user2.count()}")
    
    # Verificar que los slugs son únicos por usuario
    slugs_user1 = list(categorias_user1.values_list('slug', flat=True))
    slugs_user2 = list(categorias_user2.values_list('slug', flat=True))
    
    print(f"   Slugs de {user1.username}: {slugs_user1}")
    print(f"   Slugs de {user2.username}: {slugs_user2}")
    
    # Verificar que no hay conflictos entre usuarios
    conflict_slugs = set(slugs_user1) & set(slugs_user2)
    if conflict_slugs:
        print(f"   ⚠️ Conflictos de slug encontrados: {conflict_slugs}")
    else:
        print(f"   ✅ No hay conflictos de slug entre usuarios")
    
    return True

def test_api_endpoint():
    print("\n🌐 Probando endpoint de API...")
    
    # Crear cliente API
    client = APIClient()
    
    # Obtener usuario de prueba
    try:
        user = User.objects.get(username='vendedor1')
    except User.DoesNotExist:
        print("❌ Usuario de prueba no encontrado")
        return False
    
    # Autenticar usuario
    client.force_authenticate(user=user)
    
    # Datos de categoría
    categoria_data = {
        'nombre': 'Ropa',
        'descripcion': 'Productos de vestimenta',
        'activa': True,
        'orden': 1
    }
    
    # Hacer request POST
    response = client.post('/api/categorias/', categoria_data, format='json')
    
    print(f"   Status Code: {response.status_code}")
    if response.status_code == 201:
        print(f"   ✅ Categoría creada via API: {response.data['nombre']}")
        return True
    else:
        print(f"   ❌ Error en API: {response.data}")
        return False

def main():
    print("=" * 60)
    print("🧪 TEST CREACIÓN DE CATEGORÍAS")
    print("=" * 60)
    
    success1 = test_categoria_creation()
    success2 = test_api_endpoint()
    
    print("\n" + "=" * 60)
    print("📊 RESUMEN")
    print("=" * 60)
    print(f"   Test serializer: {'✅ PASÓ' if success1 else '❌ FALLÓ'}")
    print(f"   Test API: {'✅ PASÓ' if success2 else '❌ FALLÓ'}")
    
    if success1 and success2:
        print("\n✅ Todos los tests pasaron. La creación de categorías funciona correctamente.")
    else:
        print("\n❌ Algunos tests fallaron. Revisa los errores arriba.")
    
    print("=" * 60)

if __name__ == '__main__':
    main()
