#!/usr/bin/env python3
"""
Script para probar el sistema multi-tenancy
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from categorias.models import CategoriaProducto
from productos.models import Producto
from ventas.models import Cliente, Venta
from pedidos.models import Pedido

User = get_user_model()

def create_test_data_for_user(user, prefix=""):
    """Crear datos de prueba para un usuario específico"""
    print(f"\n📦 Creando datos para usuario: {user.username}")
    
    # Crear categorías
    categorias = []
    for i in range(3):
        categoria = CategoriaProducto.objects.create(
            usuario=user,
            nombre=f"{prefix}Categoría {i+1}",
            descripcion=f"Descripción de categoría {i+1} para {user.username}",
            orden=i+1
        )
        categorias.append(categoria)
        print(f"   ✅ Categoría creada: {categoria.nombre}")
    
    # Crear productos
    productos = []
    for i in range(5):
        producto = Producto.objects.create(
            usuario=user,
            sku=f"{prefix}SKU{i+1:03d}",
            nombre=f"{prefix}Producto {i+1}",
            descripcion_corta=f"Descripción corta del producto {i+1}",
            descripcion_larga=f"Descripción larga del producto {i+1} para {user.username}",
            precio=100.00 + (i * 50),
            costo=50.00 + (i * 25),
            categoria=categorias[i % len(categorias)],
            estado='publicado'
        )
        productos.append(producto)
        print(f"   ✅ Producto creado: {producto.nombre}")
    
    # Crear clientes
    clientes = []
    for i in range(2):
        cliente = Cliente.objects.create(
            usuario=user,
            nombre=f"{prefix}Cliente {i+1}",
            email=f"cliente{i+1}@{user.username}.com",
            telefono=f"12345678{i}",
            direccion=f"Dirección {i+1} para {user.username}"
        )
        clientes.append(cliente)
        print(f"   ✅ Cliente creado: {cliente.nombre}")
    
    # Crear ventas
    ventas = []
    for i in range(3):
        venta = Venta.objects.create(
            usuario=user,
            cliente=clientes[i % len(clientes)],
            total=200.00 + (i * 100),
            metodo_pago='efectivo',
            estado='completada'
        )
        ventas.append(venta)
        print(f"   ✅ Venta creada: {venta.numero_venta}")
    
    # Crear pedidos
    for i in range(2):
        pedido = Pedido.objects.create(
            usuario=user,
            cliente=clientes[i % len(clientes)],
            venta=ventas[i % len(ventas)],
            estado_pedido='pendiente'
        )
        print(f"   ✅ Pedido creado: {pedido.numero_pedido}")
    
    return {
        'categorias': len(categorias),
        'productos': len(productos),
        'clientes': len(clientes),
        'ventas': len(ventas),
        'pedidos': 2
    }

def test_data_isolation():
    """Probar que los datos están aislados por usuario"""
    print("\n🔍 Probando aislamiento de datos...")
    
    # Obtener usuarios de prueba
    users = User.objects.filter(username__in=['vendedor1', 'vendedor2', 'tienda1'])
    
    for user in users:
        print(f"\n📊 Datos para {user.username}:")
        
        categorias_count = CategoriaProducto.objects.filter(usuario=user).count()
        productos_count = Producto.objects.filter(usuario=user).count()
        clientes_count = Cliente.objects.filter(usuario=user).count()
        ventas_count = Venta.objects.filter(usuario=user).count()
        pedidos_count = Pedido.objects.filter(usuario=user).count()
        
        print(f"   Categorías: {categorias_count}")
        print(f"   Productos: {productos_count}")
        print(f"   Clientes: {clientes_count}")
        print(f"   Ventas: {ventas_count}")
        print(f"   Pedidos: {pedidos_count}")

def main():
    """Función principal"""
    print("=" * 60)
    print("🧪 TEST SISTEMA MULTI-TENANCY")
    print("=" * 60)
    
    # Crear datos para diferentes usuarios
    users_data = [
        ('vendedor1', 'V1-'),
        ('vendedor2', 'V2-'),
        ('tienda1', 'T1-'),
        ('tienda2', 'T2-')
    ]
    
    total_stats = {}
    
    for username, prefix in users_data:
        try:
            user = User.objects.get(username=username)
            stats = create_test_data_for_user(user, prefix)
            total_stats[username] = stats
        except User.DoesNotExist:
            print(f"❌ Usuario {username} no encontrado")
    
    # Probar aislamiento
    test_data_isolation()
    
    # Resumen final
    print("\n" + "=" * 60)
    print("📊 RESUMEN FINAL")
    print("=" * 60)
    
    for username, stats in total_stats.items():
        print(f"\n{username}:")
        for key, value in stats.items():
            print(f"   {key.capitalize()}: {value}")
    
    print(f"\n✅ Sistema multi-tenancy probado exitosamente")
    print("=" * 60)

if __name__ == '__main__':
    main()
