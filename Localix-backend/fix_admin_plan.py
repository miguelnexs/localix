#!/usr/bin/env python
"""
Script para verificar y corregir el plan del usuario admin
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

def fix_admin_plan():
    """Verificar y corregir el plan del usuario admin"""
    print("🔧 Verificando plan del usuario admin...")
    print("=" * 50)
    
    try:
        # Buscar usuario admin
        admin_user = User.objects.get(username='admin')
        print(f"✅ Usuario admin encontrado: {admin_user.username}")
        print(f"   Es superusuario: {admin_user.is_superuser}")
        print(f"   Es staff: {admin_user.is_staff}")
        print(f"   Es activo: {admin_user.is_active}")
        print(f"   Es activo (es_activo): {admin_user.es_activo}")
        
        # Verificar si tiene plan
        try:
            admin_plan = UserUsagePlan.objects.get(user=admin_user)
            print(f"✅ Plan existente encontrado:")
            print(f"   Tipo: {admin_plan.plan_type}")
            print(f"   Días permitidos: {admin_plan.days_allowed}")
            print(f"   Días restantes: {admin_plan.days_remaining}")
            print(f"   Está activo: {admin_plan.is_active}")
            print(f"   Está expirado: {admin_plan.is_expired}")
            print(f"   Fecha de expiración: {admin_plan.end_date}")
            
            # Si el plan está expirado o no es premium, corregirlo
            if admin_plan.is_expired or admin_plan.plan_type != 'premium' or admin_plan.days_remaining < 1000:
                print("\n🔄 Corrigiendo plan del admin...")
                admin_plan.plan_type = 'premium'
                admin_plan.days_allowed = 3650  # 10 años
                admin_plan.start_date = timezone.now()
                admin_plan.end_date = admin_plan.start_date + timedelta(days=3650)
                admin_plan.is_active = True
                admin_plan.save()
                
                print("✅ Plan del admin corregido:")
                print(f"   Nuevo tipo: {admin_plan.plan_type}")
                print(f"   Nuevos días permitidos: {admin_plan.days_allowed}")
                print(f"   Nuevos días restantes: {admin_plan.days_remaining}")
                print(f"   Nueva fecha de expiración: {admin_plan.end_date}")
            else:
                print("✅ Plan del admin está correcto")
                
        except UserUsagePlan.DoesNotExist:
            print("❌ No se encontró plan para el admin")
            print("🔄 Creando plan premium para el admin...")
            
            admin_plan = UserUsagePlan.objects.create(
                user=admin_user,
                plan_type='premium',
                days_allowed=3650,  # 10 años
                start_date=timezone.now(),
                end_date=timezone.now() + timedelta(days=3650),
                is_active=True
            )
            
            print("✅ Plan premium creado para el admin:")
            print(f"   Tipo: {admin_plan.plan_type}")
            print(f"   Días permitidos: {admin_plan.days_allowed}")
            print(f"   Días restantes: {admin_plan.days_remaining}")
            print(f"   Fecha de expiración: {admin_plan.end_date}")
            
    except User.DoesNotExist:
        print("❌ No se encontró usuario admin")
        print("💡 Ejecuta primero el script crear_admin.py")
        return False
    
    print("\n🎉 Verificación completada!")
    return True

def show_all_admin_users():
    """Mostrar todos los usuarios admin"""
    print("\n👥 Usuarios admin en el sistema:")
    print("=" * 40)
    
    admin_users = User.objects.filter(is_superuser=True)
    
    if admin_users.exists():
        for user in admin_users:
            print(f"   - {user.username} (email: {user.email})")
            try:
                plan = UserUsagePlan.objects.get(user=user)
                print(f"     Plan: {plan.plan_type} - {plan.days_remaining} días restantes")
            except UserUsagePlan.DoesNotExist:
                print(f"     ❌ Sin plan")
    else:
        print("   No hay usuarios admin en el sistema")

if __name__ == "__main__":
    print("🔧 Script de corrección de plan de admin")
    print("=" * 50)
    
    # Mostrar usuarios admin
    show_all_admin_users()
    
    # Corregir plan del admin
    success = fix_admin_plan()
    
    if success:
        print("\n✅ El admin debería poder acceder al dashboard sin problemas")
    else:
        print("\n❌ No se pudo corregir el plan del admin")
