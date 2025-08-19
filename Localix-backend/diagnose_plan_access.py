#!/usr/bin/env python
"""
Script para diagnosticar problemas de acceso al plan
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import UserUsagePlan
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

def diagnose_plan_access():
    """Diagnosticar problemas de acceso al plan"""
    print("🔍 Diagnóstico de acceso al plan")
    print("=" * 50)
    
    # Verificar todos los usuarios
    users = User.objects.all()
    print(f"👥 Total de usuarios: {users.count()}")
    
    for user in users:
        print(f"\n--- Usuario: {user.username} ---")
        print(f"   Email: {user.email}")
        print(f"   Es activo: {user.is_active}")
        print(f"   Es activo (es_activo): {user.es_activo}")
        print(f"   Es superusuario: {user.is_superuser}")
        print(f"   Es staff: {user.is_staff}")
        
        try:
            plan = UserUsagePlan.objects.get(user=user)
            print(f"   ✅ Plan encontrado:")
            print(f"      Tipo: {plan.plan_type}")
            print(f"      Días permitidos: {plan.days_allowed}")
            print(f"      Días restantes: {plan.days_remaining}")
            print(f"      Está activo: {plan.is_active}")
            print(f"      Está expirado: {plan.is_expired}")
            print(f"      Fecha de expiración: {plan.end_date}")
            
            # Verificar si debería tener acceso
            should_have_access = True
            reason = []
            
            if not user.is_active:
                should_have_access = False
                reason.append("Usuario inactivo")
            
            if not user.es_activo:
                should_have_access = False
                reason.append("Usuario deshabilitado (es_activo=False)")
            
            if user.is_superuser:
                should_have_access = True
                reason.append("Es superusuario - acceso sin restricciones")
            else:
                if not plan.is_active:
                    should_have_access = False
                    reason.append("Plan inactivo")
                
                if plan.is_expired:
                    should_have_access = False
                    reason.append("Plan expirado")
            
            print(f"   🔍 Análisis de acceso:")
            print(f"      Debería tener acceso: {should_have_access}")
            print(f"      Razón: {', '.join(reason)}")
            
        except UserUsagePlan.DoesNotExist:
            print(f"   ❌ Sin plan de uso")
            if user.is_superuser:
                print(f"   🔍 Análisis: Superusuario sin plan - se creará automáticamente")
            else:
                print(f"   🔍 Análisis: Usuario normal sin plan - se creará automáticamente")

def test_api_endpoint():
    """Probar el endpoint de la API"""
    print("\n🌐 Probando endpoint de la API...")
    print("=" * 50)
    
    # Simular una petición a la API
    from django.test import Client
    from django.contrib.auth import get_user_model
    
    client = Client()
    
    # Crear un usuario de prueba
    test_user, created = User.objects.get_or_create(
        username='test_api_user',
        defaults={
            'email': 'test@api.com',
            'nombre_completo': 'Usuario Test API',
            'password': 'testpass123'
        }
    )
    
    if created:
        test_user.set_password('testpass123')
        test_user.save()
        print(f"✅ Usuario de prueba creado: {test_user.username}")
    
    # Crear plan para el usuario de prueba
    plan, created = UserUsagePlan.objects.get_or_create(
        user=test_user,
        defaults={
            'plan_type': 'trial',
            'days_allowed': 15,
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=15),
            'is_active': True
        }
    )
    
    if created:
        print(f"✅ Plan de prueba creado para: {test_user.username}")
    
    # Intentar hacer login
    login_response = client.post('/api/usuarios/login/', {
        'username': 'test_api_user',
        'password': 'testpass123'
    })
    
    print(f"📡 Respuesta del login: {login_response.status_code}")
    if login_response.status_code == 200:
        print("✅ Login exitoso")
        # Aquí podrías probar el endpoint de status del plan
    else:
        print(f"❌ Error en login: {login_response.content}")

def fix_all_users():
    """Corregir planes de todos los usuarios"""
    print("\n🔧 Corrigiendo planes de todos los usuarios...")
    print("=" * 50)
    
    users = User.objects.all()
    fixed_count = 0
    
    for user in users:
        try:
            plan = UserUsagePlan.objects.get(user=user)
            
            # Si es superusuario, asegurar plan premium
            if user.is_superuser and (plan.plan_type != 'premium' or plan.days_remaining < 1000):
                plan.plan_type = 'premium'
                plan.days_allowed = 3650
                plan.start_date = timezone.now()
                plan.end_date = plan.start_date + timedelta(days=3650)
                plan.is_active = True
                plan.save()
                print(f"✅ Plan corregido para superusuario: {user.username}")
                fixed_count += 1
            
            # Si es usuario normal y el plan está expirado, extenderlo
            elif not user.is_superuser and plan.is_expired:
                plan.end_date = timezone.now() + timedelta(days=30)
                plan.is_active = True
                plan.save()
                print(f"✅ Plan extendido para usuario: {user.username}")
                fixed_count += 1
                
        except UserUsagePlan.DoesNotExist:
            # Crear plan por defecto
            if user.is_superuser:
                plan = UserUsagePlan.objects.create(
                    user=user,
                    plan_type='premium',
                    days_allowed=3650,
                    start_date=timezone.now(),
                    end_date=timezone.now() + timedelta(days=3650),
                    is_active=True
                )
            else:
                plan = UserUsagePlan.objects.create(
                    user=user,
                    plan_type='trial',
                    days_allowed=15,
                    start_date=timezone.now(),
                    end_date=timezone.now() + timedelta(days=15),
                    is_active=True
                )
            print(f"✅ Plan creado para usuario: {user.username}")
            fixed_count += 1
    
    print(f"\n🎉 Total de planes corregidos: {fixed_count}")

if __name__ == "__main__":
    print("🔍 Diagnóstico completo del sistema de planes")
    print("=" * 60)
    
    # Diagnóstico
    diagnose_plan_access()
    
    # Corregir planes
    fix_all_users()
    
    # Diagnóstico después de correcciones
    print("\n" + "=" * 60)
    print("🔍 Diagnóstico después de correcciones")
    print("=" * 60)
    diagnose_plan_access()
    
    print("\n✅ Diagnóstico completado")
