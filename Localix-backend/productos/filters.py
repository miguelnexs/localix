import django_filters
from .models import Producto, Categoria

class ProductoFilter(django_filters.FilterSet):
    precio_min = django_filters.NumberFilter(field_name='precio', lookup_expr='gte')
    precio_max = django_filters.NumberFilter(field_name='precio', lookup_expr='lte')
    categoria_slug = django_filters.CharFilter(field_name='categoria__slug')

    class Meta:
        model = Producto
        fields = {
            'categoria': ['exact', 'isnull'],
            'estado': ['exact'],
            'tipo': ['exact'],
            'gestion_stock': ['exact'],
            'stock': ['gte', 'lte', 'exact'],
        }

class CategoriaFilter(django_filters.FilterSet):
    class Meta:
        model = Categoria
        fields = {
            'activa': ['exact'],
            'nombre': ['icontains'],
        }