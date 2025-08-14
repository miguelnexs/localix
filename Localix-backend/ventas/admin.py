from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum, Count
from django.utils.translation import gettext_lazy as _
from .models import Cliente, Venta, ItemVenta

@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = [
        'nombre', 
        'email', 
        'telefono', 
        'tipo_documento', 
        'numero_documento',
        'fecha_registro',
        'activo',
        'total_ventas',
        'monto_total_compras'
    ]
    
    list_filter = [
        'activo',
        'tipo_documento',
        'fecha_registro',
    ]
    
    search_fields = [
        'nombre',
        'email',
        'telefono',
        'numero_documento',
    ]
    
    readonly_fields = [
        'fecha_registro',
        'total_ventas',
        'monto_total_compras'
    ]
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'email', 'telefono')
        }),
        ('Documentación', {
            'fields': ('tipo_documento', 'numero_documento')
        }),
        ('Dirección', {
            'fields': ('direccion',)
        }),
        ('Estado', {
            'fields': ('activo',)
        }),
        ('Información del Sistema', {
            'fields': ('fecha_registro', 'total_ventas', 'monto_total_compras'),
            'classes': ('collapse',)
        }),
    )
    
    def total_ventas(self, obj):
        """Muestra el total de ventas del cliente"""
        count = obj.ventas.count()
        return format_html(
            '<span style="color: {};">{}</span>',
            'green' if count > 0 else 'gray',
            count
        )
    total_ventas.short_description = 'Total Ventas'
    
    def monto_total_compras(self, obj):
        """Muestra el monto total de compras del cliente"""
        total = obj.ventas.aggregate(total=Sum('total'))['total'] or 0
        return format_html(
            '<span style="color: green; font-weight: bold;">S/ {}</span>',
            f"{float(total):.2f}"
        )
    monto_total_compras.short_description = 'Total Compras'

class ItemVentaInline(admin.TabularInline):
    model = ItemVenta
    extra = 0
    readonly_fields = ['subtotal', 'precio_unitario']
    fields = ['producto', 'variante', 'cantidad', 'precio_unitario', 'descuento_item', 'subtotal']

@admin.register(Venta)
class VentaAdmin(admin.ModelAdmin):
    list_display = [
        'numero_venta',
        'get_cliente_display',
        'fecha_venta',
        'subtotal',
        'descuento',
        'total',
        'estado',
        'metodo_pago',
        'vendedor'
    ]
    
    list_filter = [
        'estado',
        'metodo_pago',
        'fecha_venta',
        'cliente',
    ]
    
    search_fields = [
        'numero_venta',
        'cliente__nombre',
        'cliente_nombre',
        'vendedor',
    ]
    
    readonly_fields = [
        'numero_venta',
        'fecha_venta',
        'subtotal',
        'total',
        'get_cliente_display'
    ]
    
    fieldsets = (
        ('Información de la Venta', {
            'fields': ('numero_venta', 'fecha_venta', 'estado')
        }),
        ('Cliente', {
            'fields': ('cliente', 'cliente_nombre', 'get_cliente_display')
        }),
        ('Totales', {
            'fields': ('subtotal', 'descuento', 'total')
        }),
        ('Pago y Vendedor', {
            'fields': ('metodo_pago', 'vendedor')
        }),
        ('Observaciones', {
            'fields': ('observaciones',),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ItemVentaInline]
    
    def get_cliente_display(self, obj):
        """Muestra el nombre del cliente de forma legible"""
        if obj.cliente:
            return format_html(
                '<span style="color: blue;">{}</span>',
                obj.cliente.nombre
            )
        return format_html(
            '<span style="color: orange;">{}</span>',
            obj.cliente_nombre or "Cliente anónimo"
        )
    get_cliente_display.short_description = 'Cliente'
    
    def get_queryset(self, request):
        """Optimiza las consultas incluyendo el cliente"""
        return super().get_queryset(request).select_related('cliente')
    
    def has_add_permission(self, request):
        """Permite crear ventas desde el admin"""
        return True
    
    def has_change_permission(self, request, obj=None):
        """Permite editar ventas desde el admin"""
        return True
    
    def has_delete_permission(self, request, obj=None):
        """Permite eliminar ventas desde el admin"""
        return True

@admin.register(ItemVenta)
class ItemVentaAdmin(admin.ModelAdmin):
    list_display = [
        'venta',
        'producto',
        'variante',
        'cantidad',
        'precio_unitario',
        'descuento_item',
        'subtotal'
    ]
    
    list_filter = [
        'venta__estado',
        'producto',
        'variante',
    ]
    
    search_fields = [
        'venta__numero_venta',
        'producto__nombre',
        'variante__nombre',
    ]
    
    readonly_fields = ['subtotal', 'precio_unitario']
    
    fieldsets = (
        ('Venta', {
            'fields': ('venta',)
        }),
        ('Producto', {
            'fields': ('producto', 'variante')
        }),
        ('Cantidad y Precio', {
            'fields': ('cantidad', 'precio_unitario', 'descuento_item')
        }),
        ('Total', {
            'fields': ('subtotal',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimiza las consultas incluyendo venta, producto y variante"""
        return super().get_queryset(request).select_related('venta', 'producto', 'variante')
