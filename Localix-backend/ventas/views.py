from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import transaction
from django.utils import timezone
from django.db import models
import json
from decimal import Decimal
from datetime import datetime
from typing import List, Dict, Any, Optional

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import serializers

from .models import Venta, ItemVenta, Cliente
from .serializers import ClienteSerializer, VentaSerializer, VentaCreateSerializer, ItemVentaSerializer, ProductoVentaSerializer
from productos.models import Producto, VarianteProducto, ColorProducto
from django.db.models import Q
# import mercadopago  # Eliminado
from django.conf import settings

from rest_framework.decorators import api_view



class ClienteViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar clientes
    """
    queryset = Cliente.objects.all().order_by('-fecha_registro')  # type: ignore[attr-defined]
    serializer_class = ClienteSerializer
    
    def get_queryset(self):
        """
        Permite filtrar por estado activo/inactivo y multi-tenancy
        Por defecto muestra todos los clientes del usuario
        """
        print(f"🔍 [CLIENTE VIEWSET] get_queryset - Usuario: {self.request.user}")
        print(f"🔍 [CLIENTE VIEWSET] get_queryset - Autenticado: {self.request.user.is_authenticated}")
        
        queryset = Cliente.objects.filter(usuario=self.request.user).order_by('-fecha_registro')  # type: ignore[attr-defined]
        activo = self.request.query_params.get('activo', None)
        
        if activo is not None:
            if str(activo).lower() == 'true':
                queryset = queryset.filter(activo=True)
            elif str(activo).lower() == 'false':
                queryset = queryset.filter(activo=False)
        
        print(f"🔍 [CLIENTE VIEWSET] get_queryset - Clientes encontrados: {queryset.count()}")
        return queryset

    def perform_create(self, serializer):
        """
        Crear cliente y asignar usuario
        """
        print(f"🔍 [CLIENTE VIEWSET] perform_create - Usuario: {self.request.user}")
        print(f"🔍 [CLIENTE VIEWSET] perform_create - Autenticado: {self.request.user.is_authenticated}")
        return serializer.save(usuario=self.request.user)
    
    def create(self, request, *args, **kwargs):
        """
        Crear cliente con debugging
        """
        print(f"🔍 [CLIENTE VIEWSET] create - Usuario: {request.user}")
        print(f"🔍 [CLIENTE VIEWSET] create - Autenticado: {request.user.is_authenticated}")
        print(f"🔍 [CLIENTE VIEWSET] create - Datos recibidos: {request.data}")
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cliente = self.perform_create(serializer)
        
        print(f"✅ [CLIENTE VIEWSET] create - Cliente creado exitosamente: {cliente.id}")
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def ventas(self, request, pk=None):
        """Obtener todas las ventas de un cliente específico"""
        try:
            cliente = self.get_object()
            ventas = Venta.objects.filter(cliente=cliente).select_related('cliente').prefetch_related('items__producto').order_by('-fecha_venta')
            
            # Serializar las ventas con información detallada
            ventas_data = []
            for venta in ventas:
                venta_info = {
                    'id': venta.id,
                    'numero_venta': venta.numero_venta,
                    'fecha_venta': venta.fecha_venta,
                    'total': str(venta.total),
                    'estado': venta.estado,
                    'metodo_pago': venta.metodo_pago,
                    'items': []
                }
                
                # Agregar información de cada item
                for item in venta.items.all():
                    # Obtener URL de la imagen del producto
                    imagen_url = None
                    if item.producto.imagen_principal:
                        request = self.request
                        if request is not None:
                            imagen_url = request.build_absolute_uri(item.producto.imagen_principal.url)
                        else:
                            imagen_url = item.producto.imagen_principal.url
                    
                    # Agregar información del color si existe
                    color_info = None
                    if item.color:
                        color_info = {
                            'id': item.color.id,
                            'nombre': item.color.nombre,
                            'hex_code': item.color.hex_code
                        }
                    
                    item_info = {
                        'producto_id': item.producto.id,
                        'producto_nombre': item.producto.nombre,
                        'producto_sku': item.producto.sku,
                        'producto_imagen_url': imagen_url,
                        'cantidad': item.cantidad,
                        'precio_unitario': str(item.precio_unitario),
                        'subtotal': str(item.subtotal),
                        'color': color_info
                    }
                    if item.variante:
                        item_info['variante_nombre'] = item.variante.nombre
                        item_info['variante_id'] = item.variante.id
                    venta_info['items'].append(item_info)
                
                ventas_data.append(venta_info)
            
            return Response({
                'cliente': ClienteSerializer(cliente).data,
                'ventas': ventas_data,
                'total_ventas': len(ventas_data),
                'total_gastado': sum(float(venta['total']) for venta in ventas_data)
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Buscar clientes por nombre o email"""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'error': 'Query parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        clientes = self.get_queryset().filter(
            Q(nombre__icontains=query) |  # type: ignore[operator]
            Q(email__icontains=query) |  # type: ignore[operator]
            Q(telefono__icontains=query)  # type: ignore[operator]
        )[:10]
        
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def crear_rapido(self, request):
        """Crear cliente de forma rápida para ventas"""
        try:
            data = request.data
            
            # Validar datos mínimos
            if not data.get('nombre'):
                return Response(
                    {'error': 'El nombre es obligatorio'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Usar serializer para crear cliente y asignar usuario
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            cliente = self.perform_create(serializer)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VentaViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar ventas
    """
    queryset = Venta.objects.select_related('cliente').prefetch_related('items__producto').order_by('-fecha_venta')  # type: ignore[attr-defined]
    serializer_class = VentaSerializer

    def get_queryset(self):
        """
        Filtra las ventas por usuario autenticado
        """
        return Venta.objects.filter(usuario=self.request.user).select_related('cliente').prefetch_related('items__producto').order_by('-fecha_venta')

    def perform_create(self, serializer):
        """
        Crear venta y asignar usuario
        """
        serializer.save(usuario=self.request.user)
    
    @action(detail=False, methods=['post'])
    def crear_venta_rapida(self, request):
        """Crear una venta rápida con items"""
        try:
            data = request.data
            with transaction.atomic():  # type: ignore[attr-defined]
                # Manejar cliente
                cliente = None
                cliente_nombre = data.get('cliente_nombre', '').strip()
                if data.get('cliente_id'):
                    try:
                        cliente = Cliente.objects.get(id=data['cliente_id'])  # type: ignore[attr-defined]
                    except Cliente.DoesNotExist:  # type: ignore[attr-defined]
                        return Response({'error': f'Cliente con id {data["cliente_id"]} no existe'}, status=status.HTTP_400_BAD_REQUEST)
                elif data.get('crear_cliente') and data.get('cliente_data'):
                    cliente_data = data['cliente_data']
                    # Usar serializer para crear cliente y asignar usuario
                    cliente_serializer = ClienteSerializer(data=cliente_data)
                    cliente_serializer.is_valid(raise_exception=True)
                    cliente = cliente_serializer.save(usuario=request.user)

                # Validar que haya cliente o nombre de cliente
                if not cliente and not cliente_nombre:
                    return Response({'error': 'Debe especificar un cliente (cliente_id) o un nombre para venta anónima (cliente_nombre).'}, status=status.HTTP_400_BAD_REQUEST)

                # Crear la venta usando serializer para asignar usuario
                venta_data = {
                    'cliente': cliente.id if cliente else None,
                    'cliente_nombre': cliente_nombre,
                    'porcentaje_descuento': Decimal(str(data.get('porcentaje_descuento', 0))),
                    'metodo_pago': data.get('metodo_pago', 'efectivo'),
                    'observaciones': data.get('observaciones', ''),
                    'vendedor': data.get('vendedor', 'Sistema'),
                    'estado': 'completada'
                }
                venta_serializer = VentaSerializer(data=venta_data)
                venta_serializer.is_valid(raise_exception=True)
                venta = venta_serializer.save(usuario=request.user)

                # Crear los items de la venta
                items_data = data.get('items', [])
                if not items_data or not isinstance(items_data, list):
                    return Response({'error': 'La venta debe tener al menos un item'}, status=status.HTTP_400_BAD_REQUEST)

                # ✅ Validar que no haya productos duplicados
                items_unicos = {}
                for item_data in items_data:
                    producto_id = item_data.get('producto_id')
                    variante_id = item_data.get('variante_id')
                    color_id = item_data.get('color_id')
                    
                    # Crear clave única para el item
                    clave = f"{producto_id}_{variante_id or 'null'}_{color_id or 'null'}"
                    
                    if clave in items_unicos:
                        return Response({
                            'error': f'Producto duplicado detectado. Cada combinación de producto, variante y color debe ser única.'
                        }, status=status.HTTP_400_BAD_REQUEST)
                    
                    items_unicos[clave] = item_data

                for item_data in items_data:
                    producto_id = item_data.get('producto_id')
                    if not producto_id:
                        return Response({'error': 'Falta producto_id en un item'}, status=status.HTTP_400_BAD_REQUEST)
                    try:
                        producto = Producto.objects.get(id=producto_id)
                    except Producto.DoesNotExist:  # type: ignore[attr-defined]
                        return Response({'error': f'Producto con id {producto_id} no existe'}, status=status.HTTP_400_BAD_REQUEST)

                    # Determinar precio unitario (no se almacena, solo se usa para el cálculo)
                    precio_unitario = producto.precio
                    variante_id = item_data.get('variante_id')
                    variante = None
                    if variante_id:
                        try:
                            variante = VarianteProducto.objects.get(id=variante_id)  # type: ignore[attr-defined]
                            precio_unitario += variante.precio_extra
                        except VarianteProducto.DoesNotExist:  # type: ignore[attr-defined]
                            return Response({'error': f'Variante con id {variante_id} no existe'}, status=status.HTTP_400_BAD_REQUEST)

                    # ✅ Manejar color específico
                    color_id = item_data.get('color_id')
                    color = None
                    
                    # Verificar si el producto tiene colores configurados
                    colores_activos = producto.colores.filter(activo=True)
                    tiene_colores = colores_activos.exists()
                    
                    if tiene_colores:
                        # Si el producto tiene colores, es obligatorio especificar uno
                        if not color_id:
                            colores_disponibles = [f"{c.nombre} (Stock: {c.stock})" for c in colores_activos]
                            return Response({
                                'error': f'El producto "{producto.nombre}" tiene colores configurados. Debe seleccionar un color específico. Colores disponibles: {", ".join(colores_disponibles)}'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Validar que el color existe y está activo
                        try:
                            color = ColorProducto.objects.get(id=color_id, producto=producto, activo=True)  # type: ignore[attr-defined]
                        except ColorProducto.DoesNotExist:  # type: ignore[attr-defined]
                            return Response({
                                'error': f'El color seleccionado no existe o no está disponible para el producto "{producto.nombre}"'
                            }, status=status.HTTP_400_BAD_REQUEST)
                        
                        # Verificar stock del color
                        if color.stock < item_data['cantidad']:
                            return Response({
                                'error': f'Stock insuficiente para el color "{color.nombre}" del producto "{producto.nombre}". Disponible: {color.stock}, Solicitado: {item_data["cantidad"]}'
                            }, status=status.HTTP_400_BAD_REQUEST)
                    elif color_id:
                        # Si el producto no tiene colores pero se especificó uno, es un error
                        return Response({
                            'error': f'El producto "{producto.nombre}" no tiene colores configurados, pero se especificó un color'
                        }, status=status.HTTP_400_BAD_REQUEST)

                    # Crear item de venta
                    ItemVenta.objects.create(  # type: ignore[attr-defined]
                        venta=venta,
                        producto=producto,
                        variante=variante,
                        color=color,
                        cantidad=item_data['cantidad'],
                        descuento_item=Decimal(str(item_data.get('descuento_item', 0)))
                    )

                    # ✅ El descuento de stock ahora se maneja automáticamente en el modelo ItemVenta
                    # No es necesario duplicar la lógica aquí

                # Calcular totales
                venta.calcular_totales()

                # ✅ Crear pedido automáticamente después de la venta
                from pedidos.models import Pedido, ItemPedido
                
                # Determinar tipo de venta basado en el método de pago
                tipo_venta = 'fisica' if venta.metodo_pago in ['efectivo', 'tarjeta'] else 'digital'
                
                # Crear el pedido
                pedido = Pedido.objects.create(
                    usuario=request.user,  # Asignar el usuario autenticado
                    cliente=cliente,
                    venta=venta,
                    tipo_venta=tipo_venta,
                    estado_pago='pagado' if venta.estado == 'completada' else 'pendiente',
                    estado_pedido='pendiente',
                    direccion_entrega=cliente.direccion if cliente else '',
                    telefono_contacto=cliente.telefono if cliente else '',
                    metodo_pago=venta.metodo_pago,
                    notas=venta.observaciones
                )
                
                # Crear items del pedido basados en los items de la venta
                for item_venta in venta.items.all():
                    precio_unitario = item_venta.producto.precio
                    if item_venta.variante:
                        precio_unitario += item_venta.variante.precio_extra
                    ItemPedido.objects.create(
                        pedido=pedido,
                        producto=item_venta.producto,
                        cantidad=item_venta.cantidad,
                        precio_unitario=precio_unitario,
                        subtotal=item_venta.subtotal,
                        color=item_venta.color  # Guardar el color seleccionado
                    )

                # Serializar la venta completa
                serializer = self.get_serializer(venta)
                return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'])
    def resumen(self, request):
        """Obtener resumen de ventas"""
        ventas = self.get_queryset()[:20]
        serializer = self.get_serializer(ventas, many=True)
        
        total_ventas = ventas.count()
        total_ingresos = sum(float(venta.total) for venta in ventas)
        
        return Response({
            'ventas': serializer.data,
            'resumen': {
                'total_ventas': total_ventas,
                'total_ingresos': total_ingresos
            }
        })

# Vistas adicionales para productos (para la interfaz de DRF)
class ProductoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet para productos en ventas
    """
    queryset = Producto.objects.filter(estado='publicado').select_related('categoria').prefetch_related('variantes')
    serializer_class = ProductoVentaSerializer
    permission_classes = [AllowAny]
    
    def list(self, request):
        """Listar productos con información completa"""
        productos = self.get_queryset()
        serializer = self.get_serializer(productos, many=True, context={'request': request})
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def buscar(self, request):
        """Buscar productos por nombre o SKU"""
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response({'error': 'Query parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        productos = self.queryset.filter(
            Q(nombre__icontains=query) |  # type: ignore[operator]
            Q(sku__icontains=query)  # type: ignore[operator]
        ).select_related('categoria')[:10]  # type: ignore[attr-defined]
        
        serializer = self.get_serializer(productos, many=True, context={'request': request})
        return Response(serializer.data)

# Endpoint para Mercado Pago
# @api_view(['POST'])
# def crear_preferencia_mercadopago(request):
#     """
#     Crea una preferencia de pago en Mercado Pago y devuelve la URL de pago.
#     Espera un JSON con los items y datos del comprador.
#     """
#     sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
#     data = request.data
#     items = data.get('items', [])
#     payer = data.get('payer', {})
#     # Crear la venta en estado pendiente y obtener su ID
#     venta = Venta.objects.create(
#         cliente_nombre=payer.get('email', ''),
#         estado='pendiente',
#         metodo_pago='mercadopago',
#         total=sum(float(item.get('unit_price', 0)) * int(item.get('quantity', 1)) for item in items)
#     )
#     venta.save()
#     # Crear los items de la venta
#     for item in items:
#         producto_id = item.get('producto_id')
#         if not producto_id:
#             continue  # O podrías lanzar un error si es obligatorio
#         try:
#             producto = Producto.objects.get(id=producto_id)
#         except Producto.DoesNotExist:
#             continue  # O podrías lanzar un error si es obligatorio
#         variante_id = item.get('variante_id')
#         variante = None
#         if variante_id:
#             try:
#                 variante = VarianteProducto.objects.get(id=variante_id)
#             except VarianteProducto.DoesNotExist:
#                 variante = None
#         ItemVenta.objects.create(
#             venta=venta,
#             producto=producto,
#             variante=variante,
#             cantidad=int(item.get('quantity', 1)),
#             descuento_item=Decimal(str(item.get('descuento_item', 0)))
#         )
#     preference_data = {
#         "items": [
#             {
#                 "title": item.get("title", "Producto"),
#                 "quantity": int(item.get("quantity", 1)),
#                 "currency_id": "COP",
#                 "unit_price": float(item.get("unit_price", 0)),
#             }
#             for item in items
#         ],
#         "payer": payer,
#         "back_urls": {
#             "success": f"{settings.FRONTEND_URL}/checkout/success",
#             "failure": f"{settings.FRONTEND_URL}/checkout/failure",
#             "pending": f"{settings.FRONTEND_URL}/checkout/pending",
#         },
#         "auto_return": "approved",
#         "external_reference": str(venta.id),
#     }
#     # Guardar el external_reference en la venta
#     venta.external_reference = str(venta.id)
#     venta.save(update_fields=["external_reference"])
#     try:
#         preference_response = sdk.preference().create(preference_data)
#         print('=== Mercado Pago response ===')
#         print(preference_response)
#         init_point = preference_response["response"].get("init_point")
#         return Response({"init_point": init_point})
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)

@csrf_exempt
@api_view(['POST'])
def mercadopago_webhook(request):
    """
    Webhook para recibir notificaciones de Mercado Pago.
    Actualiza la venta y descuenta stock si el pago es aprobado.
    """
    import requests
    import os
    data = request.data
    payment_id = data.get('data', {}).get('id') or data.get('id')
    if not payment_id:
        return Response({'error': 'No payment id'}, status=400)
    access_token = getattr(settings, 'MERCADOPAGO_ACCESS_TOKEN', os.environ.get('MERCADOPAGO_ACCESS_TOKEN'))
    url = f'https://api.mercadopago.com/v1/payments/{payment_id}'
    headers = {'Authorization': f'Bearer {access_token}'}
    resp = requests.get(url, headers=headers)
    if resp.status_code != 200:
        return Response({'error': 'No se pudo consultar el pago'}, status=400)
    pago = resp.json()
    if pago.get('status') == 'approved':
        external_reference = pago.get('external_reference')
        from .models import Venta
        venta = Venta.objects.filter(external_reference=external_reference).first()
        if venta and venta.estado != 'completada':
            venta.estado = 'completada'
            venta.save()
            # ✅ El descuento de stock ya se realizó cuando se crearon los items
            # No es necesario duplicar la lógica aquí
            return Response({'status': 'venta actualizada'})
        return Response({'status': 'pago aprobado, pero venta no encontrada o ya completada'})
    return Response({'status': f'ignorado, status={pago.get("status")}'} )
