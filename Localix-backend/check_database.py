#!/usr/bin/env python3
"""
Script para verificar la estructura de la base de datos
"""

import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.db import connection

def check_table_structure():
    """Verificar la estructura de las tablas"""
    print("🔍 Verificando estructura de la base de datos...")
    
    tables_to_check = [
        'categorias_categoriaproducto',
        'productos_producto',
        'ventas_cliente',
        'ventas_venta',
        'pedidos_pedido'
    ]
    
    with connection.cursor() as cursor:
        for table in tables_to_check:
            print(f"\n📋 Tabla: {table}")
            try:
                # Verificar si la tabla existe
                cursor.execute(f"""
                    SELECT column_name, data_type, is_nullable
                    FROM information_schema.columns
                    WHERE table_name = '{table}'
                    ORDER BY ordinal_position;
                """)
                
                columns = cursor.fetchall()
                if columns:
                    print(f"   ✅ Tabla existe con {len(columns)} columnas:")
                    for col_name, data_type, is_nullable in columns:
                        nullable = "NULL" if is_nullable == "YES" else "NOT NULL"
                        print(f"      - {col_name}: {data_type} ({nullable})")
                else:
                    print(f"   ❌ Tabla no existe o no tiene columnas")
                    
            except Exception as e:
                print(f"   ❌ Error verificando tabla {table}: {e}")

def check_migrations():
    """Verificar el estado de las migraciones"""
    print("\n🔄 Verificando estado de migraciones...")
    
    with connection.cursor() as cursor:
        cursor.execute("""
            SELECT app, name, applied
            FROM django_migrations
            WHERE app IN ('categorias', 'productos', 'ventas', 'pedidos')
            ORDER BY app, applied;
        """)
        
        migrations = cursor.fetchall()
        if migrations:
            print("   Migraciones aplicadas:")
            for app, name, applied in migrations:
                print(f"      - {app}.{name} ({applied})")
        else:
            print("   ❌ No hay migraciones aplicadas")

def main():
    """Función principal"""
    print("=" * 60)
    print("🔍 VERIFICADOR DE BASE DE DATOS")
    print("=" * 60)
    
    check_table_structure()
    check_migrations()
    
    print("\n" + "=" * 60)
    print("✅ Verificación completada")
    print("=" * 60)

if __name__ == '__main__':
    main()
