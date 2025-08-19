#!/usr/bin/env python
"""
Script para probar específicamente el problema del token
"""
import os
import sys
import django
import requests
import json

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

def test_token_flow():
    """Probar el flujo completo del token"""
    print("🧪 Probando flujo completo del token")
    print("=" * 60)
    
    base_url = "http://localhost:8000"
    
    # 1. Login con usuario valencia
    print("\n1. 🔐 Login con usuario 'valencia'...")
    login_data = {
        "username": "valencia",
        "password": "valencia123"
    }
    
    try:
        response = requests.post(f"{base_url}/api/usuarios/login/", json=login_data)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Login exitoso")
            print(f"   👤 Usuario: {result['user']['username']}")
            print(f"   🔧 Es superusuario: {result['user']['is_superuser']}")
            print(f"   🔑 Access Token: {result['tokens']['access'][:50]}...")
            print(f"   🔄 Refresh Token: {result['tokens']['refresh'][:50]}...")
            
            token = result['tokens']['access']
            user = result['user']
            
            # 2. Verificar que el token funciona
            print("\n2. 🔍 Verificando que el token funciona...")
            headers = {
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            }
            
            # Probar endpoint de perfil
            profile_response = requests.get(f"{base_url}/api/usuarios/profile/", headers=headers)
            print(f"   Profile Status: {profile_response.status_code}")
            
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                print("   ✅ Token válido - perfil obtenido")
                print(f"   👤 Usuario del perfil: {profile_data['user']['username']}")
            else:
                print(f"   ❌ Token inválido: {profile_response.text}")
                return
            
            # 3. Probar API del plan
            print("\n3. 📊 Probando API del plan...")
            plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers)
            print(f"   Plan Status: {plan_response.status_code}")
            
            if plan_response.status_code == 200:
                plan_data = plan_response.json()
                print("   ✅ API del plan exitosa")
                print(f"   📊 Datos del plan:")
                print(f"      - Plan type: {plan_data['plan_type']}")
                print(f"      - Days remaining: {plan_data['days_remaining']}")
                print(f"      - Is expired: {plan_data['is_expired']}")
                print(f"      - Is active: {plan_data['is_active']}")
                print(f"      - End date: {plan_data['end_date']}")
                
                # Análisis como lo hace el frontend
                is_expired = plan_data['is_expired'] == True
                is_active = not is_expired
                
                print(f"   🔍 Análisis del frontend:")
                print(f"      - isExpired (calculado): {is_expired}")
                print(f"      - isActive (calculado): {is_active}")
                
                if is_active and not is_expired:
                    print("   ✅ Usuario debería tener acceso al dashboard")
                else:
                    print("   ❌ Usuario NO debería tener acceso al dashboard")
                    
            else:
                print(f"   ❌ Error en API del plan: {plan_response.text}")
                
        else:
            print(f"   ❌ Error en login: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error de conexión: {e}")

def test_different_users():
    """Probar con diferentes usuarios"""
    print("\n🧪 Probando con diferentes usuarios")
    print("=" * 60)
    
    users_to_test = [
        {"username": "valencia", "password": "valencia123"},
        {"username": "test_trial", "password": "testpass123"},
        {"username": "admin", "password": "admin123"}
    ]
    
    base_url = "http://localhost:8000"
    
    for user_data in users_to_test:
        print(f"\n👤 Probando usuario: {user_data['username']}")
        
        try:
            response = requests.post(f"{base_url}/api/usuarios/login/", json=user_data)
            
            if response.status_code == 200:
                result = response.json()
                token = result['tokens']['access']
                
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                }
                
                plan_response = requests.get(f"{base_url}/api/usuarios/usage/status/", headers=headers)
                
                if plan_response.status_code == 200:
                    plan_data = plan_response.json()
                    is_expired = plan_data['is_expired'] == True
                    is_active = not is_expired
                    
                    print(f"   ✅ Login exitoso")
                    print(f"   📊 Plan: {plan_data['plan_type']}, {plan_data['days_remaining']} días")
                    print(f"   🔍 Estado: isActive={is_active}, isExpired={is_expired}")
                    
                    if is_active and not is_expired:
                        print("   ✅ Debería tener acceso")
                    else:
                        print("   ❌ NO debería tener acceso")
                else:
                    print(f"   ❌ Error en API del plan: {plan_response.status_code}")
            else:
                print(f"   ❌ Error en login: {response.status_code}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")

def check_user_in_database():
    """Verificar usuarios en la base de datos"""
    print("\n🔍 Verificando usuarios en la base de datos")
    print("=" * 60)
    
    from django.contrib.auth import get_user_model
    from usuarios.models import UserUsagePlan
    
    User = get_user_model()
    
    # Buscar usuario valencia
    try:
        valencia_user = User.objects.get(username='valencia')
        print(f"✅ Usuario 'valencia' encontrado:")
        print(f"   - Username: {valencia_user.username}")
        print(f"   - Email: {valencia_user.email}")
        print(f"   - Is active: {valencia_user.is_active}")
        print(f"   - Is superuser: {valencia_user.is_superuser}")
        
        # Verificar si tiene plan
        try:
            plan = UserUsagePlan.objects.get(user=valencia_user)
            print(f"   - Plan encontrado:")
            print(f"     * Tipo: {plan.plan_type}")
            print(f"     * Días permitidos: {plan.days_allowed}")
            print(f"     * Días restantes: {plan.days_remaining}")
            print(f"     * Está activo: {plan.is_active}")
            print(f"     * Está expirado: {plan.is_expired}")
            print(f"     * Fecha de expiración: {plan.end_date}")
        except UserUsagePlan.DoesNotExist:
            print(f"   ❌ No tiene plan asignado")
            
    except User.DoesNotExist:
        print(f"❌ Usuario 'valencia' no encontrado")

if __name__ == "__main__":
    print("🧪 Prueba de Token y Usuario Valencia")
    print("=" * 60)
    
    # Verificar usuario en la base de datos
    check_user_in_database()
    
    # Probar flujo completo del token
    test_token_flow()
    
    # Probar con diferentes usuarios
    test_different_users()
    
    print("\n✅ Prueba completada")
