from rest_framework import serializers
from productos.models import ColorProducto, ImagenProducto


class ImagenProductoSerializer(serializers.ModelSerializer):
    """
    Serializer para imágenes de productos
    """
    url_imagen = serializers.ReadOnlyField()
    
    class Meta:
        model = ImagenProducto
        fields = [
            'id', 'imagen', 'orden', 'es_principal', 
            'fecha_creacion', 'url_imagen'
        ]
        read_only_fields = ['fecha_creacion']

    def validate(self, data):
        """
        Validación personalizada para imágenes
        """
        color = data.get('color')
        es_principal = data.get('es_principal', False)
        
        # Si se marca como principal, verificar que no haya otra principal
        if es_principal and color:
            imagenes_principales = ImagenProducto.objects.filter(
                color=color, es_principal=True
            ).exclude(id=self.instance.id if self.instance else None)
            
            if imagenes_principales.exists():
                raise serializers.ValidationError(
                    "Ya existe una imagen principal para este color"
                )
        
        return data


class ColorProductoSerializer(serializers.ModelSerializer):
    """
    Serializer para colores de productos
    """
    imagenes = ImagenProductoSerializer(many=True, read_only=True)
    cantidad_imagenes = serializers.ReadOnlyField()
    
    class Meta:
        model = ColorProducto
        fields = [
            'id', 'nombre', 'hex_code', 'stock', 'orden', 'activo',
            'fecha_creacion', 'fecha_actualizacion',
            'imagenes', 'cantidad_imagenes'
        ]
        read_only_fields = ['fecha_creacion', 'fecha_actualizacion']

    def validate_hex_code(self, value):
        """
        Validar formato de código hexadecimal
        """
        if value and not value.startswith('#'):
            raise serializers.ValidationError(
                "El código hexadecimal debe comenzar con #"
            )
        
        if value and len(value) != 7:
            raise serializers.ValidationError(
                "El código hexadecimal debe tener 7 caracteres (#RRGGBB)"
            )
        
        return value

    def validate_stock(self, value):
        """
        ✅ Validar que el stock no sea negativo
        """
        if value < 0:
            raise serializers.ValidationError(
                "El stock no puede ser negativo"
            )
        return value

    def validate(self, data):
        """
        Validación personalizada para colores
        """
        producto = data.get('producto')
        nombre = data.get('nombre')
        
        # Verificar que no exista otro color con el mismo nombre para el producto
        if producto and nombre:
            existing_color = ColorProducto.objects.filter(
                producto=producto, nombre=nombre
            ).exclude(id=self.instance.id if self.instance else None)
            
            if existing_color.exists():
                raise serializers.ValidationError(
                    f"Ya existe un color con el nombre '{nombre}' para este producto"
                )
        
        return data


class ColorProductoCreateSerializer(serializers.ModelSerializer):
    """
    Serializer para crear colores con imágenes
    """
    imagenes = ImagenProductoSerializer(many=True, required=False)
    
    class Meta:
        model = ColorProducto
        fields = [
            'id', 'nombre', 'hex_code', 'stock', 'orden', 'activo', 'imagenes'
        ]

    def validate_stock(self, value):
        """
        ✅ Validar que el stock no sea negativo
        """
        if value < 0:
            raise serializers.ValidationError(
                "El stock no puede ser negativo"
            )
        return value

    def create(self, validated_data):
        """
        Crear color con sus imágenes
        """
        imagenes_data = validated_data.pop('imagenes', [])
        color = ColorProducto.objects.create(**validated_data)
        
        for imagen_data in imagenes_data:
            ImagenProducto.objects.create(color=color, **imagen_data)
        
        return color

    def update(self, instance, validated_data):
        """
        Actualizar color con sus imágenes
        """
        imagenes_data = validated_data.pop('imagenes', [])
        
        # Actualizar color
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Actualizar imágenes si se proporcionan
        if imagenes_data:
            # Eliminar imágenes existentes
            instance.imagenes.all().delete()
            
            # Crear nuevas imágenes
            for imagen_data in imagenes_data:
                ImagenProducto.objects.create(color=instance, **imagen_data)
        
        return instance


class ColorProductoListSerializer(serializers.ModelSerializer):
    """
    Serializer simplificado para listar colores
    """
    imagen_principal_url = serializers.SerializerMethodField()
    cantidad_imagenes = serializers.ReadOnlyField()
    
    class Meta:
        model = ColorProducto
        fields = [
            'id', 'nombre', 'hex_code', 'stock', 'orden', 'activo',
            'imagen_principal_url', 'cantidad_imagenes'
        ]
    
    def get_imagen_principal_url(self, obj):
        """
        Obtener URL de la imagen principal del color
        """
        imagen_principal = obj.imagenes.filter(es_principal=True).first()
        if imagen_principal:
            return imagen_principal.url_imagen
        
        # Si no hay imagen principal, devolver la primera
        primera_imagen = obj.imagenes.first()
        if primera_imagen:
            return primera_imagen.url_imagen
        
        return None 