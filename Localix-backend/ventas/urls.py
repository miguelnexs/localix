from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
# from .views import crear_preferencia_mercadopago, mercadopago_webhook  # Eliminado

# Crear router para DRF
router = DefaultRouter()
router.register(r'clientes', views.ClienteViewSet)
router.register(r'ventas', views.VentaViewSet)
router.register(r'productos', views.ProductoViewSet)

urlpatterns = [
    # URLs del router de DRF
    path('', include(router.urls)),
]

# Eliminadas las rutas de Mercado Pago 