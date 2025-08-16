#!/usr/bin/env python
import os
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_refresh_token():
    """Probar el endpoint de refresh token"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Probando endpoint de refresh token...")
    print("=" * 50)
    
    # Test 1: Login para obtener tokens
    print("\n1. Haciendo login para obtener tokens...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            access_token = data['tokens']['access']
            refresh_token = data['tokens']['refresh']
            print("✅ Login exitoso!")
            print(f"   Access Token: {access_token[:50]}...")
            print(f"   Refresh Token: {refresh_token[:50]}...")
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(response.text)
            return
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return
    
    # Test 2: Probar refresh token
    print("\n2. Probando refresh token...")
    refresh_data = {
        "refresh": refresh_token
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/refresh/", json=refresh_data)
        if response.status_code == 200:
            data = response.json()
            new_access_token = data['access']
            print("✅ Refresh token exitoso!")
            print(f"   Nuevo Access Token: {new_access_token[:50]}...")
        else:
            print(f"❌ Error en refresh: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    # Test 3: Probar con token inválido
    print("\n3. Probando con refresh token inválido...")
    invalid_refresh_data = {
        "refresh": "invalid_token_here"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/refresh/", json=invalid_refresh_data)
        if response.status_code == 401:
            print("✅ Correctamente rechazó token inválido")
        else:
            print(f"❌ Debería haber rechazado el token: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    # Test 4: Probar sin refresh token
    print("\n4. Probando sin refresh token...")
    empty_data = {}
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/refresh/", json=empty_data)
        if response.status_code == 400:
            print("✅ Correctamente rechazó request sin token")
        else:
            print(f"❌ Debería haber rechazado request sin token: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Pruebas completadas!")

if __name__ == "__main__":
    test_refresh_token()
