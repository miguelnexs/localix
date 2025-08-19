from rest_framework import serializers
from django.db import models
from .models import Pedido, ItemPedido, HistorialPedido, EstadoPedido, Abono
from ventas.serializers import ClienteSerializer, VentaSerializer, ColorProductoSerializer
from productos.serializers import ProductoSerializer

class ItemPedidoSerializer(serializers.ModelSerializer):
    producto = ProductoSerializer(read_only=True)
    producto_id = serializers.IntegerField(write_only=True)
    color = ColorProductoSerializer(read_only=True)  # Ahora serializa el color completo
    color_nombre = serializers.SerializerMethodField()

    class Meta:
        model = ItemPedido
        fields = ['id', 'producto', 'producto_id', 'cantidad', 'precio_unitario', 'subtotal', 'color', 'color_nombre']

    def get_color_nombre(self, obj):
        if obj.color:
            return obj.color.nombre
        return None

class HistorialPedidoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    
    class Meta:
        model = HistorialPedido
        fields = ['id', 'estado_anterior', 'estado_nuevo', 'fecha_cambio', 'notas', 'usuario_nombre']

class EstadoPedidoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    estado_display = serializers.CharField(source='get_estado_display', read_only=True)
    
    class Meta:
        model = EstadoPedido
        fields = ['id', 'pedido', 'estado', 'estado_display', 'fecha_cambio', 'notas', 'usuario_nombre', 'activo']
        read_only_fields = ['fecha_cambio']

class AbonoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.CharField(source='usuario.username', read_only=True)
    metodo_pago_display = serializers.CharField(source='get_metodo_pago_display', read_only=True)
    estado_abono_display = serializers.CharField(source='get_estado_abono_display', read_only=True)
    
    class Meta:
        model = Abono
        fields = [
            'id', 'pedido', 'monto', 'fecha_abono', 'metodo_pago', 'metodo_pago_display',
            'referencia_pago', 'estado_abono', 'estado_abono_display', 'notas', 
            'usuario_nombre', 'fecha_confirmacion', 'comprobante'
        ]
        read_only_fields = ['fecha_abono', 'fecha_confirmacion']

class PedidoSerializer(serializers.ModelSerializer):
    cliente = ClienteSerializer(read_only=True)
    cliente_id = serializers.IntegerField(write_only=True)
    venta = VentaSerializer(read_only=True)
    venta_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    items = ItemPedidoSerializer(many=True, read_only=True)
    historial = HistorialPedidoSerializer(many=True, read_only=True)
    estados = EstadoPedidoSerializer(many=True, read_only=True)
    abonos = AbonoSerializer(many=True, read_only=True)
    estado_actual = serializers.SerializerMethodField()
    total_abonado = serializers.SerializerMethodField()
    abonos_detalle = serializers.SerializerMethodField()
    monto_abono = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    monto_pendiente = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    
    # Campos calculados
    total_pedido = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    productos_count = serializers.IntegerField(read_only=True)
    
    # Estados legibles
    estado_pago_display = serializers.CharField(source='get_estado_pago_display', read_only=True)
    estado_pedido_display = serializers.CharField(source='get_estado_pedido_display', read_only=True)
    tipo_venta_display = serializers.CharField(source='get_tipo_venta_display', read_only=True)
    
    class Meta:
        model = Pedido
        fields = [
            'id', 'numero_pedido', 'cliente', 'cliente_id', 'venta', 'venta_id',
            'tipo_venta', 'tipo_venta_display', 'estado_pago', 'estado_pago_display',
            'estado_pedido', 'estado_pedido_display', 'direccion_entrega',
            'telefono_contacto', 'instrucciones_entrega', 'fecha_creacion',
            'fecha_confirmacion', 'fecha_envio', 'fecha_entrega', 'notas',
            'metodo_pago', 'referencia_pago', 'codigo_seguimiento', 'empresa_envio',
            'items', 'historial', 'estados', 'abonos', 'abonos_detalle', 'estado_actual', 'total_abonado',
            'total_pedido', 'productos_count', 'monto_abono', 'monto_pendiente'
        ]
        read_only_fields = ['numero_pedido', 'fecha_creacion']
    
    def get_estado_actual(self, obj):
        """Obtiene el estado actual activo del pedido"""
        estado_actual = obj.estados.filter(activo=True).first()
        if estado_actual:
            return EstadoPedidoSerializer(estado_actual).data
        return None
    
    def get_total_abonado(self, obj):
        """Calcula el total de abonos confirmados"""
        return sum(abono.monto for abono in obj.abonos.filter(estado_abono='confirmado'))
    
    def get_abonos_detalle(self, obj):
        """Muestra información detallada de abonos cuando el pedido está separado"""
        # Solo mostrar detalles si el pedido está separado
        if obj.estado_pedido == 'separado':
            # Filtrar abonos que tengan monto mayor a 0 o que estén confirmados
            abonos = obj.abonos.filter(
                models.Q(monto__gt=0) | models.Q(estado_abono='confirmado')
            ).order_by('-fecha_abono')
            return AbonoSerializer(abonos, many=True).data
        return []

class PedidoCreateSerializer(serializers.ModelSerializer):
    items = ItemPedidoSerializer(many=True)
    
    class Meta:
        model = Pedido
        fields = [
            'cliente_id', 'venta_id', 'tipo_venta', 'estado_pago', 'estado_pedido',
            'direccion_entrega', 'telefono_contacto', 'instrucciones_entrega',
            'notas', 'metodo_pago', 'referencia_pago', 'items'
        ]
    
    def create(self, validated_data):
        # Validar que venta_id esté presente y no sea nulo
        venta_id = validated_data.get('venta_id')
        if not venta_id:
            raise serializers.ValidationError({'venta_id': 'El campo venta_id es obligatorio y no puede ser nulo.'})
        # Validar que no exista ya un pedido para esta venta
        if Pedido.objects.filter(venta_id=venta_id).exists():
            raise serializers.ValidationError({'venta_id': 'Ya existe un pedido para esta venta.'})
        # Asegurar que siempre haya un cliente
        cliente = validated_data.get('cliente', None)
        if not cliente and 'cliente_id' not in validated_data:
            from ventas.models import Cliente
            cliente = Cliente.objects.first()  # type: ignore[attr-defined]
            if not cliente:
                raise serializers.ValidationError("No hay cliente asignado ni clientes en la base de datos.")
            validated_data['cliente'] = cliente
        items_data = validated_data.pop('items', [])
        pedido = Pedido.objects.create(**validated_data)
        for item_data in items_data:
            ItemPedido.objects.create(pedido=pedido, **item_data)
        return pedido

class PedidoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = [
            'estado_pedido',
        ]

    def update(self, instance, validated_data):
        # Registrar cambio de estado si es necesario
        if 'estado_pedido' in validated_data and validated_data['estado_pedido'] != instance.estado_pedido:
            from .models import HistorialPedido
            HistorialPedido.objects.create(
                pedido=instance,
                estado_anterior=instance.estado_pedido,
                estado_nuevo=validated_data['estado_pedido'],
                usuario=self.context.get('request').user if self.context.get('request') else None
            )
        instance.estado_pedido = validated_data.get('estado_pedido', instance.estado_pedido)
        instance.save()
        return instance

class AbonoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Abono
        fields = [
            'pedido', 'monto', 'metodo_pago', 'referencia_pago', 
            'estado_abono', 'notas', 'comprobante'
        ]
    
    def create(self, validated_data):
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)