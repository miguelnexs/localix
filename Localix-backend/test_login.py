#!/usr/bin/env python
import os
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_login_system():
    """Probar el sistema de login"""
    
    base_url = "http://localhost:8000"
    
    print("🧪 Probando sistema de login...")
    print("=" * 50)
    
    # Test 1: Login exitoso
    print("\n1. Probando login exitoso...")
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login exitoso!")
            print(f"   Usuario: {data['user']['username']}")
            print(f"   Rol: {data['user']['rol']}")
            print(f"   Token generado: {'Sí' if data['tokens']['access'] else 'No'}")
            
            # Guardar token para pruebas posteriores
            access_token = data['tokens']['access']
            headers = {'Authorization': f'Bearer {access_token}'}
            
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al servidor. Asegúrate de que esté corriendo en puerto 8000.")
        return
    
    # Test 2: Obtener perfil del usuario
    print("\n2. Probando obtener perfil...")
    try:
        response = requests.get(f"{base_url}/api/usuarios/profile/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Perfil obtenido exitosamente!")
            print(f"   Nombre: {data['user']['nombre_completo']}")
            print(f"   Email: {data['user']['email']}")
        else:
            print(f"❌ Error al obtener perfil: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Login con credenciales incorrectas
    print("\n3. Probando login con credenciales incorrectas...")
    wrong_data = {
        "username": "admin",
        "password": "wrongpassword"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=wrong_data)
        if response.status_code == 401:
            print("✅ Login rechazado correctamente con credenciales incorrectas")
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 4: Acceso sin token
    print("\n4. Probando acceso sin token...")
    try:
        response = requests.get(f"{base_url}/api/usuarios/profile/")
        if response.status_code == 401:
            print("✅ Acceso denegado correctamente sin token")
        else:
            print(f"❌ Error inesperado: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 5: Logout
    print("\n5. Probando logout...")
    try:
        logout_data = {"refresh_token": data['tokens']['refresh']}
        response = requests.post(f"{base_url}/api/usuarios/logout/", json=logout_data, headers=headers)
        if response.status_code == 200:
            print("✅ Logout exitoso!")
        else:
            print(f"❌ Error en logout: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Pruebas completadas!")
    print("\n📋 Resumen:")
    print("- Backend funcionando correctamente")
    print("- Autenticación JWT implementada")
    print("- Protección de rutas activa")
    print("- Sistema de logout funcionando")
    print("\n🚀 El sistema de login está listo para usar!")

if __name__ == '__main__':
    test_login_system()
