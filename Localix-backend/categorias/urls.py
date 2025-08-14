from django.urls import path
from rest_framework.routers import DefaultRouter
from categorias.views import CategoriaViewSet

router = DefaultRouter()
router.register(r'categorias', CategoriaViewSet, basename='categoria')

# URLs adicionales para acciones personalizadas
urlpatterns = [
    path('categorias/<slug:slug>/upload_imagen/', 
         CategoriaViewSet.as_view({'post': 'upload_imagen'}), 
         name='categoria-upload-imagen'),
]

urlpatterns += router.urls