#!/usr/bin/env python
import os
import django
import requests
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_dashboard_endpoints():
    base_url = "http://localhost:8000"
    print("🧪 Probando endpoints del dashboard...")
    print("=" * 60)

    # 1. Test de conexión básica
    print("\n1. Test de conexión básica...")
    try:
        response = requests.get(f"{base_url}/api/categorias/test_connection/")
        if response.status_code == 200:
            print("✅ Conexión básica funcionando")
        else:
            print(f"❌ Error en conexión básica: {response.status_code}")
    except Exception as e:
        print(f"❌ Error de conexión: {e}")

    # 2. Login para obtener token
    print("\n2. Haciendo login...")
    login_data = {"username": "admin", "password": "admin123"}
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        if response.status_code == 200:
            data = response.json()
            access_token = data['tokens']['access']
            print("✅ Login exitoso!")
        else:
            print(f"❌ Error en login: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return

    # Headers con autenticación
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    # 3. Test categorías
    print("\n3. Test endpoint de categorías...")
    try:
        response = requests.get(f"{base_url}/api/categorias/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('results', data))
            print(f"✅ Categorías funcionando - {count} categorías")
        else:
            print(f"❌ Error en categorías: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error en categorías: {e}")

    # 4. Test productos
    print("\n4. Test endpoint de productos...")
    try:
        response = requests.get(f"{base_url}/api/productos/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            count = len(data.get('results', data))
            print(f"✅ Productos funcionando - {count} productos")
        else:
            print(f"❌ Error en productos: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error en productos: {e}")

    # 5. Test resumen de ventas
    print("\n5. Test endpoint de resumen de ventas...")
    try:
        response = requests.get(f"{base_url}/api/ventas/resumen/", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Resumen de ventas funcionando")
            print(f"   Total ventas: {data.get('resumen', {}).get('total_ventas', 0)}")
            print(f"   Total ingresos: {data.get('resumen', {}).get('total_ingresos', 0)}")
        else:
            print(f"❌ Error en resumen de ventas: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Error en resumen de ventas: {e}")

    # 6. Test sin autenticación (debería fallar)
    print("\n6. Test sin autenticación (debería fallar)...")
    try:
        response = requests.get(f"{base_url}/api/categorias/")
        if response.status_code == 401:
            print("✅ Correctamente rechazó request sin autenticación")
        else:
            print(f"❌ Debería haber rechazado request sin auth: {response.status_code}")
    except Exception as e:
        print(f"❌ Error en test sin auth: {e}")

    print("\n" + "=" * 60)
    print("🎉 Pruebas de endpoints completadas!")

if __name__ == "__main__":
    test_dashboard_endpoints()

