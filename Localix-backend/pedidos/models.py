from django.db import models
from django.conf import settings
from django.utils import timezone
from ventas.models import Cliente, Venta, Reserva
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
        ('separado', 'Separado'),
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
    venta = models.OneToOneField(Venta, on_delete=models.CASCADE, related_name='pedido', null=True, blank=True)
    reserva = models.OneToOneField(Reserva, on_delete=models.CASCADE, related_name='pedido', null=True, blank=True)
    
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
    # Montos de separado
    monto_abono = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    monto_pendiente = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
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
                try:
                    # Intentar extraer el número del formato PED-XXXXXX
                    partes = ultimo_pedido.numero_pedido.split('-')
                    if len(partes) >= 2:
                        ultimo_numero = int(partes[1])
                        self.numero_pedido = f"PED-{ultimo_numero + 1:06d}"
                    else:
                        # Si no tiene el formato esperado, empezar desde 1
                        self.numero_pedido = "PED-000001"
                except (ValueError, IndexError):
                    # Si hay error al convertir a int o al dividir, empezar desde 1
                    self.numero_pedido = "PED-000001"
            else:
                self.numero_pedido = "PED-000001"
        
        # Establecer estado de pago según tipo de venta SOLO si hay venta asociada
        if self.venta and self.tipo_venta == 'fisica' and self.estado_pago == 'pendiente':
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

class EstadoPedido(models.Model):
    """
    Modelo para gestionar los estados de pedidos de forma independiente
    """
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('en_preparacion', 'En Preparación'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
        ('separado', 'Separado'),
    ]
    
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='estados')
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    fecha_cambio = models.DateTimeField(default=timezone.now)
    notas = models.TextField(blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    activo = models.BooleanField(default=True)  # Solo un estado puede estar activo
    
    class Meta:
        ordering = ['-fecha_cambio']
        verbose_name = 'Estado de Pedido'
        verbose_name_plural = 'Estados de Pedidos'
        indexes = [
            models.Index(fields=['pedido', 'activo']),
            models.Index(fields=['estado', 'fecha_cambio']),
        ]
    
    def save(self, *args, **kwargs):
        if self.activo:
            # Desactivar otros estados del mismo pedido
            EstadoPedido.objects.filter(pedido=self.pedido, activo=True).update(activo=False)
            # Actualizar el estado en el pedido principal
            self.pedido.estado_pedido = self.estado
            self.pedido.save()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.pedido.numero_pedido} - {self.get_estado_display()}"

class Abono(models.Model):
    """
    Modelo para gestionar los abonos/pagos parciales de pedidos
    """
    METODO_PAGO_CHOICES = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta de Crédito/Débito'),
        ('transferencia', 'Transferencia Bancaria'),
        ('cheque', 'Cheque'),
        ('paypal', 'PayPal'),
        ('otro', 'Otro'),
    ]
    
    ESTADO_ABONO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('confirmado', 'Confirmado'),
        ('rechazado', 'Rechazado'),
        ('cancelado', 'Cancelado'),
    ]
    
    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='abonos')
    monto = models.DecimalField(max_digits=12, decimal_places=2)
    fecha_abono = models.DateTimeField(default=timezone.now)
    metodo_pago = models.CharField(max_length=20, choices=METODO_PAGO_CHOICES)
    referencia_pago = models.CharField(max_length=100, blank=True)
    estado_abono = models.CharField(max_length=15, choices=ESTADO_ABONO_CHOICES, default='pendiente')
    notas = models.TextField(blank=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Campos adicionales para control
    fecha_confirmacion = models.DateTimeField(null=True, blank=True)
    comprobante = models.CharField(max_length=200, blank=True)  # Ruta del archivo de comprobante
    
    class Meta:
        ordering = ['-fecha_abono']
        verbose_name = 'Abono'
        verbose_name_plural = 'Abonos'
        indexes = [
            models.Index(fields=['pedido', 'estado_abono']),
            models.Index(fields=['fecha_abono']),
            models.Index(fields=['metodo_pago']),
        ]
    
    def save(self, *args, **kwargs):
        if self.estado_abono == 'confirmado' and not self.fecha_confirmacion:
            self.fecha_confirmacion = timezone.now()
        super().save(*args, **kwargs)
        
        # Actualizar montos en el pedido
        self.actualizar_montos_pedido()
    
    def actualizar_montos_pedido(self):
        """
        Actualiza los montos de abono y pendiente en el pedido
        """
        abonos_confirmados = self.pedido.abonos.filter(estado_abono='confirmado')
        total_abonado = sum(abono.monto for abono in abonos_confirmados)
        
        self.pedido.monto_abono = total_abonado
        self.pedido.monto_pendiente = self.pedido.total_pedido - total_abonado
        self.pedido.save()
    
    def __str__(self):
        return f"Abono {self.monto} - {self.pedido.numero_pedido}"