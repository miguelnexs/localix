#!/usr/bin/env python
"""
Script para probar diferentes escenarios de planes de uso
"""
import os
import sys
import django
from datetime import timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import UserUsagePlan
from django.utils import timezone

User = get_user_model()

def create_test_scenarios():
    """Crear diferentes escenarios de prueba para planes de uso"""
    print("🧪 Creando escenarios de prueba para planes de uso...")
    print("=" * 60)
    
    # Escenario 1: Usuario con plan de prueba activo
    user1, created = User.objects.get_or_create(
        username='test_trial',
        defaults={
            'email': 'trial@test.com',
            'nombre_completo': 'Usuario Prueba Trial',
            'password': 'testpass123'
        }
    )
    if created:
        user1.set_password('testpass123')
        user1.save()
    
    plan1, created = UserUsagePlan.objects.get_or_create(
        user=user1,
        defaults={
            'plan_type': 'trial',
            'days_allowed': 15,
            'start_date': timezone.now(),
            'end_date': timezone.now() + timedelta(days=15)
        }
    )
    print(f"✅ Usuario Trial: {user1.username} - {plan1.days_remaining} días restantes")
    
    # Escenario 2: Usuario con plan básico próximo a expirar
    user2, created = User.objects.get_or_create(
        username='test_basic',
        defaults={
            'email': 'basic@test.com',
            'nombre_completo': 'Usuario Prueba Básico',
            'password': 'testpass123'
        }
    )
    if created:
        user2.set_password('testpass123')
        user2.save()
    
    plan2, created = UserUsagePlan.objects.get_or_create(
        user=user2,
        defaults={
            'plan_type': 'basic',
            'days_allowed': 30,
            'start_date': timezone.now() - timedelta(days=27),
            'end_date': timezone.now() + timedelta(days=3)
        }
    )
    print(f"⚠️ Usuario Básico: {user2.username} - {plan2.days_remaining} días restantes")
    
    # Escenario 3: Usuario con plan premium expirado
    user3, created = User.objects.get_or_create(
        username='test_premium',
        defaults={
            'email': 'premium@test.com',
            'nombre_completo': 'Usuario Prueba Premium',
            'password': 'testpass123'
        }
    )
    if created:
        user3.set_password('testpass123')
        user3.save()
    
    plan3, created = UserUsagePlan.objects.get_or_create(
        user=user3,
        defaults={
            'plan_type': 'premium',
            'days_allowed': 90,
            'start_date': timezone.now() - timedelta(days=95),
            'end_date': timezone.now() - timedelta(days=5)
        }
    )
    print(f"❌ Usuario Premium: {user3.username} - EXPIRADO")
    
    # Escenario 4: Usuario con plan desactivado
    user4, created = User.objects.get_or_create(
        username='test_inactive',
        defaults={
            'email': 'inactive@test.com',
            'nombre_completo': 'Usuario Prueba Inactivo',
            'password': 'testpass123'
        }
    )
    if created:
        user4.set_password('testpass123')
        user4.save()
    
    plan4, created = UserUsagePlan.objects.get_or_create(
        user=user4,
        defaults={
            'plan_type': 'basic',
            'days_allowed': 30,
            'start_date': timezone.now() - timedelta(days=10),
            'end_date': timezone.now() + timedelta(days=20),
            'is_active': False
        }
    )
    print(f"🚫 Usuario Inactivo: {user4.username} - PLAN DESACTIVADO")
    
    print("\n" + "=" * 60)
    print("📋 Resumen de escenarios creados:")
    print("1. test_trial - Plan de prueba activo (15 días)")
    print("2. test_basic - Plan básico próximo a expirar (3 días)")
    print("3. test_premium - Plan premium expirado")
    print("4. test_inactive - Plan básico desactivado")
    print("\n🔑 Contraseña para todos: testpass123")
    print("\n🧪 Para probar:")
    print("- Inicia sesión con cada usuario")
    print("- Verifica los mensajes que aparecen")
    print("- Prueba la página de expiración")

def reset_test_scenarios():
    """Resetear escenarios de prueba"""
    print("🔄 Reseteando escenarios de prueba...")
    
    test_users = ['test_trial', 'test_basic', 'test_premium', 'test_inactive']
    
    for username in test_users:
        try:
            user = User.objects.get(username=username)
            UserUsagePlan.objects.filter(user=user).delete()
            user.delete()
            print(f"✅ Eliminado: {username}")
        except User.DoesNotExist:
            print(f"ℹ️ No existe: {username}")
    
    print("✅ Escenarios reseteados")

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--reset':
        reset_test_scenarios()
    else:
        create_test_scenarios()


