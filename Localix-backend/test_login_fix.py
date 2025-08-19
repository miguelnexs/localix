#!/usr/bin/env python
"""
Script para probar el login y verificar que los tokens se devuelvan correctamente
"""
import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_login_api():
    """Probar la API de login"""
    print("🧪 Probando API de login")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    # 1. Probar login con usuario válido
    print("\n1. Probando login con test_trial...")
    login_data = {
        "username": "test_trial",
        "password": "testpass123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Login exitoso")
            print(f"   👤 Usuario: {result['user']['username']}")
            print(f"   🔑 Access Token: {result['tokens']['access'][:50]}...")
            print(f"   🔄 Refresh Token: {result['tokens']['refresh'][:50]}...")
            
            # Verificar estructura de respuesta
            if 'tokens' in result and 'access' in result['tokens']:
                print("   ✅ Estructura de tokens correcta")
            else:
                print("   ❌ Estructura de tokens incorrecta")
            
            return result['tokens']['access']
        else:
            print(f"   ❌ Error en login: {response.text}")
            return None
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return None

def test_plan_status_with_token(token):
    """Probar el estado del plan con el token"""
    print("\n2. Probando estado del plan...")
    
    if not token:
        print("   ❌ No hay token disponible")
        return
    
    base_url = "http://localhost:8000"
    
    try:
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            plan_data = response.json()
            print("   ✅ API del plan exitosa")
            print(f"   📊 Datos del plan:")
            print(f"      - Plan type: {plan_data['plan_type']}")
            print(f"      - Days remaining: {plan_data['days_remaining']}")
            print(f"      - Is expired: {plan_data['is_expired']}")
            print(f"      - Is active: {plan_data['is_active']}")
            print(f"      - End date: {plan_data['end_date']}")
            
            # Análisis como lo hace el frontend
            is_expired = plan_data['is_expired'] == True
            is_active = not is_expired
            
            print(f"   🔍 Análisis del frontend:")
            print(f"      - isExpired (calculado): {is_expired}")
            print(f"      - isActive (calculado): {is_active}")
            
            if is_active and not is_expired:
                print("   ✅ Usuario debería tener acceso al dashboard")
            else:
                print("   ❌ Usuario NO debería tener acceso al dashboard")
                
        else:
            print(f"   ❌ Error en API del plan: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")

def test_admin_login():
    """Probar login con admin"""
    print("\n3. Probando login con admin...")
    
    base_url = "http://localhost:8000"
    
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Login admin exitoso")
            print(f"   👤 Usuario: {result['user']['username']}")
            print(f"   🔧 Es superusuario: {result['user']['is_superuser']}")
            
            # Probar estado del plan del admin
            token = result['tokens']['access']
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers)
            if plan_response.status_code == 200:
                plan_data = plan_response.json()
                print(f"   📊 Plan del admin:")
                print(f"      - Plan type: {plan_data['plan_type']}")
                print(f"      - Days remaining: {plan_data['days_remaining']}")
                print(f"      - Is expired: {plan_data['is_expired']}")
                print(f"      - Is active: {plan_data['is_active']}")
            else:
                print(f"   ❌ Error obteniendo plan del admin: {plan_response.text}")
                
        else:
            print(f"   ❌ Error en login admin: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")

if __name__ == "__main__":
    print("🧪 Prueba de Login y Tokens")
    print("=" * 60)
    
    # Probar login normal
    token = test_login_api()
    
    # Probar estado del plan
    test_plan_status_with_token(token)
    
    # Probar login admin
    test_admin_login()
    
    print("\n✅ Prueba completada")
