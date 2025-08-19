#!/usr/bin/env python
"""
Script para crear automáticamente planes de uso para usuarios existentes
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

User = get_user_model()

def create_usage_plans():
    """Crear planes de uso para usuarios que no los tengan"""
    users_without_plans = []
    users_with_plans = []
    
    for user in User.objects.all():
        try:
            # Verificar si el usuario ya tiene un plan
            plan = UserUsagePlan.objects.get(user=user)
            users_with_plans.append(user.username)
        except UserUsagePlan.DoesNotExist:
            # Crear plan por defecto
            plan = UserUsagePlan.objects.create(
                user=user,
                plan_type='trial',
                days_allowed=15
            )
            users_without_plans.append(user.username)
            print(f"✅ Plan creado para usuario: {user.username} - {plan.days_allowed} días")
    
    print(f"\n📊 Resumen:")
    print(f"   Usuarios con planes existentes: {len(users_with_plans)}")
    print(f"   Usuarios con nuevos planes: {len(users_without_plans)}")
    
    if users_without_plans:
        print(f"\n👥 Usuarios con nuevos planes:")
        for username in users_without_plans:
            print(f"   - {username}")
    
    if users_with_plans:
        print(f"\n👤 Usuarios con planes existentes:")
        for username in users_with_plans:
            print(f"   - {username}")

def show_usage_plans():
    """Mostrar todos los planes de uso"""
    print("\n📋 Planes de uso actuales:")
    print("-" * 80)
    
    for plan in UserUsagePlan.objects.all().select_related('user'):
        status = "🟢 ACTIVO" if plan.is_active and not plan.is_expired else "🔴 EXPIRADO"
        print(f"Usuario: {plan.user.username}")
        print(f"Plan: {plan.plan_type}")
        print(f"Días permitidos: {plan.days_allowed}")
        print(f"Días restantes: {plan.days_remaining}")
        print(f"Estado: {status}")
        print(f"Expira: {plan.end_date.strftime('%Y-%m-%d %H:%M')}")
        print("-" * 80)

if __name__ == '__main__':
    print("🚀 Script de gestión de planes de uso")
    print("=" * 50)
    
    if len(sys.argv) > 1 and sys.argv[1] == '--show':
        show_usage_plans()
    else:
        create_usage_plans()
        print("\n" + "=" * 50)
        print("✅ Script completado exitosamente!")
        print("\nPara ver los planes actuales, ejecuta:")
        print("python create_usage_plans.py --show")


