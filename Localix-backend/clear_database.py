#!/usr/bin/env python3
"""
Script para limpiar todos los datos de la base de datos
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.db import connection
from django.contrib.auth import get_user_model
from pedidos.models import Pedido, ItemPedido, HistorialPedido
from productos.models import Producto, ColorProducto, ImagenProducto, VarianteProducto
from ventas.models import Venta, Cliente, ItemVenta
from categorias.models import CategoriaProducto

User = get_user_model()

def clear_database():
    """Limpiar todos los datos de la base de datos"""
    print("🗑️ Limpiando base de datos...")
    
    try:
        # Eliminar en orden para evitar problemas de foreign keys
        
        # 1. Historial de pedidos
        print("1️⃣ Eliminando historial de pedidos...")
        HistorialPedido.objects.all().delete()
        print(f"   ✅ Historial eliminado")
        
        # 2. Items de pedidos
        print("2️⃣ Eliminando items de pedidos...")
        ItemPedido.objects.all().delete()
        print(f"   ✅ Items de pedidos eliminados")
        
        # 3. Pedidos
        print("3️⃣ Eliminando pedidos...")
        Pedido.objects.all().delete()
        print(f"   ✅ Pedidos eliminados")
        
        # 4. Items de ventas
        print("4️⃣ Eliminando items de ventas...")
        ItemVenta.objects.all().delete()
        print(f"   ✅ Items de ventas eliminados")
        
        # 5. Ventas
        print("5️⃣ Eliminando ventas...")
        Venta.objects.all().delete()
        print(f"   ✅ Ventas eliminadas")
        
        # 6. Clientes
        print("6️⃣ Eliminando clientes...")
        Cliente.objects.all().delete()
        print(f"   ✅ Clientes eliminados")
        
        # 7. Imágenes de productos
        print("7️⃣ Eliminando imágenes de productos...")
        ImagenProducto.objects.all().delete()
        print(f"   ✅ Imágenes eliminadas")
        
        # 8. Variantes de productos
        print("8️⃣ Eliminando variantes de productos...")
        VarianteProducto.objects.all().delete()
        print(f"   ✅ Variantes eliminadas")
        
        # 9. Colores de productos
        print("9️⃣ Eliminando colores de productos...")
        ColorProducto.objects.all().delete()
        print(f"   ✅ Colores eliminados")
        
        # 10. Productos
        print("🔟 Eliminando productos...")
        Producto.objects.all().delete()
        print(f"   ✅ Productos eliminados")
        
        # 11. Categorías
        print("1️⃣1️⃣ Eliminando categorías...")
        CategoriaProducto.objects.all().delete()
        print(f"   ✅ Categorías eliminadas")
        
        # 12. Usuarios (excepto superusuarios)
        print("1️⃣2️⃣ Eliminando usuarios no admin...")
        non_admin_users = User.objects.filter(is_superuser=False)
        count = non_admin_users.count()
        non_admin_users.delete()
        print(f"   ✅ {count} usuarios no admin eliminados")
        
        print("\n✅ Base de datos limpiada exitosamente")
        
        # Mostrar estadísticas finales
        print("\n📊 Estadísticas finales:")
        print(f"   Usuarios: {User.objects.count()}")
        print(f"   Categorías: {CategoriaProducto.objects.count()}")
        print(f"   Productos: {Producto.objects.count()}")
        print(f"   Clientes: {Cliente.objects.count()}")
        print(f"   Ventas: {Venta.objects.count()}")
        print(f"   Pedidos: {Pedido.objects.count()}")
        
    except Exception as e:
        print(f"❌ Error limpiando base de datos: {e}")
        return False
    
    return True

def main():
    """Función principal"""
    print("=" * 60)
    print("🗑️ LIMPIADOR DE BASE DE DATOS")
    print("=" * 60)
    print("⚠️  ADVERTENCIA: Esto eliminará TODOS los datos")
    print("⚠️  Solo se mantendrán los superusuarios")
    print("=" * 60)
    
    # Confirmación
    confirm = input("¿Estás seguro de que quieres continuar? (escribe 'SI' para confirmar): ")
    
    if confirm.upper() != 'SI':
        print("❌ Operación cancelada")
        return
    
    success = clear_database()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Base de datos limpiada. Lista para implementar multi-tenancy")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ Error al limpiar la base de datos")
        print("=" * 60)

if __name__ == '__main__':
    main()
