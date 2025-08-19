#!/usr/bin/env python3
"""
Script para probar los endpoints de la API de Tienda
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(url, name):
    """Prueba un endpoint y muestra el resultado"""
    try:
        response = requests.get(url, timeout=5)
        print(f"\n✅ {name}: {url}")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            except:
                print(f"Response: {response.text[:200]}...")
        else:
            print(f"Error: {response.text}")
    except requests.exceptions.ConnectionError:
        print(f"❌ {name}: {url}")
        print("Error: No se pudo conectar al servidor")
    except Exception as e:
        print(f"❌ {name}: {url}")
        print(f"Error: {str(e)}")

def main():
    print("🧪 Probando endpoints de la API de Tienda")
    print("=" * 50)
    
    # Lista de endpoints a probar
    endpoints = [
        (f"{BASE_URL}/", "Página principal"),
        (f"{BASE_URL}/health/", "Health check"),
        (f"{BASE_URL}/admin/", "Admin Django"),
        (f"{BASE_URL}/api/categorias/", "API Categorías"),
        (f"{BASE_URL}/api/productos/", "API Productos"),
        (f"{BASE_URL}/api/ventas/", "API Ventas"),
        (f"{BASE_URL}/api/pedidos/", "API Pedidos"),
    ]
    
    for url, name in endpoints:
        test_endpoint(url, name)
    
    print("\n" + "=" * 50)
    print("🎯 Pruebas completadas!")

if __name__ == "__main__":
    main()


