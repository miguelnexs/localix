#!/usr/bin/env python
"""
Script para probar la API del plan
"""
import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import UserUsagePlan
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

def test_api_plan():
    """Probar la API del plan"""
    print("🌐 Probando API del plan...")
    print("=" * 50)
    
    base_url = "http://localhost:8000"
    
    # 1. Probar login
    print("1. Probando login...")
    login_data = {
        'username': 'test_trial',
        'password': 'testpass123'
    }
    
    login_response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
    print(f"   Status: {login_response.status_code}")
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        print("   ✅ Login exitoso")
        print(f"   Token: {login_result['tokens']['access'][:50]}...")
        
        # 2. Probar API del plan
        print("\n2. Probando API del plan...")
        headers = {
            'Authorization': f"Bearer {login_result['tokens']['access']}",
            'Content-Type': 'application/json'
        }
        
        plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers)
        print(f"   Status: {plan_response.status_code}")
        
        if plan_response.status_code == 200:
            plan_data = plan_response.json()
            print("   ✅ API del plan exitosa")
            print(f"   Datos: {json.dumps(plan_data, indent=2)}")
        else:
            print(f"   ❌ Error en API del plan: {plan_response.text}")
    else:
        print(f"   ❌ Error en login: {login_response.text}")
    
    # 3. Probar con admin
    print("\n3. Probando con admin...")
    admin_login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    admin_login_response = requests.post(f"{base_url}/api/usuarios/login/", json=admin_login_data)
    print(f"   Status: {admin_login_response.status_code}")
    
    if admin_login_response.status_code == 200:
        admin_login_result = admin_login_response.json()
        print("   ✅ Login admin exitoso")
        
        admin_headers = {
            'Authorization': f"Bearer {admin_login_result['tokens']['access']}",
            'Content-Type': 'application/json'
        }
        
        admin_plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=admin_headers)
        print(f"   Status: {admin_plan_response.status_code}")
        
        if admin_plan_response.status_code == 200:
            admin_plan_data = admin_plan_response.json()
            print("   ✅ API del plan admin exitosa")
            print(f"   Datos: {json.dumps(admin_plan_data, indent=2)}")
        else:
            print(f"   ❌ Error en API del plan admin: {admin_plan_response.text}")
    else:
        print(f"   ❌ Error en login admin: {admin_login_response.text}")

def test_direct_database():
    """Probar acceso directo a la base de datos"""
    print("\n🗄️ Probando acceso directo a la base de datos...")
    print("=" * 50)
    
    users = User.objects.all()
    print(f"Total de usuarios: {users.count()}")
    
    for user in users:
        print(f"\n--- Usuario: {user.username} ---")
        try:
            plan = UserUsagePlan.objects.get(user=user)
            print(f"   Plan: {plan.plan_type}")
            print(f"   Días restantes: {plan.days_remaining}")
            print(f"   Está activo: {plan.is_active}")
            print(f"   Está expirado: {plan.is_expired}")
        except UserUsagePlan.DoesNotExist:
            print(f"   ❌ Sin plan")

if __name__ == "__main__":
    print("🧪 Pruebas de la API del plan")
    print("=" * 60)
    
    # Probar acceso directo a la base de datos
    test_direct_database()
    
    # Probar API
    test_api_plan()
    
    print("\n✅ Pruebas completadas")
