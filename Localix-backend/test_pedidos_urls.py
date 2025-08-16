#!/usr/bin/env python3
"""
Script para probar las URLs de pedidos en el backend
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = 'http://localhost:8000/api'
LOGIN_URL = f'{BASE_URL}/usuarios/login/'

def test_login():
    """Probar login para obtener token"""
    print("🔐 Probando login...")
    
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        response = requests.post(LOGIN_URL, json=login_data)
        if response.status_code == 200:
            data = response.json()
            token = data.get('tokens', {}).get('access')
            if token:
                print("✅ Login exitoso")
                return token
            else:
                print("❌ No se encontró token en la respuesta")
                return None
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return None

def test_pedidos_endpoints(token):
    """Probar endpoints de pedidos"""
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print("\n📦 Probando endpoints de pedidos...")
    
    # 1. Probar listar pedidos
    print("\n1️⃣ Probando GET /pedidos/pedidos/")
    try:
        response = requests.get(f'{BASE_URL}/pedidos/pedidos/', headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Lista de pedidos obtenida")
            print(f"   Total: {data.get('count', 0)}")
            print(f"   Resultados: {len(data.get('results', []))}")
            
            # Guardar el primer pedido para tests posteriores
            if data.get('results') and len(data['results']) > 0:
                first_pedido = data['results'][0]
                pedido_id = first_pedido['id']
                print(f"   Primer pedido ID: {pedido_id}")
                return pedido_id
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    return None

def test_pedido_detail(token, pedido_id):
    """Probar detalle de pedido específico"""
    if not pedido_id:
        print("⚠️ No hay pedido ID para probar detalle")
        return
    
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print(f"\n2️⃣ Probando GET /pedidos/pedidos/{pedido_id}/")
    try:
        response = requests.get(f'{BASE_URL}/pedidos/pedidos/{pedido_id}/', headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Detalle de pedido obtenido")
            print(f"   ID: {data.get('id')}")
            print(f"   Número: {data.get('numero_pedido')}")
            print(f"   Cliente: {data.get('cliente', {}).get('nombre', 'N/A')}")
            print(f"   Estado: {data.get('estado_pedido')}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_pedido_historial(token, pedido_id):
    """Probar historial de pedido"""
    if not pedido_id:
        print("⚠️ No hay pedido ID para probar historial")
        return
    
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print(f"\n3️⃣ Probando GET /pedidos/pedidos/{pedido_id}/historial/")
    try:
        response = requests.get(f'{BASE_URL}/pedidos/pedidos/{pedido_id}/historial/', headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Historial de pedido obtenido")
            print(f"   Entradas: {len(data)}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_pedido_estadisticas(token):
    """Probar estadísticas de pedidos"""
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print("\n4️⃣ Probando GET /pedidos/pedidos/estadisticas/")
    try:
        response = requests.get(f'{BASE_URL}/pedidos/pedidos/estadisticas/', headers=headers)
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Estadísticas obtenidas")
            print(f"   Total pedidos: {data.get('total_pedidos', 0)}")
            print(f"   Pendientes: {data.get('pedidos_pendientes', 0)}")
            print(f"   En proceso: {data.get('pedidos_en_proceso', 0)}")
            print(f"   Enviados: {data.get('pedidos_enviados', 0)}")
            print(f"   Entregados: {data.get('pedidos_entregados', 0)}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_pedido_update(token, pedido_id):
    """Probar actualización de pedido"""
    if not pedido_id:
        print("⚠️ No hay pedido ID para probar actualización")
        return
    
    headers = {'Authorization': f'Bearer {token}'} if token else {}
    
    print(f"\n5️⃣ Probando PATCH /pedidos/pedidos/{pedido_id}/")
    try:
        update_data = {
            'estado_pedido': 'en_preparacion'
        }
        
        response = requests.patch(
            f'{BASE_URL}/pedidos/pedidos/{pedido_id}/', 
            json=update_data,
            headers=headers
        )
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Pedido actualizado")
            print(f"   Nuevo estado: {data.get('estado_pedido')}")
        else:
            print(f"❌ Error: {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Función principal"""
    print("🚀 Iniciando tests de URLs de pedidos...")
    print("=" * 50)
    
    # 1. Login
    token = test_login()
    
    # 2. Probar endpoints
    pedido_id = test_pedidos_endpoints(token)
    
    # 3. Probar detalle
    test_pedido_detail(token, pedido_id)
    
    # 4. Probar historial
    test_pedido_historial(token, pedido_id)
    
    # 5. Probar estadísticas
    test_pedido_estadisticas(token)
    
    # 6. Probar actualización
    test_pedido_update(token, pedido_id)
    
    print("\n" + "=" * 50)
    print("✅ Tests completados")

if __name__ == '__main__':
    main()
