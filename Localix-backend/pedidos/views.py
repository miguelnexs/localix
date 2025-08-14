from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Pedido, ItemPedido, HistorialPedido
from .serializers import (
    PedidoSerializer, PedidoCreateSerializer, PedidoUpdateSerializer,
    ItemPedidoSerializer, HistorialPedidoSerializer
)
from rest_framework.decorators import api_view

class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().select_related('cliente', 'venta')
    serializer_class = PedidoSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['tipo_venta', 'estado_pago', 'estado_pedido', 'cliente']
    search_fields = ['numero_pedido', 'cliente__nombre', 'cliente__email']
    ordering_fields = ['fecha_creacion', 'numero_pedido', 'total_pedido']
    ordering = ['-fecha_creacion']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return PedidoCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return PedidoUpdateSerializer
        return PedidoSerializer
    
    def perform_create(self, serializer):
        try:
            pedido = serializer.save()
            # Crear historial inicial
            HistorialPedido.objects.create(
                pedido=pedido,
                estado_nuevo=pedido.estado_pedido,
                notas='Pedido creado'
            )
        except Exception as e:
            raise
    
    def update(self, request, *args, **kwargs):
        # Solo permitir actualizar el estado del pedido
        if set(request.data.keys()) - {'estado_pedido'}:
            return Response({'error': 'Solo se permite modificar el estado del pedido.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        # Solo permitir actualizar el estado del pedido
        if set(request.data.keys()) - {'estado_pedido'}:
            return Response({'error': 'Solo se permite modificar el estado del pedido.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)
    
    def perform_update(self, serializer):
        instance = self.get_object()
        old_estado = instance.estado_pedido
        pedido = serializer.save()
        
        # Registrar cambio de estado si es necesario
        if old_estado != pedido.estado_pedido:
            HistorialPedido.objects.create(
                pedido=pedido,
                estado_anterior=old_estado,
                estado_nuevo=pedido.estado_pedido,
                usuario=self.request.user if self.request else None
            )
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        Cambia el estado del pedido.
        
        Endpoint: POST /pedidos/{id}/cambiar_estado/
        
        Parámetros en el body (JSON):
            - estado_pedido: (str) Nuevo estado del pedido. Debe ser uno de los valores válidos:
                ['pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado']
            - notas: (opcional, str) Notas para el historial.
            - estado_anterior: (opcional, str) Estado anterior (usualmente no es necesario, se calcula automáticamente).
        
        Ejemplo de petición:
            {
                "estado_pedido": "enviado",
                "notas": "Pedido despachado por mensajería."
            }
        
        Respuesta: Pedido actualizado (JSON)
        """
        pedido = self.get_object()
        nuevo_estado = request.data.get('estado_pedido')
        
        if not nuevo_estado:
            return Response(
                {'error': 'El estado del pedido es requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if nuevo_estado not in dict(Pedido.ESTADO_PEDIDO_CHOICES):
            return Response(
                {'error': 'Estado de pedido inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Actualizar estado
        pedido.estado_pedido = nuevo_estado
        
        # Actualizar fechas según el estado
        if nuevo_estado == 'confirmado' and not pedido.fecha_confirmacion:
            from django.utils import timezone
            pedido.fecha_confirmacion = timezone.now()
        elif nuevo_estado == 'enviado' and not pedido.fecha_envio:
            from django.utils import timezone
            pedido.fecha_envio = timezone.now()
        elif nuevo_estado == 'entregado' and not pedido.fecha_entrega:
            from django.utils import timezone
            pedido.fecha_entrega = timezone.now()
        
        pedido.save()
        
        # Registrar en historial
        usuario = request.user if request and request.user and request.user.is_authenticated else None
        HistorialPedido.objects.create(
            pedido=pedido,
            estado_anterior=request.data.get('estado_anterior', ''),
            estado_nuevo=nuevo_estado,
            notas=request.data.get('notas', ''),
            usuario=usuario
        )
        
        serializer = self.get_serializer(pedido)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def historial(self, request, pk=None):
        pedido = self.get_object()
        historial = pedido.historial.all()
        serializer = HistorialPedidoSerializer(historial, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def estadisticas(self, request):
        from django.db.models import Count, Sum
        from django.utils import timezone
        from datetime import timedelta
        
        # Estadísticas generales
        total_pedidos = Pedido.objects.count()
        pedidos_pendientes = Pedido.objects.filter(estado_pedido='pendiente').count()
        pedidos_en_proceso = Pedido.objects.filter(estado_pedido__in=['confirmado', 'en_preparacion']).count()
        pedidos_enviados = Pedido.objects.filter(estado_pedido='enviado').count()
        pedidos_entregados = Pedido.objects.filter(estado_pedido='entregado').count()
        
        # Ventas por tipo
        ventas_fisicas = Pedido.objects.filter(tipo_venta='fisica').count()
        ventas_digitales = Pedido.objects.filter(tipo_venta='digital').count()
        
        # Total de ingresos
        total_ingresos = Pedido.objects.aggregate(
            total=Sum('venta__total')
        )['total'] or 0
        
        # Pedidos del último mes
        hace_30_dias = timezone.now() - timedelta(days=30)
        pedidos_ultimo_mes = Pedido.objects.filter(fecha_creacion__gte=hace_30_dias).count()
        
        return Response({
            'total_pedidos': total_pedidos,
            'pedidos_pendientes': pedidos_pendientes,
            'pedidos_en_proceso': pedidos_en_proceso,
            'pedidos_enviados': pedidos_enviados,
            'pedidos_entregados': pedidos_entregados,
            'ventas_fisicas': ventas_fisicas,
            'ventas_digitales': ventas_digitales,
            'total_ingresos': float(total_ingresos),
            'pedidos_ultimo_mes': pedidos_ultimo_mes
        })

class ItemPedidoViewSet(viewsets.ModelViewSet):
    queryset = ItemPedido.objects.all().select_related('pedido', 'producto')
    serializer_class = ItemPedidoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['pedido']

class HistorialPedidoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = HistorialPedido.objects.all().select_related('pedido', 'usuario')
    serializer_class = HistorialPedidoSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['pedido'] 

@api_view(['POST'])
def recibir_mensaje_whatsapp(request):
    """
    Endpoint de prueba para recibir mensajes del bot de WhatsApp.
    Solo imprime el mensaje recibido y responde con éxito.
    """
    mensaje = request.data.get('mensaje')
    numero = request.data.get('numero')
    print(f"Mensaje recibido de WhatsApp: {mensaje} (de {numero})")
    return Response({'status': 'ok', 'mensaje': mensaje, 'numero': numero}) 