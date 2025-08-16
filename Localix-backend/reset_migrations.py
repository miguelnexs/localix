#!/usr/bin/env python3
"""
Script para resetear migraciones y empezar de nuevo
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.db import connection

def reset_migrations():
    """Resetear migraciones"""
    print("🔄 Reseteando migraciones...")
    
    try:
        with connection.cursor() as cursor:
            # Eliminar todas las migraciones aplicadas
            print("1️⃣ Eliminando registros de migraciones...")
            cursor.execute("DELETE FROM django_migrations WHERE app IN ('categorias', 'productos', 'ventas', 'pedidos')")
            print(f"   ✅ Migraciones eliminadas")
            
            # Eliminar todas las tablas
            print("2️⃣ Eliminando tablas...")
            tables_to_drop = [
                'pedidos_historialpedido',
                'pedidos_itempedido', 
                'pedidos_pedido',
                'ventas_itemventa',
                'ventas_venta',
                'ventas_cliente',
                'productos_imagenproducto',
                'productos_varianteproducto',
                'productos_colorproducto',
                'productos_producto',
                'categorias_categoriaproducto'
            ]
            
            for table in tables_to_drop:
                try:
                    cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
                    print(f"   ✅ Tabla {table} eliminada")
                except Exception as e:
                    print(f"   ⚠️ Error eliminando {table}: {e}")
            
            print("\n✅ Migraciones reseteadas exitosamente")
            return True
            
    except Exception as e:
        print(f"❌ Error reseteando migraciones: {e}")
        return False

def main():
    """Función principal"""
    print("=" * 60)
    print("🔄 RESETEADOR DE MIGRACIONES")
    print("=" * 60)
    print("⚠️  ADVERTENCIA: Esto eliminará todas las migraciones")
    print("⚠️  y tablas de datos. Solo se mantendrán usuarios.")
    print("=" * 60)
    
    # Confirmación
    confirm = input("¿Estás seguro de que quieres continuar? (escribe 'SI' para confirmar): ")
    
    if confirm.upper() != 'SI':
        print("❌ Operación cancelada")
        return
    
    success = reset_migrations()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ Migraciones reseteadas. Ahora puedes ejecutar:")
        print("   python manage.py makemigrations")
        print("   python manage.py migrate")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ Error al resetear migraciones")
        print("=" * 60)

if __name__ == '__main__':
    main()
