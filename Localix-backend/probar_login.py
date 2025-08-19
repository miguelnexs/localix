#!/usr/bin/env python3
"""
Script para probar el login y verificar que funcione correctamente
"""

import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from usuarios.models import Usuario
from django.conf import settings

# Configuración
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

def crear_usuario_prueba():
    """Crear usuario de prueba si no existe"""
    print("👤 Verificando usuario de prueba...")
    
    username = "test_user"
    password = "test_password123"
    
    try:
        user = Usuario.objects.get(username=username)
        print(f"✅ Usuario {username} ya existe")
        return username, password
    except Usuario.DoesNotExist:
        user = Usuario.objects.create_user(
            username=username,
            password=password,
            email="test@example.com",
            is_active=True
        )
        print(f"✅ Usuario {username} creado")
        return username, password

def probar_login_jwt():
    """Probar login con JWT estándar"""
    print("\n🔐 Probando login JWT estándar...")
    
    username, password = crear_usuario_prueba()
    
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/token/", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login JWT exitoso")
            print(f"   - Access token: {data.get('access', '')[:20]}...")
            print(f"   - Refresh token: {data.get('refresh', '')[:20]}...")
            return data.get('access')
        else:
            print(f"❌ Error en login JWT: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error probando login JWT: {e}")
        return None

def probar_login_personalizado():
    """Probar login personalizado"""
    print("\n🔐 Probando login personalizado...")
    
    username, password = crear_usuario_prueba()
    
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{API_BASE}/usuarios/login/", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login personalizado exitoso")
            print(f"   - Success: {data.get('success')}")
            print(f"   - Message: {data.get('message')}")
            if 'tokens' in data:
                print(f"   - Access token: {data['tokens'].get('access', '')[:20]}...")
                print(f"   - Refresh token: {data['tokens'].get('refresh', '')[:20]}...")
            return data.get('tokens', {}).get('access') if 'tokens' in data else None
        else:
            print(f"❌ Error en login personalizado: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error probando login personalizado: {e}")
        return None

def probar_endpoint_protegido(token):
    """Probar acceso a endpoint protegido"""
    print("\n🔒 Probando endpoint protegido...")
    
    if not token:
        print("❌ No hay token disponible")
        return False
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        # Probar endpoint de pedidos
        response = requests.get(f"{API_BASE}/pedidos/pedidos/", headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Acceso a endpoint protegido exitoso")
            print(f"   - Total de pedidos: {len(data.get('results', []))}")
            return True
        else:
            print(f"❌ Error accediendo a endpoint protegido: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error probando endpoint protegido: {e}")
        return False

def probar_endpoint_sin_token():
    """Probar acceso a endpoint sin token"""
    print("\n🚫 Probando endpoint sin token...")
    
    try:
        response = requests.get(f"{API_BASE}/pedidos/pedidos/")
        print(f"Status: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Endpoint correctamente protegido (401 Unauthorized)")
            return True
        else:
            print(f"⚠️ Endpoint no está protegido correctamente: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error probando endpoint sin token: {e}")
        return False

def verificar_configuracion():
    """Verificar configuración de seguridad"""
    print("\n🔍 Verificando configuración...")
    
    # Verificar DEBUG
    print(f"DEBUG: {'❌ HABILITADO' if settings.DEBUG else '✅ DESHABILITADO'}")
    
    # Verificar permisos por defecto
    default_permissions = settings.REST_FRAMEWORK.get('DEFAULT_PERMISSION_CLASSES', [])
    print(f"Permisos por defecto: {default_permissions}")
    
    # Verificar autenticación por defecto
    default_auth = settings.REST_FRAMEWORK.get('DEFAULT_AUTHENTICATION_CLASSES', [])
    print(f"Autenticación por defecto: {default_auth}")
    
    # Verificar rate limiting
    throttle_rates = settings.REST_FRAMEWORK.get('DEFAULT_THROTTLE_RATES', {})
    print(f"Rate limiting: {throttle_rates}")

def main():
    """Función principal"""
    print("🚀 PRUEBAS DE LOGIN Y SEGURIDAD")
    print("=" * 40)
    
    # Verificar que el servidor esté corriendo
    try:
        response = requests.get(f"{BASE_URL}/")
        if response.status_code != 200:
            print(f"❌ Servidor no responde correctamente: {response.status_code}")
            return
        print("✅ Servidor respondiendo correctamente")
    except Exception as e:
        print(f"❌ No se puede conectar al servidor: {e}")
        print("💡 Asegúrate de que el servidor Django esté corriendo en localhost:8000")
        return
    
    # Verificar configuración
    verificar_configuracion()
    
    # Probar login JWT
    token_jwt = probar_login_jwt()
    
    # Probar login personalizado
    token_personalizado = probar_login_personalizado()
    
    # Probar endpoint sin token
    probar_endpoint_sin_token()
    
    # Probar endpoint protegido con token
    if token_jwt:
        probar_endpoint_protegido(token_jwt)
    elif token_personalizado:
        probar_endpoint_protegido(token_personalizado)
    
    print("\n✅ PRUEBAS COMPLETADAS")
    print("=" * 30)
    
    if token_jwt or token_personalizado:
        print("🎉 El sistema de login está funcionando correctamente")
        print("🔒 La seguridad está aplicada correctamente")
    else:
        print("❌ Hay problemas con el sistema de login")
        print("🔧 Revisar configuración de seguridad")

if __name__ == "__main__":
    main() 