#!/usr/bin/env python3
"""
Script de prueba para verificar la creación de categorías con imágenes
"""
import os
import sys
import django
import requests
from pathlib import Path

# Configurar Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_category_creation():
    """Prueba la creación de una categoría con imagen"""
    
    # URL del backend
    base_url = "http://localhost:8000"
    
    # Primero obtener un token de autenticación
    login_data = {
        "username": "admin",  # Cambiar por un usuario válido
        "password": "admin"   # Cambiar por la contraseña correcta
    }
    
    try:
        # Login para obtener token
        login_response = requests.post(f"{base_url}/api/auth/token/", json=login_data)
        if login_response.status_code != 200:
            print(f"Error en login: {login_response.status_code}")
            print(login_response.text)
            return
        
        token = login_response.json()['access']
        print(f"Token obtenido: {token[:20]}...")
        
        # Crear una imagen de prueba
        test_image_path = "test_image.png"
        if not os.path.exists(test_image_path):
            # Crear una imagen simple de prueba
            from PIL import Image
            img = Image.new('RGB', (100, 100), color='red')
            img.save(test_image_path)
            print(f"Imagen de prueba creada: {test_image_path}")
        
        # Preparar datos para crear categoría
        headers = {
            'Authorization': f'Bearer {token}',
        }
        
        # Crear categoría sin imagen primero
        category_data = {
            'nombre': 'Categoría de Prueba',
            'descripcion': 'Descripción de prueba',
            'activa': True
        }
        
        print("Creando categoría sin imagen...")
        response = requests.post(f"{base_url}/api/categorias/", json=category_data, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            category = response.json()
            print(f"Categoría creada: {category}")
            
            # Ahora actualizar con imagen
            print("Actualizando categoría con imagen...")
            with open(test_image_path, 'rb') as f:
                files = {'imagen': f}
                update_response = requests.patch(
                    f"{base_url}/api/categorias/{category['slug']}/",
                    files=files,
                    headers=headers
                )
                print(f"Update Status: {update_response.status_code}")
                print(f"Update Response: {update_response.text}")
        
    except Exception as e:
        print(f"Error en la prueba: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_category_creation()
