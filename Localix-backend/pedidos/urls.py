from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PedidoViewSet, ItemPedidoViewSet, HistorialPedidoViewSet, recibir_mensaje_whatsapp

router = DefaultRouter()
router.register(r'pedidos', PedidoViewSet)
router.register(r'items', ItemPedidoViewSet)
router.register(r'historial', HistorialPedidoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('whatsapp/prueba/', recibir_mensaje_whatsapp),
] 