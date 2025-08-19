from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
from django.utils import timezone
from .models import UserUsagePlan

class UserUsageMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Rutas que no requieren verificación de plan
        exempt_urls = [
            '/admin/',
            '/api/auth/',
            '/api/usuarios/login/',
            '/api/usuarios/logout/',
            '/api/usuarios/refresh/',
            '/api/usuarios/usage/status/',
            '/static/',
            '/media/',
            '/favicon.ico',
            '/usage/expired/',
        ]
        
        # Verificar si la ruta actual está exenta
        current_path = request.path
        is_exempt = any(current_path.startswith(url) for url in exempt_urls)
        
        if is_exempt:
            return self.get_response(request)
        
        # Solo verificar si el usuario está autenticado
        if not request.user.is_authenticated:
            return self.get_response(request)
        
        # Si el usuario es superusuario, permitir acceso sin restricciones
        if request.user.is_superuser:
            return self.get_response(request)
        
        # Solo verificar si el plan está expirado, no bloquear por otros motivos
        try:
            usage_plan = UserUsagePlan.objects.get(user=request.user)
            
            # Solo bloquear si el plan está realmente expirado
            if usage_plan.is_expired:
                # Redirigir a la página de plan expirado
                return redirect('usuarios:usage_expired')
                
        except UserUsagePlan.DoesNotExist:
            # Si no hay plan, crear uno por defecto
            if request.user.is_superuser:
                UserUsagePlan.objects.create(
                    user=request.user,
                    plan_type='premium',
                    days_allowed=3650,
                    start_date=timezone.now(),
                    end_date=timezone.now() + timezone.timedelta(days=3650),
                    is_active=True
                )
            else:
                UserUsagePlan.objects.create(
                    user=request.user,
                    plan_type='trial',
                    days_allowed=15,
                    start_date=timezone.now(),
                    end_date=timezone.now() + timezone.timedelta(days=15),
                    is_active=True
                )
        
        return self.get_response(request)
