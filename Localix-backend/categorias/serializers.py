from rest_framework import serializers
from categorias.models import CategoriaProducto
from django.utils.text import slugify
from django.core.files.images import get_image_dimensions
import os

class CategoriaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()
    cantidad_productos = serializers.IntegerField(read_only=True)
    productos_vinculados = serializers.SerializerMethodField()
    stock_total_categoria = serializers.SerializerMethodField()
    
    class Meta:
        model = CategoriaProducto
        fields = [
            'id', 'nombre', 'slug', 'descripcion', 'activa', 'orden', 'imagen', 'imagen_url',
            'cantidad_productos', 'productos_vinculados', 'stock_total_categoria',
            'fecha_creacion', 'fecha_actualizacion',
        ]
        read_only_fields = ('slug', 'imagen_url', 'fecha_creacion', 'fecha_actualizacion')
    
    def get_imagen_url(self, obj):
        if obj.imagen:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None
    
    def get_productos_vinculados(self, obj):
        from productos.models import Producto
        productos = Producto.objects.filter(categoria=obj)
        request = self.context.get('request')
        return [
            {
                "id": p.id,
                "slug": p.slug,
                "nombre": p.nombre,
                "sku": p.sku,
                "descripcion_corta": p.descripcion_corta,
                "precio": p.precio,
                "stock": p.stock,
                "stock_total_calculado": self._calcular_stock_total(p),
                "estado": p.estado,
                "imagen_principal_url": (
                    request.build_absolute_uri(p.imagen_principal.url)
                    if p.imagen_principal and (p.imagen_principal.url if p.imagen_principal else None)
                    else None
                ),
            }
            for p in productos
        ]
    
    def _calcular_stock_total(self, producto):
        """Calcula el stock total sumando variantes y colores"""
        try:
            # Sumar stock de variantes
            stock_variantes = sum(variante.stock for variante in producto.variantes.all())
            
            # Sumar stock de colores activos
            stock_colores = sum(color.stock for color in producto.colores.filter(activo=True))
            
            # El stock total es la suma de variantes + colores
            return stock_variantes + stock_colores
        except Exception as e:
            print(f"❌ Error calculando stock total para {producto.nombre}: {str(e)}")
            return 0
    
    def get_stock_total_categoria(self, obj):
        """Calcula el stock total de todos los productos de la categoría"""
        try:
            from productos.models import Producto
            productos = Producto.objects.filter(categoria=obj)
            stock_total = 0
            
            for producto in productos:
                stock_total += self._calcular_stock_total(producto)
            
            return stock_total
        except Exception as e:
            print(f"❌ Error calculando stock total de categoría {obj.nombre}: {str(e)}")
            return 0
    
    def validate_nombre(self, value):
        """Valida que el nombre sea único por usuario y no esté vacío"""
        if not value or not value.strip():
            raise serializers.ValidationError("El nombre de la categoría es requerido.")
        
        value = value.strip()
        
        # Obtener el usuario del contexto de la request
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            print("Error: usuario no autenticado")
            raise serializers.ValidationError("Usuario no autenticado.")
        
        # Si estamos actualizando, verificar que no haya conflicto con otros registros del mismo usuario
        if self.instance and self.instance.nombre == value:
            print("Actualizando sin cambio de nombre")
            return value
            
        # Verificar unicidad solo dentro del usuario actual
        if CategoriaProducto.objects.filter(usuario=request.user, nombre__iexact=value).exists():
            print(f"Error: ya existe categoría con nombre '{value}' para el usuario {request.user.username}")
            raise serializers.ValidationError("Ya existe una categoría con este nombre.")
        
        print(f"Nombre válido: '{value}'")
        return value
    
    def validate_imagen(self, value):
        """Validaciones completas para imágenes de categoría"""
        if not value:
            return value
            
        # Validar extensión
        valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
        ext = os.path.splitext(value.name)[1].lower()
        if ext not in valid_extensions:
            raise serializers.ValidationError(
                "Formato de imagen no soportado. Use JPG, PNG, WEBP, GIF o SVG"
            )
        
        # Validar tamaño (máximo 10MB para desarrollo)
        if value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError(
                "La imagen es demasiado grande. Máximo 10MB"
            )
        
        # Validar tipo de contenido
        allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
        if hasattr(value, 'content_type') and value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Tipo de archivo no permitido. Use JPEG, PNG, WEBP, GIF o SVG"
            )
        
        # Validar que sea una imagen válida (excepto SVG)
        if ext != '.svg':
            try:
                width, height = get_image_dimensions(value)
                if width is None or height is None:
                    raise serializers.ValidationError(
                        "El archivo no es una imagen válida"
                    )
                if width > 4000 or height > 4000:
                    raise serializers.ValidationError(
                        "La imagen es demasiado grande. Máximo 4000x4000 píxeles"
                    )
            except Exception:
                raise serializers.ValidationError(
                    "El archivo no es una imagen válida"
                )
        
        return value
    
    def validate(self, data):
        """Validación general del serializer"""
        # Asegurar que el nombre no esté vacío
        if 'nombre' in data and not data['nombre'].strip():
            raise serializers.ValidationError({
                "nombre": "El nombre de la categoría es requerido."
            })
        
        return data
    
    def create(self, validated_data):
        """Crea la categoría generando automáticamente el slug único por usuario"""
        try:
            # Obtener el usuario del contexto
            request = self.context.get('request')
            if not request or not request.user.is_authenticated:
                raise serializers.ValidationError("Usuario no autenticado.")
            
            # Generar slug único por usuario
            base_slug = slugify(validated_data['nombre'])
            slug = base_slug
            counter = 1
            
            # Verificar que el slug sea único solo para este usuario
            while CategoriaProducto.objects.filter(usuario=request.user, slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            
            validated_data['slug'] = slug
            validated_data['usuario'] = request.user  # Asignar usuario explícitamente
            return super().create(validated_data)
        except Exception as e:
            raise serializers.ValidationError(f"Error al crear categoría: {str(e)}")
    
    def update(self, instance, validated_data):
        """Actualiza la categoría regenerando el slug único por usuario si cambia el nombre"""
        if 'nombre' in validated_data and instance.nombre != validated_data['nombre']:
            # Obtener el usuario del contexto
            request = self.context.get('request')
            if request and request.user.is_authenticated:
                # Generar slug único por usuario
                base_slug = slugify(validated_data['nombre'])
                slug = base_slug
                counter = 1
                
                # Verificar que el slug sea único solo para este usuario (excluyendo la instancia actual)
                while CategoriaProducto.objects.filter(usuario=request.user, slug=slug).exclude(id=instance.id).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                validated_data['slug'] = slug
        return super().update(instance, validated_data)