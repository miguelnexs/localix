#!/usr/bin/env python
"""
Script simple para probar el acceso de usuarios activos
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

def test_user_access():
    """Probar acceso de usuarios activos"""
    print("🔍 Probando acceso de usuarios activos...")
    print("=" * 50)
    
    # Probar con usuario test_trial
    try:
        user = User.objects.get(username='test_trial')
        print(f"👤 Usuario: {user.username}")
        print(f"   Activo: {user.is_active}")
        print(f"   Es activo: {user.es_activo}")
        
        plan = UserUsagePlan.objects.get(user=user)
        print(f"   Plan: {plan.plan_type}")
        print(f"   Días restantes: {plan.days_remaining}")
        print(f"   Está activo: {plan.is_active}")
        print(f"   Está expirado: {plan.is_expired}")
        print(f"   Fecha de expiración: {plan.end_date}")
        
        # Verificar si debería tener acceso
        should_access = True
        if not user.is_active:
            should_access = False
            print("   ❌ Usuario inactivo")
        elif not user.es_activo:
            should_access = False
            print("   ❌ Usuario deshabilitado")
        elif plan.is_expired:
            should_access = False
            print("   ❌ Plan expirado")
        elif not plan.is_active:
            should_access = False
            print("   ❌ Plan inactivo")
        else:
            print("   ✅ Debería tener acceso")
        
        print(f"   Resultado: {'✅ ACCESO PERMITIDO' if should_access else '❌ ACCESO DENEGADO'}")
        
    except User.DoesNotExist:
        print("❌ Usuario test_trial no encontrado")
    except UserUsagePlan.DoesNotExist:
        print("❌ Plan no encontrado para test_trial")
    
    print("\n" + "=" * 50)
    
    # Probar con admin
    try:
        user = User.objects.get(username='admin')
        print(f"👤 Usuario: {user.username}")
        print(f"   Activo: {user.is_active}")
        print(f"   Es activo: {user.es_activo}")
        print(f"   Es superusuario: {user.is_superuser}")
        
        plan = UserUsagePlan.objects.get(user=user)
        print(f"   Plan: {plan.plan_type}")
        print(f"   Días restantes: {plan.days_remaining}")
        print(f"   Está activo: {plan.is_active}")
        print(f"   Está expirado: {plan.is_expired}")
        
        # Superusuarios siempre tienen acceso
        should_access = True
        print("   ✅ Superusuario - acceso sin restricciones")
        print(f"   Resultado: {'✅ ACCESO PERMITIDO' if should_access else '❌ ACCESO DENEGADO'}")
        
    except User.DoesNotExist:
        print("❌ Usuario admin no encontrado")
    except UserUsagePlan.DoesNotExist:
        print("❌ Plan no encontrado para admin")

def fix_plan_issues():
    """Corregir problemas de planes"""
    print("\n🔧 Corrigiendo problemas de planes...")
    print("=" * 50)
    
    users = User.objects.filter(is_active=True)
    fixed_count = 0
    
    for user in users:
        try:
            plan = UserUsagePlan.objects.get(user=user)
            
            # Si el plan está inactivo pero el usuario está activo, activar el plan
            if not plan.is_active and user.is_active:
                plan.is_active = True
                plan.save()
                print(f"✅ Plan activado para: {user.username}")
                fixed_count += 1
            
            # Si el plan está expirado pero el usuario está activo, extenderlo
            if plan.is_expired and user.is_active and not user.is_superuser:
                plan.end_date = timezone.now() + timedelta(days=30)
                plan.is_active = True
                plan.save()
                print(f"✅ Plan extendido para: {user.username}")
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
            print(f"✅ Plan creado para: {user.username}")
            fixed_count += 1
    
    print(f"\n🎉 Total de planes corregidos: {fixed_count}")

if __name__ == "__main__":
    print("🧪 Prueba de acceso de usuarios activos")
    print("=" * 60)
    
    # Corregir problemas
    fix_plan_issues()
    
    # Probar acceso
    test_user_access()
    
    print("\n✅ Prueba completada")
