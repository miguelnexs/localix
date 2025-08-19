#!/usr/bin/env python
"""
Script para probar que la API esté funcionando en el puerto 8000
"""
import requests
import json

def test_port_8000():
    """Probar que la API esté funcionando en el puerto 8000"""
    print("🌐 Probando API en puerto 8000...")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # 1. Probar que el servidor esté corriendo
    print("1. Probando que el servidor esté corriendo...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            print("   ✅ Servidor corriendo en puerto 8000")
        else:
            print(f"   ⚠️ Servidor responde con status: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar al puerto 8000")
        print("   💡 Asegúrate de que el servidor esté corriendo con: python manage.py runserver 8000")
        return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    # 2. Probar login
    print("\n2. Probando login...")
    login_data = {
        'username': 'test_trial',
        'password': 'testpass123'
    }
    
    try:
        login_response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data, timeout=10)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_result = login_response.json()
            print("   ✅ Login exitoso")
            print(f"   Token: {login_result['tokens']['access'][:50]}...")
            
            # 3. Probar API del plan
            print("\n3. Probando API del plan...")
            headers = {
                'Authorization': f"Bearer {login_result['tokens']['access']}",
                'Content-Type': 'application/json'
            }
            
            plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers, timeout=10)
            print(f"   Status: {plan_response.status_code}")
            
            if plan_response.status_code == 200:
                plan_data = plan_response.json()
                print("   ✅ API del plan exitosa")
                print(f"   Datos: {json.dumps(plan_data, indent=2)}")
            else:
                print(f"   ❌ Error en API del plan: {plan_response.text}")
        else:
            print(f"   ❌ Error en login: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar a la API")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    # 4. Probar con admin
    print("\n4. Probando con admin...")
    admin_login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        admin_login_response = requests.post(f"{base_url}/api/usuarios/login/", json=admin_login_data, timeout=10)
        print(f"   Status: {admin_login_response.status_code}")
        
        if admin_login_response.status_code == 200:
            admin_login_result = admin_login_response.json()
            print("   ✅ Login admin exitoso")
            
            admin_headers = {
                'Authorization': f"Bearer {admin_login_result['tokens']['access']}",
                'Content-Type': 'application/json'
            }
            
            admin_plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=admin_headers, timeout=10)
            print(f"   Status: {admin_plan_response.status_code}")
            
            if admin_plan_response.status_code == 200:
                admin_plan_data = admin_plan_response.json()
                print("   ✅ API del plan admin exitosa")
                print(f"   Datos: {json.dumps(admin_plan_data, indent=2)}")
            else:
                print(f"   ❌ Error en API del plan admin: {admin_plan_response.text}")
        else:
            print(f"   ❌ Error en login admin: {admin_login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar a la API")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == "__main__":
    print("🧪 Prueba de API en puerto 8000")
    print("=" * 60)
    
    test_port_8000()
    
    print("\n✅ Prueba completada")
