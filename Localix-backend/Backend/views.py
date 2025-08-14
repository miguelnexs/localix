from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def api_info(request):
    """
    Vista para mostrar información de la API en la ruta raíz
    """
    api_info = {
        "message": "🛍️ Tienda Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "admin": "/admin/",
            "api": {
                "categorias": "/api/categorias/",
                "productos": "/api/productos/",
                "ventas": "/api/ventas/",
                "pedidos": "/api/pedidos/",
                "auth": {
                    "token": "/api/auth/token/",
                    "refresh": "/api/auth/token/refresh/"
                }
            }
        },
        "documentation": "Consulta los endpoints disponibles arriba",
        "technologies": [
            "Django 5.2.4",
            "Django REST Framework",
            "PostgreSQL",
            "JWT Authentication"
        ]
    }
    return Response(api_info, status=status.HTTP_200_OK)

@api_view(['GET'])
def health_check(request):
    """
    Endpoint para verificar el estado del servidor
    """
    return Response({
        "status": "healthy",
        "message": "Servidor funcionando correctamente"
    }, status=status.HTTP_200_OK)
