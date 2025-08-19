#!/usr/bin/env python
"""
Script para probar que el modelo UserUsagePlan funcione correctamente
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

def test_model_properties():
    """Probar las propiedades del modelo UserUsagePlan"""
    print("🧪 Probando propiedades del modelo UserUsagePlan...")
    print("=" * 60)
    
    # Crear un usuario de prueba
    test_user, created = User.objects.get_or_create(
        username='test_model_user',
        defaults={
            'email': 'test@model.com',
            'nombre_completo': 'Usuario Test Modelo',
            'password': 'testpass123'
        }
    )
    
    if created:
        test_user.set_password('testpass123')
        test_user.save()
        print(f"✅ Usuario de prueba creado: {test_user.username}")
    
    # 1. Probar creación de plan sin end_date
    print("\n1. Probando creación de plan sin end_date...")
    try:
        plan = UserUsagePlan.objects.create(
            user=test_user,
            plan_type='trial',
            days_allowed=15,
            is_active=True
        )
        print(f"✅ Plan creado sin end_date: {plan}")
        print(f"   - end_date: {plan.end_date}")
        print(f"   - is_expired: {plan.is_expired}")
        print(f"   - days_remaining: {plan.days_remaining}")
        print(f"   - usage_percentage: {plan.usage_percentage}")
        
        # Limpiar
        plan.delete()
        
    except Exception as e:
        print(f"❌ Error creando plan sin end_date: {e}")
    
    # 2. Probar creación de plan con end_date
    print("\n2. Probando creación de plan con end_date...")
    try:
        end_date = timezone.now() + timedelta(days=30)
        plan = UserUsagePlan.objects.create(
            user=test_user,
            plan_type='basic',
            days_allowed=30,
            end_date=end_date,
            is_active=True
        )
        print(f"✅ Plan creado con end_date: {plan}")
        print(f"   - end_date: {plan.end_date}")
        print(f"   - is_expired: {plan.is_expired}")
        print(f"   - days_remaining: {plan.days_remaining}")
        print(f"   - usage_percentage: {plan.usage_percentage}")
        
        # Limpiar
        plan.delete()
        
    except Exception as e:
        print(f"❌ Error creando plan con end_date: {e}")
    
    # 3. Probar plan expirado
    print("\n3. Probando plan expirado...")
    try:
        end_date = timezone.now() - timedelta(days=1)  # Expiró hace 1 día
        plan = UserUsagePlan.objects.create(
            user=test_user,
            plan_type='trial',
            days_allowed=15,
            end_date=end_date,
            is_active=True
        )
        print(f"✅ Plan expirado creado: {plan}")
        print(f"   - end_date: {plan.end_date}")
        print(f"   - is_expired: {plan.is_expired}")
        print(f"   - days_remaining: {plan.days_remaining}")
        print(f"   - usage_percentage: {plan.usage_percentage}")
        
        # Limpiar
        plan.delete()
        
    except Exception as e:
        print(f"❌ Error creando plan expirado: {e}")
    
    # 4. Probar método save() automático
    print("\n4. Probando método save() automático...")
    try:
        plan = UserUsagePlan(
            user=test_user,
            plan_type='premium',
            days_allowed=90,
            is_active=True
        )
        plan.save()  # Esto debería calcular automáticamente end_date
        print(f"✅ Plan guardado con save() automático: {plan}")
        print(f"   - start_date: {plan.start_date}")
        print(f"   - end_date: {plan.end_date}")
        print(f"   - is_expired: {plan.is_expired}")
        print(f"   - days_remaining: {plan.days_remaining}")
        print(f"   - usage_percentage: {plan.usage_percentage}")
        
        # Limpiar
        plan.delete()
        
    except Exception as e:
        print(f"❌ Error con save() automático: {e}")
    
    # Limpiar usuario de prueba
    test_user.delete()
    print(f"\n✅ Usuario de prueba eliminado")

def test_existing_plans():
    """Probar planes existentes"""
    print("\n🔍 Probando planes existentes...")
    print("=" * 60)
    
    plans = UserUsagePlan.objects.all()
    print(f"Total de planes: {plans.count()}")
    
    for plan in plans:
        print(f"\n--- Plan: {plan.user.username} ---")
        try:
            print(f"   - Tipo: {plan.plan_type}")
            print(f"   - Días permitidos: {plan.days_allowed}")
            print(f"   - Start date: {plan.start_date}")
            print(f"   - End date: {plan.end_date}")
            print(f"   - Is active: {plan.is_active}")
            print(f"   - Is expired: {plan.is_expired}")
            print(f"   - Days remaining: {plan.days_remaining}")
            print(f"   - Usage percentage: {plan.usage_percentage}")
        except Exception as e:
            print(f"   ❌ Error con plan: {e}")

if __name__ == "__main__":
    print("🧪 Prueba del modelo UserUsagePlan")
    print("=" * 60)
    
    # Probar propiedades del modelo
    test_model_properties()
    
    # Probar planes existentes
    test_existing_plans()
    
    print("\n✅ Prueba completada")
