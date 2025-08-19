#!/usr/bin/env python3
"""
Script para probar el endpoint de pedidos desde el backend
"""

import os
import sys
import django
import requests
from datetime import datetime

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth.models import User
from pedidos.models import Pedido, Cliente
from ventas.models import Venta

# Configuración
BASE_URL = "http://localhost:8000"
API_BASE = f"{BASE_URL}/api"

def obtener_token_autenticacion():
    """Obtener token de autenticación"""
    print("🔐 Obteniendo token de autenticación...")
    
    # Crear usuario de prueba si no existe
    username = "test_user"
    password = "test_password123"
    
    try:
        user = User.objects.get(username=username)
        print(f"✅ Usuario {username} ya existe")
    except User.DoesNotExist:
        user = User.objects.create_user(username=username, password=password)
        print(f"✅ Usuario {username} creado")
    
    # Obtener token
    login_data = {
        "username": username,
        "password": password
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/login/", json=login_data)
        if response.status_code == 200:
            token = response.json().get('access')
            print("✅ Token obtenido exitosamente")
            return token
        else:
            print(f"❌ Error obteniendo token: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error en login: {e}")
        return None

def probar_endpoint_pedidos(token):
    """Probar el endpoint de pedidos"""
    print("\n📦 Probando endpoint de pedidos...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # 1. Probar GET /pedidos/pedidos/
    print("\n1️⃣ Probando GET /pedidos/pedidos/")
    try:
        response = requests.get(f'{API_BASE}/pedidos/pedidos/', headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Endpoint funcionando")
            print(f"   - Total de pedidos: {len(data.get('results', []))}")
            print(f"   - Estructura: {list(data.keys())}")
            
            # Mostrar algunos pedidos
            pedidos = data.get('results', [])
            if pedidos:
                print(f"\n📋 Primeros {min(3, len(pedidos))} pedidos:")
                for i, pedido in enumerate(pedidos[:3]):
                    print(f"   Pedido {i+1}:")
                    print(f"     - ID: {pedido.get('id')}")
                    print(f"     - Número: {pedido.get('numero_pedido')}")
                    print(f"     - Cliente: {pedido.get('cliente', {}).get('nombre', 'N/A')}")
                    print(f"     - Estado: {pedido.get('estado_pedido')}")
                    print(f"     - Total: ${pedido.get('total_pedido', 0)}")
            else:
                print("   ⚠️ No hay pedidos en la base de datos")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error probando endpoint: {e}")

def probar_estadisticas_pedidos(token):
    """Probar endpoint de estadísticas de pedidos"""
    print("\n📊 Probando estadísticas de pedidos...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(f'{API_BASE}/pedidos/pedidos/estadisticas/', headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Estadísticas obtenidas")
            print(f"   - Total pedidos: {data.get('total_pedidos', 0)}")
            print(f"   - Pendientes: {data.get('pedidos_pendientes', 0)}")
            print(f"   - En proceso: {data.get('pedidos_en_proceso', 0)}")
            print(f"   - Enviados: {data.get('pedidos_enviados', 0)}")
            print(f"   - Entregados: {data.get('pedidos_entregados', 0)}")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"Respuesta: {response.text}")
            
    except Exception as e:
        print(f"❌ Error probando estadísticas: {e}")

def crear_pedido_prueba(token):
    """Crear un pedido de prueba"""
    print("\n➕ Creando pedido de prueba...")
    
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Crear cliente de prueba si no existe
    try:
        cliente = Cliente.objects.get(nombre="Cliente Prueba")
        print("✅ Cliente de prueba ya existe")
    except Cliente.DoesNotExist:
        cliente = Cliente.objects.create(
            nombre="Cliente Prueba",
            email="cliente@prueba.com",
            telefono="123456789"
        )
        print("✅ Cliente de prueba creado")
    
    # Datos del pedido
    pedido_data = {
        "cliente": cliente.id,
        "estado_pedido": "pendiente",
        "estado_pago": "pendiente",
        "total_pedido": 150.00,
        "metodo_pago": "efectivo",
        "direccion_entrega": "Dirección de prueba",
        "notas": "Pedido de prueba creado automáticamente"
    }
    
    try:
        response = requests.post(f'{API_BASE}/pedidos/pedidos/', json=pedido_data, headers=headers)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print("✅ Pedido de prueba creado")
            print(f"   - ID: {data.get('id')}")
            print(f"   - Número: {data.get('numero_pedido')}")
            return data.get('id')
        else:
            print(f"❌ Error creando pedido: {response.status_code}")
            print(f"Respuesta: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error creando pedido: {e}")
        return None

def verificar_pedidos_db():
    """Verificar pedidos en la base de datos"""
    print("\n🔍 Verificando pedidos en la base de datos...")
    
    try:
        total_pedidos = Pedido.objects.count()
        print(f"📊 Total de pedidos en DB: {total_pedidos}")
        
        if total_pedidos > 0:
            print("\n📋 Últimos 3 pedidos:")
            ultimos_pedidos = Pedido.objects.all().order_by('-fecha_creacion')[:3]
            
            for pedido in ultimos_pedidos:
                print(f"   - ID: {pedido.id}")
                print(f"     Número: {pedido.numero_pedido}")
                print(f"     Cliente: {pedido.cliente.nombre}")
                print(f"     Estado: {pedido.estado_pedido}")
                print(f"     Total: ${pedido.total_pedido}")
                print(f"     Fecha: {pedido.fecha_creacion}")
                print()
        else:
            print("⚠️ No hay pedidos en la base de datos")
            
    except Exception as e:
        print(f"❌ Error verificando DB: {e}")

def main():
    """Función principal"""
    print("🚀 INICIO DE PRUEBAS - ENDPOINT DE PEDIDOS")
    print("=" * 50)
    
    # Verificar que el servidor esté corriendo
    try:
        response = requests.get(f"{BASE_URL}/api/")
        if response.status_code != 200:
            print(f"❌ Servidor no responde correctamente: {response.status_code}")
            return
        print("✅ Servidor respondiendo correctamente")
    except Exception as e:
        print(f"❌ No se puede conectar al servidor: {e}")
        print("💡 Asegúrate de que el servidor Django esté corriendo en localhost:8000")
        return
    
    # Obtener token
    token = obtener_token_autenticacion()
    if not token:
        print("❌ No se pudo obtener el token. Abortando pruebas.")
        return
    
    # Verificar pedidos en DB
    verificar_pedidos_db()
    
    # Probar endpoints
    probar_endpoint_pedidos(token)
    probar_estadisticas_pedidos(token)
    
    # Crear pedido de prueba si no hay ninguno
    if Pedido.objects.count() == 0:
        pedido_id = crear_pedido_prueba(token)
        if pedido_id:
            print("\n🔄 Probando endpoint nuevamente después de crear pedido...")
            probar_endpoint_pedidos(token)
    
    print("\n✅ PRUEBAS COMPLETADAS")
    print("=" * 30)
    print("💡 Si todo está funcionando, el dashboard debería mostrar los pedidos correctamente")

if __name__ == "__main__":
    main() 