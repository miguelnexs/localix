#!/usr/bin/env python3
"""
Script para probar la autenticación
"""
import requests
import json

def test_authentication():
    """Probar la autenticación completa"""
    
    base_url = "http://localhost:8000"
    
    print("=" * 60)
    print("🧪 PRUEBA DE AUTENTICACIÓN")
    print("=" * 60)
    
    # Paso 1: Login
    print("\n1️⃣ Probando login...")
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            print("   ✅ Login exitoso!")
            print(f"   Usuario: {login_result['user']['username']}")
            print(f"   Email: {login_result['user']['email']}")
            
            # Extraer tokens
            access_token = login_result['tokens']['access']
            refresh_token = login_result['tokens']['refresh']
            
            print(f"   Access Token: {access_token[:20]}...")
            print(f"   Refresh Token: {refresh_token[:20]}...")
            
        else:
            print(f"   ❌ Error en login: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return False
    
    # Paso 2: Probar endpoint protegido (profile)
    print("\n2️⃣ Probando endpoint protegido (profile)...")
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    try:
        profile_response = requests.get(f"{base_url}/api/usuarios/profile/", headers=headers)
        print(f"   Status: {profile_response.status_code}")
        
        if profile_response.status_code == 200:
            profile_result = profile_response.json()
            print("   ✅ Profile accedido exitosamente!")
            print(f"   Usuario: {profile_result['user']['username']}")
        else:
            print(f"   ❌ Error accediendo profile: {profile_response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return False
    
    # Paso 3: Probar endpoint de categorías
    print("\n3️⃣ Probando endpoint de categorías...")
    
    try:
        categories_response = requests.get(f"{base_url}/api/categorias/", headers=headers)
        print(f"   Status: {categories_response.status_code}")
        
        if categories_response.status_code == 200:
            categories_result = categories_response.json()
            print("   ✅ Categorías accedidas exitosamente!")
            print(f"   Total categorías: {len(categories_result.get('results', []))}")
        else:
            print(f"   ❌ Error accediendo categorías: {categories_response.text}")
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Paso 4: Probar refresh token
    print("\n4️⃣ Probando refresh token...")
    refresh_data = {
        "refresh": refresh_token
    }
    
    try:
        refresh_response = requests.post(f"{base_url}/api/usuarios/refresh/", json=refresh_data)
        print(f"   Status: {refresh_response.status_code}")
        
        if refresh_response.status_code == 200:
            refresh_result = refresh_response.json()
            print("   ✅ Refresh token exitoso!")
            print(f"   Nuevo Access Token: {refresh_result['access'][:20]}...")
        else:
            print(f"   ❌ Error en refresh: {refresh_response.text}")
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA DE AUTENTICACIÓN COMPLETADA")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    test_authentication()
