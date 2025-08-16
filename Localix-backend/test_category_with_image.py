#!/usr/bin/env python3
"""
Script para probar la creación de categorías con imágenes
"""
import requests
import os
from PIL import Image

def test_category_with_image():
    """Probar la creación de categorías con imágenes"""
    
    base_url = "http://localhost:8000"
    
    print("=" * 60)
    print("🧪 PRUEBA DE CATEGORÍAS CON IMÁGENES")
    print("=" * 60)
    
    # Paso 1: Login
    print("\n1️⃣ Iniciando sesión...")
    login_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        if login_response.status_code != 200:
            print(f"   ❌ Error en login: {login_response.text}")
            return False
            
        login_result = login_response.json()
        access_token = login_result['tokens']['access']
        print("   ✅ Login exitoso!")
        
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return False
    
    # Paso 2: Crear imagen de prueba
    print("\n2️⃣ Creando imagen de prueba...")
    test_image_path = "test_category_image.png"
    
    try:
        # Crear una imagen simple de prueba
        img = Image.new('RGB', (200, 200), color='blue')
        img.save(test_image_path)
        print(f"   ✅ Imagen creada: {test_image_path}")
        
    except Exception as e:
        print(f"   ❌ Error creando imagen: {e}")
        return False
    
    # Paso 3: Crear categoría sin imagen
    print("\n3️⃣ Creando categoría sin imagen...")
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    category_data = {
        'nombre': 'Categoría de Prueba',
        'descripcion': 'Descripción de prueba para categoría',
        'activa': True,
        'orden': 1
    }
    
    try:
        response = requests.post(f"{base_url}/api/categorias/", json=category_data, headers=headers)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 201:
            category = response.json()
            print("   ✅ Categoría creada exitosamente!")
            print(f"   ID: {category['id']}")
            print(f"   Nombre: {category['nombre']}")
            print(f"   Slug: {category['slug']}")
            category_id = category['id']
            category_slug = category['slug']
        else:
            print(f"   ❌ Error creando categoría: {response.text}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
        return False
    
    # Paso 4: Actualizar categoría con imagen
    print("\n4️⃣ Actualizando categoría con imagen...")
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'imagen': f}
            data = {
                'nombre': 'Categoría con Imagen',
                'descripcion': 'Categoría actualizada con imagen de prueba',
                'activa': True
            }
            
            response = requests.patch(
                f"{base_url}/api/categorias/{category_slug}/",
                files=files,
                data=data,
                headers=headers
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                updated_category = response.json()
                print("   ✅ Categoría actualizada con imagen exitosamente!")
                print(f"   Nombre: {updated_category['nombre']}")
                print(f"   Imagen URL: {updated_category.get('imagen_url', 'No disponible')}")
            else:
                print(f"   ❌ Error actualizando categoría: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Paso 5: Crear categoría directamente con imagen
    print("\n5️⃣ Creando categoría directamente con imagen...")
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'imagen': f}
            data = {
                'nombre': 'Categoría Directa con Imagen',
                'descripcion': 'Categoría creada directamente con imagen',
                'activa': True,
                'orden': 2
            }
            
            response = requests.post(
                f"{base_url}/api/categorias/",
                files=files,
                data=data,
                headers=headers
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 201:
                new_category = response.json()
                print("   ✅ Categoría creada directamente con imagen!")
                print(f"   ID: {new_category['id']}")
                print(f"   Nombre: {new_category['nombre']}")
                print(f"   Imagen URL: {new_category.get('imagen_url', 'No disponible')}")
            else:
                print(f"   ❌ Error creando categoría con imagen: {response.text}")
                
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")
    
    # Limpiar archivo de prueba
    try:
        if os.path.exists(test_image_path):
            os.remove(test_image_path)
            print(f"\n   🧹 Archivo de prueba eliminado: {test_image_path}")
    except:
        pass
    
    print("\n" + "=" * 60)
    print("✅ PRUEBA DE CATEGORÍAS CON IMÁGENES COMPLETADA")
    print("=" * 60)
    
    return True

if __name__ == "__main__":
    test_category_with_image()
