#!/usr/bin/env python
"""
Script para probar la API de clientes con autenticación
"""

import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

def probar_api_clientes():
    print("🔍 PROBANDO API DE CLIENTES CON AUTENTICACIÓN")
    print("=" * 50)
    
    # 1. Obtener token de autenticación
    print("\n1. Obteniendo token de autenticación...")
    
    # Buscar usuario existente
    usuario = User.objects.first()
    if not usuario:
        print("❌ No hay usuarios en la base de datos")
        return
    
    print(f"✅ Usuario encontrado: {usuario.username}")
    
    # Generar token
    refresh = RefreshToken.for_user(usuario)
    access_token = str(refresh.access_token)
    
    print(f"✅ Token generado: {access_token[:50]}...")
    
    # 2. Probar API sin autenticación
    print("\n2. Probando API sin autenticación...")
    try:
        response = requests.get('http://localhost:8000/api/ventas/clientes/')
        print(f"   - Status: {response.status_code}")
        print(f"   - Respuesta: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 3. Probar API con autenticación
    print("\n3. Probando API con autenticación...")
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('http://localhost:8000/api/ventas/clientes/', headers=headers)
        print(f"   - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API responde correctamente")
            print(f"   - Total de clientes: {len(data.get('results', []))}")
            
            if 'results' in data:
                for cliente in data['results']:
                    print(f"     - {cliente.get('nombre', 'Sin nombre')} ({cliente.get('email', 'Sin email')})")
        else:
            print(f"   ❌ Error en API: {response.status_code}")
            print(f"   - Respuesta: {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 4. Probar creación de cliente
    print("\n4. Probando creación de cliente...")
    nuevo_cliente = {
        'nombre': 'Cliente Test API',
        'email': 'testapi@example.com',
        'telefono': '3001234567',
        'tipo_documento': 'dni',
        'numero_documento': '87654321',
        'direccion': 'Dirección de prueba API',
        'activo': True
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/ventas/clientes/',
            headers=headers,
            json=nuevo_cliente
        )
        print(f"   - Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"   ✅ Cliente creado exitosamente")
            print(f"   - ID: {data.get('id')}")
            print(f"   - Nombre: {data.get('nombre')}")
        else:
            print(f"   ❌ Error creando cliente: {response.status_code}")
            print(f"   - Respuesta: {response.text[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 5. Verificar clientes en base de datos
    print("\n5. Verificando clientes en base de datos...")
    from ventas.models import Cliente
    
    clientes = Cliente.objects.filter(usuario=usuario)
    print(f"   - Total de clientes para {usuario.username}: {clientes.count()}")
    
    for cliente in clientes:
        print(f"     - {cliente.nombre} ({cliente.email})")
    
    # 6. Probar otros endpoints
    print("\n6. Probando otros endpoints...")
    
    endpoints = [
        ('GET', '/api/ventas/'),
        ('GET', '/api/productos/'),
        ('GET', '/api/categorias/'),
    ]
    
    for method, endpoint in endpoints:
        try:
            if method == 'GET':
                response = requests.get(f'http://localhost:8000{endpoint}', headers=headers)
            else:
                response = requests.post(f'http://localhost:8000{endpoint}', headers=headers)
            
            print(f"   - {method} {endpoint}: {response.status_code}")
            
        except Exception as e:
            print(f"   - {method} {endpoint}: Error - {e}")
    
    print("\n" + "=" * 50)
    print("✅ PRUEBA COMPLETADA")

if __name__ == "__main__":
    probar_api_clientes() 