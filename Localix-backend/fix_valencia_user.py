#!/usr/bin/env python
"""
Script para verificar y corregir el usuario valencia
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from usuarios.models import UserUsagePlan

User = get_user_model()

def check_and_fix_valencia():
    """Verificar y corregir el usuario valencia"""
    print("🔍 Verificando y corrigiendo usuario valencia")
    print("=" * 60)
    
    try:
        # Buscar usuario valencia
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
            return
        
        # Corregir contraseña
        print(f"\n🔧 Corrigiendo contraseña del usuario valencia...")
        valencia_user.set_password('valencia123')
        valencia_user.save()
        print(f"✅ Contraseña corregida a 'valencia123'")
        
        # Verificar que el plan está correcto
        if plan.is_expired:
            print(f"\n⚠️ El plan está expirado, corrigiendo...")
            from django.utils import timezone
            from datetime import timedelta
            
            # Extender el plan por 30 días
            plan.end_date = timezone.now() + timedelta(days=30)
            plan.save()
            print(f"✅ Plan extendido hasta: {plan.end_date}")
        
        print(f"\n✅ Usuario valencia corregido y listo para usar")
        print(f"   - Username: valencia")
        print(f"   - Password: valencia123")
        print(f"   - Plan: {plan.plan_type} ({plan.days_remaining} días restantes)")
        
    except User.DoesNotExist:
        print(f"❌ Usuario 'valencia' no encontrado")
        print(f"🔧 Creando usuario valencia...")
        
        # Crear usuario valencia
        valencia_user = User.objects.create_user(
            username='valencia',
            email='valencia@gmail.com',
            password='valencia123',
            nombre_completo='Usuario Valencia',
            is_active=True
        )
        
        # Crear plan premium
        from django.utils import timezone
        from datetime import timedelta
        
        plan = UserUsagePlan.objects.create(
            user=valencia_user,
            plan_type='premium',
            days_allowed=30,
            end_date=timezone.now() + timedelta(days=30),
            is_active=True
        )
        
        print(f"✅ Usuario valencia creado:")
        print(f"   - Username: valencia")
        print(f"   - Password: valencia123")
        print(f"   - Plan: premium (30 días)")

if __name__ == "__main__":
    print("🧪 Corrección de Usuario Valencia")
    print("=" * 60)
    
    check_and_fix_valencia()
    
    print("\n✅ Corrección completada")
