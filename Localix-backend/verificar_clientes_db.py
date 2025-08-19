#!/usr/bin/env python
"""
Script para verificar clientes en la base de datos
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from ventas.models import Cliente
from django.contrib.auth import get_user_model

User = get_user_model()

def verificar_clientes():
    print("🔍 VERIFICACIÓN DE CLIENTES EN LA BASE DE DATOS")
    print("=" * 50)
    
    # 1. Verificar usuarios
    print("\n1. Verificando usuarios...")
    usuarios = User.objects.all()
    print(f"✅ Total de usuarios: {usuarios.count()}")
    
    for usuario in usuarios:
        print(f"   - {usuario.username} ({usuario.email})")
    
    # 2. Verificar clientes
    print("\n2. Verificando clientes...")
    clientes = Cliente.objects.all()
    print(f"✅ Total de clientes: {clientes.count()}")
    
    if clientes.count() > 0:
        print("\n📋 Lista de clientes:")
        for cliente in clientes:
            print(f"   - ID: {cliente.id}")
            print(f"     Nombre: {cliente.nombre}")
            print(f"     Email: {cliente.email}")
            print(f"     Teléfono: {cliente.telefono}")
            print(f"     Documento: {cliente.tipo_documento} - {cliente.numero_documento}")
            print(f"     Activo: {cliente.activo}")
            print(f"     Creado: {cliente.fecha_registro}")
            print(f"     Usuario: {cliente.usuario.username if cliente.usuario else 'Sin usuario'}")
            print("     " + "-" * 30)
    else:
        print("❌ No hay clientes en la base de datos")
    
    # 3. Verificar clientes por usuario
    print("\n3. Clientes por usuario:")
    for usuario in usuarios:
        clientes_usuario = Cliente.objects.filter(usuario=usuario)
        print(f"   - {usuario.username}: {clientes_usuario.count()} clientes")
    
    # 4. Verificar URLs disponibles
    print("\n4. URLs disponibles para clientes:")
    print("   - GET /api/ventas/clientes/ - Listar todos los clientes")
    print("   - POST /api/ventas/clientes/ - Crear nuevo cliente")
    print("   - GET /api/ventas/clientes/{id}/ - Obtener cliente específico")
    print("   - PUT /api/ventas/clientes/{id}/ - Actualizar cliente")
    print("   - DELETE /api/ventas/clientes/{id}/ - Eliminar cliente")
    
    # 5. Probar API directamente
    print("\n5. Probando API directamente...")
    try:
        from django.test import Client
        from django.urls import reverse
        
        client = Client()
        
        # Probar endpoint de clientes
        response = client.get('/api/ventas/clientes/')
        print(f"   - Status code: {response.status_code}")
        
        if response.status_code == 200:
            print("   ✅ API de clientes responde correctamente")
            data = response.json()
            print(f"   - Clientes en API: {len(data.get('results', []))}")
        else:
            print(f"   ❌ Error en API: {response.status_code}")
            print(f"   - Respuesta: {response.content[:200]}")
            
    except Exception as e:
        print(f"   ❌ Error probando API: {e}")
    
    # 6. Verificar configuración de CORS
    print("\n6. Verificando configuración...")
    from django.conf import settings
    
    print(f"   - DEBUG: {settings.DEBUG}")
    print(f"   - CORS_ALLOWED_ORIGINS: {getattr(settings, 'CORS_ALLOWED_ORIGINS', 'No configurado')}")
    print(f"   - ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
    # 7. Crear cliente de prueba si no hay ninguno
    if clientes.count() == 0:
        print("\n7. Creando cliente de prueba...")
        try:
            usuario_default = User.objects.first()
            if usuario_default:
                cliente_prueba = Cliente.objects.create(
                    nombre="Cliente de Prueba",
                    email="prueba@example.com",
                    telefono="3001234567",
                    tipo_documento="dni",
                    numero_documento="12345678",
                    direccion="Dirección de prueba",
                    activo=True,
                    usuario=usuario_default
                )
                print(f"   ✅ Cliente de prueba creado: {cliente_prueba.nombre}")
            else:
                print("   ❌ No hay usuarios disponibles para crear cliente")
        except Exception as e:
            print(f"   ❌ Error creando cliente de prueba: {e}")
    
    print("\n" + "=" * 50)
    print("✅ VERIFICACIÓN COMPLETADA")

if __name__ == "__main__":
    verificar_clientes() 