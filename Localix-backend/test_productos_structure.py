#!/usr/bin/env python3
"""
Script para probar la estructura de datos de la API de productos
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/usuarios/login/"
PRODUCTOS_URL = f"{BASE_URL}/productos/"
CATEGORIAS_URL = f"{BASE_URL}/categorias/"
VENTAS_URL = f"{BASE_URL}/ventas/resumen/"

def test_api_structure():
    print("🔍 Probando estructura de datos de las APIs...")
    
    # 1. Probar login
    print("\n1. Probando login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(LOGIN_URL, json=login_data)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            # El token está en tokens.access según la respuesta
            token = login_result.get('tokens', {}).get('access') or login_result.get('access')
            if token:
                print(f"   Login exitoso: {token[:50]}...")
                headers = {'Authorization': f'Bearer {token}'}
            else:
                print(f"   Error: No se recibió token de acceso")
                print(f"   Respuesta: {login_result}")
                return
        else:
            print(f"   Error en login: {login_response.text}")
            return
    except Exception as e:
        print(f"   Error conectando al servidor: {e}")
        return
    
    # 2. Probar API de productos
    print("\n2. Probando API de productos...")
    try:
        productos_response = requests.get(PRODUCTOS_URL, headers=headers)
        print(f"   Status: {productos_response.status_code}")
        
        if productos_response.status_code == 200:
            productos_data = productos_response.json()
            print(f"   Tipo de respuesta: {type(productos_data)}")
            print(f"   Claves principales: {list(productos_data.keys()) if isinstance(productos_data, dict) else 'No es dict'}")
            
            if isinstance(productos_data, dict):
                if 'results' in productos_data:
                    print(f"   - 'results' existe: {type(productos_data['results'])}")
                    print(f"   - Longitud de 'results': {len(productos_data['results']) if isinstance(productos_data['results'], list) else 'No es lista'}")
                    if isinstance(productos_data['results'], list) and len(productos_data['results']) > 0:
                        print(f"   - Primer elemento: {type(productos_data['results'][0])}")
                else:
                    print(f"   - No tiene 'results', estructura: {productos_data}")
            else:
                print(f"   - Respuesta no es dict: {productos_data}")
        else:
            print(f"   Error en productos: {productos_response.text}")
    except Exception as e:
        print(f"   Error probando productos: {e}")
    
    # 3. Probar API de categorías
    print("\n3. Probando API de categorías...")
    try:
        categorias_response = requests.get(CATEGORIAS_URL, headers=headers)
        print(f"   Status: {categorias_response.status_code}")
        
        if categorias_response.status_code == 200:
            categorias_data = categorias_response.json()
            print(f"   Tipo de respuesta: {type(categorias_data)}")
            print(f"   Claves principales: {list(categorias_data.keys()) if isinstance(categorias_data, dict) else 'No es dict'}")
            
            if isinstance(categorias_data, dict):
                if 'results' in categorias_data:
                    print(f"   - 'results' existe: {type(categorias_data['results'])}")
                    print(f"   - Longitud de 'results': {len(categorias_data['results']) if isinstance(categorias_data['results'], list) else 'No es lista'}")
                else:
                    print(f"   - No tiene 'results', estructura: {categorias_data}")
            else:
                print(f"   - Respuesta no es dict: {categorias_data}")
        else:
            print(f"   Error en categorías: {categorias_response.text}")
    except Exception as e:
        print(f"   Error probando categorías: {e}")
    
    # 4. Probar API de ventas
    print("\n4. Probando API de ventas...")
    try:
        ventas_response = requests.get(VENTAS_URL, headers=headers)
        print(f"   Status: {ventas_response.status_code}")
        
        if ventas_response.status_code == 200:
            ventas_data = ventas_response.json()
            print(f"   Tipo de respuesta: {type(ventas_data)}")
            print(f"   Claves principales: {list(ventas_data.keys()) if isinstance(ventas_data, dict) else 'No es dict'}")
            
            if isinstance(ventas_data, dict):
                if 'resumen' in ventas_data:
                    print(f"   - 'resumen' existe: {type(ventas_data['resumen'])}")
                if 'ventas' in ventas_data:
                    print(f"   - 'ventas' existe: {type(ventas_data['ventas'])}")
                    if isinstance(ventas_data['ventas'], list):
                        print(f"   - Longitud de 'ventas': {len(ventas_data['ventas'])}")
            else:
                print(f"   - Respuesta no es dict: {ventas_data}")
        else:
            print(f"   Error en ventas: {ventas_response.text}")
    except Exception as e:
        print(f"   Error probando ventas: {e}")
    
    print("\n✅ Prueba completada")

if __name__ == "__main__":
    test_api_structure()
