#!/usr/bin/env python3
"""
Script para probar la creación de categorías con imágenes
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

def test_categoria_without_image(access_token):
    """Probar creación de categoría sin imagen"""
    print("\n📝 Probando creación de categoría SIN imagen...")
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    categoria_data = {
        "nombre": "Categoría Sin Imagen",
        "descripcion": "Descripción sin imagen",
        "activa": True
    }
    
    try:
        response = requests.post(CATEGORIAS_URL, json=categoria_data, headers=headers)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Categoría sin imagen creada exitosamente!")
            print(f"ID: {data.get('id')}")
            print(f"Nombre: {data.get('nombre')}")
            return data.get('slug')
        else:
            print(f"❌ Error al crear categoría sin imagen: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_categoria_with_image(access_token):
    """Probar creación de categoría con imagen"""
    print("\n🖼️ Probando creación de categoría CON imagen...")
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Crear un archivo de imagen de prueba (1x1 pixel PNG)
    test_image_path = "test_image.png"
    create_test_image(test_image_path)
    
    try:
        with open(test_image_path, 'rb') as image_file:
            files = {
                'imagen': ('test_image.png', image_file, 'image/png')
            }
            
            data = {
                'nombre': 'Categoría Con Imagen',
                'descripcion': 'Descripción con imagen',
                'activa': 'true'
            }
            
            response = requests.post(CATEGORIAS_URL, data=data, files=files, headers=headers)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 201:
                response_data = response.json()
                print("✅ Categoría con imagen creada exitosamente!")
                print(f"ID: {response_data.get('id')}")
                print(f"Nombre: {response_data.get('nombre')}")
                print(f"Imagen URL: {response_data.get('imagen_url')}")
                return response_data.get('slug')
            else:
                print(f"❌ Error al crear categoría con imagen: {response.text}")
                try:
                    error_data = response.json()
                    print(f"Error details: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"Raw response: {response.text}")
                return None
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None
    finally:
        # Limpiar archivo de prueba
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

def create_test_image(filename):
    """Crear una imagen de prueba simple (10x10 pixel PNG)"""
    try:
        from PIL import Image
        import io
        
        # Crear una imagen de 10x10 píxeles
        img = Image.new('RGB', (10, 10), color='red')
        
        # Guardar como PNG
        img.save(filename, 'PNG')
        print(f"✅ Imagen de prueba creada: {filename}")
        
    except ImportError:
        print("⚠️ PIL no disponible, creando imagen básica...")
        # Datos de una imagen PNG de 10x10 pixel (rojo)
        png_data = b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\n\x00\x00\x00\n\x08\x02\x00\x00\x00\x02P\x88\x8e\x00\x00\x00\tpHYs\x00\x00\x0b\x13\x00\x00\x0b\x13\x01\x00\x9a\x9c\x18\x00\x00\x00\x07tIME\x07\xe5\x08\x0f\x1d\x0b\x1c\xc8\xe5\xb8\x00\x00\x00\x1cIDATx\x9cc```\x00\x00\x00\x04\x00\x01\xf6\x178\xea\x00\x00\x00\x00IEND\xaeB`\x82'
        
        with open(filename, 'wb') as f:
            f.write(png_data)

def test_update_categoria_with_image(access_token, slug):
    """Probar actualización de categoría con imagen"""
    if not slug:
        print("❌ No se puede probar actualización sin slug")
        return
    
    print(f"\n🔄 Probando actualización de categoría '{slug}' con imagen...")
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Crear un archivo de imagen de prueba
    test_image_path = "test_update_image.png"
    create_test_image(test_image_path)
    
    try:
        with open(test_image_path, 'rb') as image_file:
            files = {
                'imagen': ('test_update_image.png', image_file, 'image/png')
            }
            
            data = {
                'nombre': 'Categoría Actualizada Con Imagen',
                'descripcion': 'Descripción actualizada con imagen',
                'activa': 'true'
            }
            
            response = requests.put(f"{CATEGORIAS_URL}{slug}/", data=data, files=files, headers=headers)
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                response_data = response.json()
                print("✅ Categoría actualizada con imagen exitosamente!")
                print(f"Nombre: {response_data.get('nombre')}")
                print(f"Imagen URL: {response_data.get('imagen_url')}")
            else:
                print(f"❌ Error al actualizar categoría con imagen: {response.text}")
                
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
    finally:
        # Limpiar archivo de prueba
        if os.path.exists(test_image_path):
            os.remove(test_image_path)

def main():
    print("🧪 Iniciando pruebas de categorías con imágenes...")
    print("=" * 60)
    
    # Hacer login
    access_token = login_and_get_token()
    if not access_token:
        print("❌ No se pudo obtener token. Verificar que el backend esté corriendo.")
        return
    
    # Probar creación sin imagen
    slug1 = test_categoria_without_image(access_token)
    
    # Probar creación con imagen
    slug2 = test_categoria_with_image(access_token)
    
    # Probar actualización con imagen
    if slug1:
        test_update_categoria_with_image(access_token, slug1)
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas!")

if __name__ == "__main__":
    main()
