from django.db import models
from django.utils.translation import gettext_lazy as _
from decimal import Decimal
from django.core.validators import MinValueValidator
from productos.models import Producto, VarianteProducto, ColorProducto
from typing import TYPE_CHECKING, List, Optional, Union, cast

if TYPE_CHECKING:
    from django.db.models import QuerySet

class Cliente(models.Model):
    """
    Modelo para gestionar clientes
    """
    TIPO_DOCUMENTO_CHOICES = [
        ('dni', 'DNI'),
        ('ruc', 'RUC'),
        ('ce', 'Carné de Extranjería'),
        ('pasaporte', 'Pasaporte'),
    ]

    nombre = models.CharField(
        max_length=200,
        verbose_name=_("Nombre completo")
    )
    
    email = models.EmailField(
        blank=True,
        null=True,
        verbose_name=_("Correo electrónico")
    )
    
    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_("Teléfono")
    )
    
    tipo_documento = models.CharField(
        max_length=10,
        choices=TIPO_DOCUMENTO_CHOICES,
        default='dni',
        verbose_name=_("Tipo de documento")
    )
    
    numero_documento = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        verbose_name=_("Número de documento")
    )
    
    direccion = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Dirección")
    )
    
    fecha_registro = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Fecha de registro")
    )
    
    activo = models.BooleanField(
        default=True,
        verbose_name=_('Cliente activo')
    )

    class Meta:
        verbose_name = _("Cliente")
        verbose_name_plural = _("Clientes")
        ordering = ['-fecha_registro']
        indexes = [
            models.Index(fields=['nombre']),
            models.Index(fields=['email']),
            models.Index(fields=['numero_documento']),
        ]

    def __str__(self) -> str:
        return str(self.nombre)

class Venta(models.Model):
    """
    Modelo principal para las ventas
    """
    ESTADO_CHOICES = [
        ('pendiente', _('Pendiente')),
        ('completada', _('Completada')),
        ('cancelada', _('Cancelada')),
        ('reembolsada', _('Reembolsada')),
    ]

    METODO_PAGO_CHOICES = [
        ('efectivo', _('Efectivo')),
        ('tarjeta', _('Tarjeta de crédito/débito')),
        ('transferencia', _('Transferencia bancaria')),
        ('yape', _('Yape')),
        ('plin', _('Plin')),
        ('otro', _('Otro')),
    ]

    # Información básica
    numero_venta = models.CharField(
        max_length=20,
        unique=True,
        verbose_name=_("Número de venta")
    )
    
    fecha_venta = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_("Fecha de venta")
    )
    
    # Cliente
    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ventas',
        verbose_name=_("Cliente")
    )
    
    # Cliente anónimo
    cliente_nombre = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name=_("Nombre del cliente (venta anónima)")
    )
    
    # Totales
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Subtotal")
    )
    
    porcentaje_descuento = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Porcentaje de descuento"),
        help_text=_("Porcentaje de descuento aplicado a la venta (0-100)")
    )
    
    descuento = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Descuento")
    )
    
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Total")
    )
    
    # Estado y método de pago
    estado = models.CharField(
        max_length=12,
        choices=ESTADO_CHOICES,
        default='pendiente',
        verbose_name=_("Estado")
    )
    
    metodo_pago = models.CharField(
        max_length=15,
        choices=METODO_PAGO_CHOICES,
        default='efectivo',
        verbose_name=_("Método de pago")
    )
    
    # Observaciones
    observaciones = models.TextField(
        blank=True,
        null=True,
        verbose_name=_("Observaciones")
    )
    
    # Usuario que realizó la venta
    vendedor = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Vendedor")
    )

    # Referencia externa para pagos (ej: Mercado Pago)
    external_reference = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name=_("Referencia externa de pago")
    )

    def calcular_totales(self) -> None:
        """Calcula los totales de la venta"""
        items_queryset = self.items.all()
        subtotal_sum = sum(float(item.subtotal) for item in items_queryset)
        self.subtotal = Decimal(str(subtotal_sum))
        
        # Calcular descuento basado en el porcentaje
        if self.porcentaje_descuento and self.porcentaje_descuento > 0:
            self.descuento = (self.subtotal * self.porcentaje_descuento) / Decimal('100.00')
        else:
            self.descuento = Decimal('0.00')
        
        self.total = self.subtotal - self.descuento
        self.save(update_fields=['subtotal', 'descuento', 'total'])

    def get_cliente_display(self) -> str:
        """Retorna el nombre del cliente (registrado o anónimo)"""
        if self.cliente:
            return str(self.cliente.nombre)
        return str(self.cliente_nombre or "Cliente anónimo")

    class Meta:
        verbose_name = _("Venta")
        verbose_name_plural = _("Ventas")
        ordering = ['-fecha_venta']
        indexes = [
            models.Index(fields=['numero_venta']),
            models.Index(fields=['fecha_venta']),
            models.Index(fields=['estado']),
            models.Index(fields=['cliente']),
        ]

    def save(self, *args, **kwargs):
        """Genera automáticamente el número de venta si no existe"""
        if not self.numero_venta:
            # Buscar la última venta con formato correcto
            ultimo_venta = Venta.objects.order_by('-id').first()
            nuevo_numero = 1
            if ultimo_venta and ultimo_venta.numero_venta and '-' in ultimo_venta.numero_venta:
                try:
                    ultimo_numero = int(ultimo_venta.numero_venta.split('-')[1])
                    nuevo_numero = ultimo_numero + 1
                except (IndexError, ValueError):
                    pass  # Si el formato es incorrecto, empieza desde 1
            self.numero_venta = f"VEN-{nuevo_numero:06d}"
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return f"Venta {self.numero_venta} - {self.get_cliente_display()}"

class ItemVenta(models.Model):
    """
    Modelo para los items individuales de una venta
    """
    venta = models.ForeignKey(
        Venta,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name=_("Venta")
    )
    
    producto = models.ForeignKey(
        Producto,
        on_delete=models.CASCADE,
        verbose_name=_("Producto")
    )
    
    variante = models.ForeignKey(
        VarianteProducto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Variante")
    )
    
    # ✅ Nuevo campo para color específico
    color = models.ForeignKey(
        ColorProducto,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name=_("Color específico"),
        help_text=_("Color específico del producto vendido")
    )
    
    cantidad = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        verbose_name=_("Cantidad")
    )
    
    descuento_item = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        verbose_name=_("Descuento del item")
    )
    
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        verbose_name=_("Subtotal del item")
    )

    @property
    def precio_unitario(self):
        base = Decimal(str(self.producto.precio)) if self.producto else Decimal('0.00')
        if self.variante:
            return base + Decimal(str(self.variante.precio_extra))
        return base

    def calcular_subtotal(self) -> Decimal:
        """Calcula el subtotal del item"""
        precio_unitario = self.precio_unitario
        cantidad = Decimal(str(self.cantidad or 0))
        precio_total = precio_unitario * cantidad
        self.subtotal = precio_total - Decimal(str(self.descuento_item or 0))
        return self.subtotal

    def save(self, *args, **kwargs) -> None:
        self.calcular_subtotal()
        
        # ✅ Lógica de descuento de stock
        if self.pk is None:  # Solo si es un nuevo item
            producto = self.producto
            if producto and producto.gestion_stock:
                if self.color:
                    # Descontar stock del color específico
                    color = self.color
                    if color.stock >= self.cantidad:
                        color.stock = max(0, color.stock - self.cantidad)
                        color.save()
                        print(f"🔄 Stock del color {color.nombre} actualizado: {color.stock}")
                    else:
                        raise ValueError(f"Stock insuficiente para el color {color.nombre}. Disponible: {color.stock}, Solicitado: {self.cantidad}")
                elif self.variante:
                    # Descontar stock de la variante
                    variante = self.variante
                    if variante.stock >= self.cantidad:
                        variante.stock = max(0, variante.stock - self.cantidad)
                        variante.save()
                        print(f"🔄 Stock de la variante {variante.nombre} actualizado: {variante.stock}")
                    else:
                        raise ValueError(f"Stock insuficiente para la variante {variante.nombre}. Disponible: {variante.stock}, Solicitado: {self.cantidad}")
                else:
                    # Para productos sin color específico, verificar si tiene colores configurados
                    colores_activos = producto.colores.filter(activo=True)
                    if colores_activos.exists():
                        # Si el producto tiene colores, no permitir venta sin especificar color
                        raise ValueError(f"El producto {producto.nombre} tiene colores configurados. Debe especificar un color específico.")
                    else:
                        # Solo descontar del stock general si no tiene colores configurados
                        if producto.stock >= self.cantidad:
                            producto.stock = max(0, producto.stock - self.cantidad)
                            producto.save(update_fields=['stock'])
                            print(f"🔄 Stock del producto {producto.nombre} actualizado: {producto.stock}")
                        else:
                            raise ValueError(f"Stock insuficiente para el producto {producto.nombre}. Disponible: {producto.stock}, Solicitado: {self.cantidad}")
                
                # Actualizar contador de vendidos
                producto.vendidos += self.cantidad
                producto.save(update_fields=['vendidos'])
                
                # Actualizar stock total del producto
                producto.actualizar_stock_total()
        
        super().save(*args, **kwargs)
        
        # Actualiza los totales de la venta
        if hasattr(self.venta, 'calcular_totales'):
            self.venta.calcular_totales()  # type: ignore[attr-defined]

    class Meta:
        verbose_name = _("Item de venta")
        verbose_name_plural = _("Items de venta")
        ordering = ['id']

    def __str__(self) -> str:
        producto_nombre = str(self.producto.nombre) if self.producto else "Producto desconocido"
        venta_numero = str(self.venta.numero_venta) if self.venta else "Venta desconocida"
        color_info = f" - {self.color.nombre}" if self.color else ""
        return f"{producto_nombre}{color_info} x {self.cantidad} - {venta_numero}"
