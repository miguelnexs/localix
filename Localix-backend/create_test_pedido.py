#!/usr/bin/env python3
"""
Script para crear un pedido de prueba
"""

import os
import sys
import django
from datetime import datetime

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from pedidos.models import Pedido, ItemPedido
from productos.models import Producto
from ventas.models import Venta, Cliente

User = get_user_model()

def create_test_pedido():
    """Crear un pedido de prueba"""
    print("🚀 Creando pedido de prueba...")
    
    try:
        # Obtener o crear usuario
        user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@example.com',
                'is_staff': True,
                'is_superuser': True
            }
        )
        if created:
            user.set_password('admin123')
            user.save()
            print("✅ Usuario admin creado")
        else:
            print("✅ Usuario admin encontrado")
        
        # Obtener o crear cliente
        cliente, created = Cliente.objects.get_or_create(
            nombre='Cliente de Prueba',
            defaults={
                'email': 'cliente@example.com',
                'telefono': '123456789',
                'direccion': 'Dirección de prueba'
            }
        )
        if created:
            print("✅ Cliente de prueba creado")
        else:
            print("✅ Cliente de prueba encontrado")
        
        # Obtener o crear venta
        venta, created = Venta.objects.get_or_create(
            numero_venta='V001',
            defaults={
                'cliente': cliente,
                'total': 100.00,
                'metodo_pago': 'efectivo',
                'estado': 'completada'
            }
        )
        if created:
            print("✅ Venta de prueba creada")
        else:
            print("✅ Venta de prueba encontrada")
        
        # Obtener productos existentes
        productos = Producto.objects.all()
        if not productos.exists():
            print("❌ No hay productos en la base de datos")
            return None
        
        # Crear pedido
        pedido, created = Pedido.objects.get_or_create(
            numero_pedido='P001',
            defaults={
                'cliente': cliente,
                'venta': venta,
                'tipo_venta': 'fisica',
                'estado_pago': 'pagado',
                'estado_pedido': 'pendiente',
                'notas': 'Pedido de prueba creado automáticamente'
            }
        )
        
        if created:
            print("✅ Pedido de prueba creado")
            
            # Crear items del pedido
            for i, producto in enumerate(productos[:2]):  # Solo los primeros 2 productos
                item = ItemPedido.objects.create(
                    pedido=pedido,
                    producto=producto,
                    cantidad=1,
                    precio_unitario=producto.precio,
                    subtotal=producto.precio
                )
                print(f"✅ Item creado: {producto.nombre}")
            
            return pedido
        else:
            print("✅ Pedido de prueba encontrado")
            return pedido
            
    except Exception as e:
        print(f"❌ Error creando pedido de prueba: {e}")
        return None

def main():
    """Función principal"""
    print("=" * 50)
    pedido = create_test_pedido()
    
    if pedido:
        print(f"\n📦 Pedido creado exitosamente:")
        print(f"   ID: {pedido.id}")
        print(f"   Número: {pedido.numero_pedido}")
        print(f"   Cliente: {pedido.cliente.nombre}")
        print(f"   Estado: {pedido.estado_pedido}")
        print(f"   Total: ${pedido.total_pedido}")
        print(f"   Items: {pedido.items.count()}")
    else:
        print("❌ No se pudo crear el pedido de prueba")
    
    print("=" * 50)

if __name__ == '__main__':
    main()
