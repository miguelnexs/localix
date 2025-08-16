#!/usr/bin/env python3
"""
Script para probar directamente la API de productos
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/usuarios/login/"
PRODUCTOS_URL = f"{BASE_URL}/productos/productos/"  # URL correcta según la configuración

def test_productos_direct():
    print("🔍 Probando API de productos directamente...")
    
    # 1. Login
    print("\n1. Login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(LOGIN_URL, json=login_data)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            token = login_result.get('tokens', {}).get('access') or login_result.get('access')
            if token:
                print(f"   Login exitoso: {token[:50]}...")
                headers = {'Authorization': f'Bearer {token}'}
            else:
                print(f"   Error: No se recibió token de acceso")
                return
        else:
            print(f"   Error en login: {login_response.text}")
            return
    except Exception as e:
        print(f"   Error conectando al servidor: {e}")
        return
    
    # 2. Probar diferentes URLs de productos
    urls_to_test = [
        f"{BASE_URL}/productos/",
        f"{BASE_URL}/productos/productos/",
        f"{BASE_URL}/productos/productos/?page_size=10",
        f"{BASE_URL}/productos/productos/?ordering=nombre",
    ]
    
    for i, url in enumerate(urls_to_test, 1):
        print(f"\n{i}. Probando URL: {url}")
        try:
            response = requests.get(url, headers=headers)
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Tipo de respuesta: {type(data)}")
                
                if isinstance(data, dict):
                    print(f"   Claves: {list(data.keys())}")
                    
                    if 'results' in data:
                        print(f"   - 'results' existe: {type(data['results'])}")
                        if isinstance(data['results'], list):
                            print(f"   - Longitud de 'results': {len(data['results'])}")
                            if len(data['results']) > 0:
                                print(f"   - Primer elemento: {type(data['results'][0])}")
                                print(f"   - Claves del primer elemento: {list(data['results'][0].keys()) if isinstance(data['results'][0], dict) else 'No es dict'}")
                    else:
                        print(f"   - No tiene 'results'")
                        print(f"   - Contenido: {data}")
                else:
                    print(f"   - Respuesta no es dict: {data}")
            else:
                print(f"   Error: {response.text}")
        except Exception as e:
            print(f"   Error: {e}")
    
    print("\n✅ Prueba completada")

if __name__ == "__main__":
    test_productos_direct()
