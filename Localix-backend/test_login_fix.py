#!/usr/bin/env python3
"""
Script para probar el sistema de login y verificar que los tokens se generan correctamente
"""

import requests
import json
import sys
import os

# Configuración
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/usuarios/login/"
REFRESH_URL = f"{BASE_URL}/usuarios/refresh/"
PROFILE_URL = f"{BASE_URL}/usuarios/profile/"

def test_login():
    """Probar el login con credenciales válidas"""
    print("🔐 Probando login...")
    
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login exitoso!")
            print(f"Usuario: {data.get('user', {}).get('username', 'N/A')}")
            print(f"Access Token: {data.get('tokens', {}).get('access', 'N/A')[:50]}...")
            print(f"Refresh Token: {data.get('tokens', {}).get('refresh', 'N/A')[:50]}...")
            return data.get('tokens', {})
        else:
            print(f"❌ Error en login: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_refresh_token(refresh_token):
    """Probar el refresh token"""
    print("\n🔄 Probando refresh token...")
    
    refresh_data = {
        "refresh": refresh_token
    }
    
    try:
        response = requests.post(REFRESH_URL, json=refresh_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Refresh token exitoso!")
            print(f"Nuevo Access Token: {data.get('access', 'N/A')[:50]}...")
            return data.get('access')
        else:
            print(f"❌ Error en refresh: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_profile(access_token):
    """Probar el endpoint de perfil con el access token"""
    print("\n👤 Probando endpoint de perfil...")
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.get(PROFILE_URL, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Perfil obtenido exitosamente!")
            print(f"Usuario: {data.get('user', {}).get('username', 'N/A')}")
            print(f"Email: {data.get('user', {}).get('email', 'N/A')}")
            return True
        else:
            print(f"❌ Error en perfil: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_invalid_refresh():
    """Probar con un refresh token inválido"""
    print("\n🚫 Probando refresh token inválido...")
    
    invalid_refresh_data = {
        "refresh": "invalid_token_here"
    }
    
    try:
        response = requests.post(REFRESH_URL, json=invalid_refresh_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Correctamente rechazó token inválido!")
            return True
        else:
            print(f"❌ No rechazó token inválido como esperado: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def main():
    print("🧪 Iniciando pruebas del sistema de autenticación...")
    print("=" * 60)
    
    # Probar login
    tokens = test_login()
    if not tokens:
        print("❌ No se pudo obtener tokens. Verificar que el backend esté corriendo.")
        return
    
    access_token = tokens.get('access')
    refresh_token = tokens.get('refresh')
    
    # Probar perfil con access token
    if access_token:
        test_profile(access_token)
    
    # Probar refresh token
    if refresh_token:
        new_access_token = test_refresh_token(refresh_token)
        if new_access_token:
            # Probar perfil con el nuevo access token
            test_profile(new_access_token)
    
    # Probar refresh token inválido
    test_invalid_refresh()
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas!")

if __name__ == "__main__":
    main()
