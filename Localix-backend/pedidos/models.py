from django.db import models
from django.conf import settings
from ventas.models import Cliente, Venta
from productos.models import Producto, ColorProducto

class Pedido(models.Model):
    ESTADO_PAGO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('en_proceso', 'En Proceso'),
        ('cancelado', 'Cancelado'),
    ]
    
    TIPO_VENTA_CHOICES = [
        ('fisica', 'Venta Física'),
        ('digital', 'Venta Digital'),
    ]
    
    ESTADO_PEDIDO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('en_preparacion', 'En Preparación'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    # Campo para multi-tenancy
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        verbose_name="Usuario propietario",
        help_text="Usuario que posee este pedido"
    )

    # Información básica
    numero_pedido = models.CharField(max_length=20)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE, related_name='pedidos')
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE, related_name='pedido')
    
    # Tipo de venta y estados
    tipo_venta = models.CharField(max_length=10, choices=TIPO_VENTA_CHOICES, default='fisica')
    estado_pago = models.CharField(max_length=15, choices=ESTADO_PAGO_CHOICES, default='pendiente')
    estado_pedido = models.CharField(max_length=20, choices=ESTADO_PEDIDO_CHOICES, default='pendiente')
    
    # Información de entrega
    direccion_entrega = models.TextField(blank=True)
    telefono_contacto = models.CharField(max_length=20, blank=True)
    instrucciones_entrega = models.TextField(blank=True)
    
    # Fechas importantes
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_confirmacion = models.DateTimeField(null=True, blank=True)
    fecha_envio = models.DateTimeField(null=True, blank=True)
    fecha_entrega = models.DateTimeField(null=True, blank=True)
    
    # Información adicional
    notas = models.TextField(blank=True)
    metodo_pago = models.CharField(max_length=50, blank=True)
    referencia_pago = models.CharField(max_length=100, blank=True)
    
    # Campos para seguimiento
    codigo_seguimiento = models.CharField(max_length=50, blank=True)
    empresa_envio = models.CharField(max_length=100, blank=True)
    
    class Meta:
        ordering = ['-fecha_creacion']
        verbose_name = 'Pedido'
        verbose_name_plural = 'Pedidos'
        indexes = [
            models.Index(fields=['usuario', 'numero_pedido']),
            models.Index(fields=['usuario', 'fecha_creacion']),
            models.Index(fields=['usuario', 'estado_pedido']),
        ]
    
    def __str__(self):
        return f"Pedido {self.numero_pedido} - {self.cliente.nombre}"
    
    def save(self, *args, **kwargs):
        if not self.numero_pedido:
            # Generar número de pedido automático
            ultimo_pedido = Pedido.objects.order_by('-id').first()
            if ultimo_pedido:
                ultimo_numero = int(ultimo_pedido.numero_pedido.split('-')[1])
                self.numero_pedido = f"PED-{ultimo_numero + 1:06d}"
            else:
                self.numero_pedido = "PED-000001"
        
        # Establecer estado de pago según tipo de venta
        if self.tipo_venta == 'fisica' and self.estado_pago == 'pendiente':
            self.estado_pago = 'pagado'
        
        super().save(*args, **kwargs)
    
    @property
    def total_pedido(self):
        return self.venta.total if self.venta else 0
    
    @property
    def productos_count(self):
        return self.venta.items.count() if self.venta else 0

class ItemPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    color = models.ForeignKey(ColorProducto, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Color específico")
    
    def save(self, *args, **kwargs):
        if not self.subtotal:
            self.subtotal = self.cantidad * self.precio_unitario
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.producto.nombre} x {self.cantidad}"

class HistorialPedido(models.Model):
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='historial')
    estado_anterior = models.CharField(max_length=20, blank=True)
    estado_nuevo = models.CharField(max_length=20)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    notas = models.TextField(blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        ordering = ['-fecha_cambio']
    
    def __str__(self):
        return f"{self.pedido.numero_pedido} - {self.estado_nuevo}" 