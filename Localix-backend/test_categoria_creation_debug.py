#!/usr/bin/env python3
"""
Script para probar la creación de categorías y diagnosticar errores 400
"""

import requests
import json
import sys
import os

# Configuración
BASE_URL = "http://localhost:8000/api"
LOGIN_URL = f"{BASE_URL}/usuarios/login/"
CATEGORIAS_URL = f"{BASE_URL}/categorias/"

def login_and_get_token():
    """Hacer login y obtener token"""
    print("🔐 Haciendo login...")
    
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        print(f"Login Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Login exitoso!")
            return data.get('tokens', {}).get('access')
        else:
            print(f"❌ Error en login: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_categoria_creation(access_token):
    """Probar creación de categoría"""
    print("\n📝 Probando creación de categoría...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # Datos de prueba
    categoria_data = {
        "nombre": "Categoría de Prueba",
        "descripcion": "Descripción de prueba",
        "activa": True
    }
    
    print(f"Datos a enviar: {categoria_data}")
    
    try:
        response = requests.post(CATEGORIAS_URL, json=categoria_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Categoría creada exitosamente!")
            print(f"ID: {data.get('id')}")
            print(f"Nombre: {data.get('nombre')}")
            print(f"Slug: {data.get('slug')}")
            return True
        else:
            print(f"❌ Error al crear categoría: {response.text}")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return False

def test_categoria_with_same_name(access_token):
    """Probar crear categoría con el mismo nombre (debería fallar)"""
    print("\n🔄 Probando crear categoría con el mismo nombre...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    categoria_data = {
        "nombre": "Categoría de Prueba",
        "descripcion": "Segunda descripción",
        "activa": True
    }
    
    try:
        response = requests.post(CATEGORIAS_URL, json=categoria_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Correctamente rechazó categoría duplicada!")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
        else:
            print(f"❌ No rechazó categoría duplicada como esperado: {response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def test_categoria_with_empty_name(access_token):
    """Probar crear categoría con nombre vacío"""
    print("\n🚫 Probando crear categoría con nombre vacío...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    categoria_data = {
        "nombre": "",
        "descripcion": "Descripción sin nombre",
        "activa": True
    }
    
    try:
        response = requests.post(CATEGORIAS_URL, json=categoria_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 400:
            print("✅ Correctamente rechazó nombre vacío!")
            try:
                error_data = response.json()
                print(f"Error details: {json.dumps(error_data, indent=2)}")
            except:
                print(f"Raw response: {response.text}")
        else:
            print(f"❌ No rechazó nombre vacío como esperado: {response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def test_categoria_without_auth():
    """Probar crear categoría sin autenticación"""
    print("\n🔒 Probando crear categoría sin autenticación...")
    
    categoria_data = {
        "nombre": "Categoría Sin Auth",
        "descripcion": "Sin autenticación",
        "activa": True
    }
    
    try:
        response = requests.post(CATEGORIAS_URL, json=categoria_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Correctamente rechazó sin autenticación!")
        else:
            print(f"❌ No rechazó sin autenticación como esperado: {response.text}")
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

def main():
    print("🧪 Iniciando pruebas de creación de categorías...")
    print("=" * 60)
    
    # Hacer login
    access_token = login_and_get_token()
    if not access_token:
        print("❌ No se pudo obtener token. Verificar que el backend esté corriendo.")
        return
    
    # Probar creación de categoría
    success = test_categoria_creation(access_token)
    
    if success:
        # Probar casos de error
        test_categoria_with_same_name(access_token)
        test_categoria_with_empty_name(access_token)
        test_categoria_without_auth()
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas!")

if __name__ == "__main__":
    main()
