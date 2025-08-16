#!/usr/bin/env python3
"""
Script simple para probar la creación de categorías sin imagen
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/usuarios/login/"
CATEGORIAS_URL = f"{BASE_URL}/categorias/"

def test_categoria_creation():
    """Probar creación de categoría sin imagen"""
    print("🧪 Probando creación de categoría...")
    
    # 1. Hacer login
    print("🔐 Haciendo login...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        login_response = requests.post(LOGIN_URL, json=login_data)
        if login_response.status_code != 200:
            print(f"❌ Error en login: {login_response.text}")
            return
        
        access_token = login_response.json().get('tokens', {}).get('access')
        print("✅ Login exitoso!")
        
        # 2. Crear categoría
        print("\n📝 Creando categoría...")
        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
        
        categoria_data = {
            "nombre": "Categoría de Prueba Frontend",
            "descripcion": "Esta es una categoría de prueba para el frontend",
            "activa": True
        }
        
        response = requests.post(CATEGORIAS_URL, json=categoria_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Categoría creada exitosamente!")
            print(f"ID: {data.get('id')}")
            print(f"Nombre: {data.get('nombre')}")
            print(f"Slug: {data.get('slug')}")
            print(f"Usuario: {data.get('usuario')}")
            return data.get('slug')
        else:
            print(f"❌ Error al crear categoría: {response.text}")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    print("=" * 60)
    test_categoria_creation()
    print("=" * 60)
