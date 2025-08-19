from django.contrib import admin
from .models import Pedido, ItemPedido, HistorialPedido, EstadoPedido, Abono

@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = ['numero_pedido', 'cliente', 'tipo_venta', 'estado_pago', 'estado_pedido', 'fecha_creacion', 'total_pedido']
    list_filter = ['tipo_venta', 'estado_pago', 'estado_pedido', 'fecha_creacion']
    search_fields = ['numero_pedido', 'cliente__nombre', 'cliente__email']
    readonly_fields = ['numero_pedido', 'fecha_creacion']
    date_hierarchy = 'fecha_creacion'
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('numero_pedido', 'cliente', 'venta', 'tipo_venta')
        }),
        ('Estados', {
            'fields': ('estado_pago', 'estado_pedido')
        }),
        ('Información de Entrega', {
            'fields': ('direccion_entrega', 'telefono_contacto', 'instrucciones_entrega')
        }),
        ('Fechas', {
            'fields': ('fecha_creacion', 'fecha_confirmacion', 'fecha_envio', 'fecha_entrega')
        }),
        ('Información Adicional', {
            'fields': ('notas', 'metodo_pago', 'referencia_pago')
        }),
        ('Seguimiento', {
            'fields': ('codigo_seguimiento', 'empresa_envio')
        }),
    )

@admin.register(ItemPedido)
class ItemPedidoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'producto', 'cantidad', 'precio_unitario', 'subtotal']
    list_filter = ['pedido__estado_pedido']
    search_fields = ['pedido__numero_pedido', 'producto__nombre']

@admin.register(HistorialPedido)
class HistorialPedidoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'estado_anterior', 'estado_nuevo', 'fecha_cambio', 'usuario']
    list_filter = ['estado_nuevo', 'fecha_cambio']
    search_fields = ['pedido__numero_pedido']
    readonly_fields = ['fecha_cambio']

@admin.register(EstadoPedido)
class EstadoPedidoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'estado', 'fecha_cambio', 'usuario', 'activo']
    list_filter = ['estado', 'activo', 'fecha_cambio']
    search_fields = ['pedido__numero_pedido']
    readonly_fields = ['fecha_cambio']
    date_hierarchy = 'fecha_cambio'
    
    fieldsets = (
        ('Información del Estado', {
            'fields': ('pedido', 'estado', 'activo')
        }),
        ('Detalles', {
            'fields': ('notas', 'usuario', 'fecha_cambio')
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editando objeto existente
            return self.readonly_fields + ('pedido',)
        return self.readonly_fields

@admin.register(Abono)
class AbonoAdmin(admin.ModelAdmin):
    list_display = ['pedido', 'monto', 'metodo_pago', 'estado_abono', 'fecha_abono', 'usuario']
    list_filter = ['estado_abono', 'metodo_pago', 'fecha_abono']
    search_fields = ['pedido__numero_pedido', 'referencia_pago']
    readonly_fields = ['fecha_abono', 'fecha_confirmacion']
    date_hierarchy = 'fecha_abono'
    
    fieldsets = (
        ('Información del Abono', {
            'fields': ('pedido', 'monto', 'metodo_pago', 'estado_abono')
        }),
        ('Detalles del Pago', {
            'fields': ('referencia_pago', 'comprobante', 'notas')
        }),
        ('Fechas', {
            'fields': ('fecha_abono', 'fecha_confirmacion')
        }),
        ('Usuario', {
            'fields': ('usuario',)
        }),
    )
    
    def get_readonly_fields(self, request, obj=None):
        if obj:  # Editando objeto existente
            return self.readonly_fields + ('pedido', 'monto')
        return self.readonly_fields