#!/usr/bin/env python3
"""
Ejemplo de uso de los serializers mejorados de imágenes de colores
"""

import requests
import json

# Configuración
API_BASE_URL = 'http://127.0.0.1:8000/api'

def ejemplo_crear_imagen_color():
    """Ejemplo de cómo crear una imagen para un color específico"""
    
    # Datos de la imagen
    data = {
        'color': 1,  # ID del color
        'descripcion': 'Vista frontal del producto en azul',
        'orden': 1,
        'es_principal': True
    }
    
    # Archivo de imagen
    files = {
        'imagen': open('imagen_ejemplo.jpg', 'rb')
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/imagenes-color/',
            data=data,
            files=files
        )
        
        if response.status_code == 201:
            imagen_creada = response.json()
            print("✅ Imagen creada exitosamente:")
            print(f"   - ID: {imagen_creada['id']}")
            print(f"   - Color: {imagen_creada['color_nombre']} ({imagen_creada['color_codigo']})")
            print(f"   - Producto: {imagen_creada['producto_nombre']} ({imagen_creada['producto_sku']})")
            print(f"   - URL: {imagen_creada['imagen_url']}")
            print(f"   - Tamaño: {imagen_creada['tamaño_archivo']}")
            print(f"   - Dimensiones: {imagen_creada['dimensiones']}")
            
            # Información del color
            if imagen_creada['color_info']:
                color_info = imagen_creada['color_info']
                print(f"   - Color ID: {color_info['id']}")
                print(f"   - Stock del color: {color_info['stock']}")
                print(f"   - Total imágenes del color: {color_info['total_imagenes']}")
                print(f"   - Es principal: {color_info['es_principal']}")
            
            # Información del producto
            if imagen_creada['producto_info']:
                producto_info = imagen_creada['producto_info']
                print(f"   - Producto ID: {producto_info['id']}")
                print(f"   - Precio: {producto_info['precio']}")
                print(f"   - Estado: {producto_info['estado']}")
                print(f"   - Categoría: {producto_info['categoria']}")
            
        else:
            print(f"❌ Error al crear imagen: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_obtener_imagen_detalle():
    """Ejemplo de cómo obtener información detallada de una imagen"""
    
    imagen_id = 1
    
    try:
        response = requests.get(f'{API_BASE_URL}/imagenes-color/{imagen_id}/')
        
        if response.status_code == 200:
            imagen = response.json()
            print("📸 Información detallada de la imagen:")
            print(f"   - ID: {imagen['id']}")
            print(f"   - Archivo: {imagen['nombre_archivo']}")
            print(f"   - Descripción: {imagen['descripcion']}")
            print(f"   - Orden: {imagen['orden']}")
            print(f"   - Es principal: {imagen['es_principal']}")
            print(f"   - URL: {imagen['imagen_url']}")
            print(f"   - Thumbnail: {imagen['thumbnail_url']}")
            print(f"   - Tamaño: {imagen['tamaño_archivo']}")
            print(f"   - Dimensiones: {imagen['dimensiones']}")
            
            # Información del color
            if imagen['color_info']:
                color_info = imagen['color_info']
                print(f"\n🎨 Información del color:")
                print(f"   - ID: {color_info['id']}")
                print(f"   - Nombre: {color_info['nombre']}")
                print(f"   - Código: {color_info['codigo_color']}")
                print(f"   - Stock: {color_info['stock']}")
                print(f"   - Orden: {color_info['orden']}")
                print(f"   - Es principal del producto: {color_info['es_principal']}")
                print(f"   - Total imágenes: {color_info['total_imagenes']}")
                print(f"   - Display: {color_info['color_display']}")
            
            # Información del producto
            if imagen['producto_info']:
                producto_info = imagen['producto_info']
                print(f"\n📦 Información del producto:")
                print(f"   - ID: {producto_info['id']}")
                print(f"   - Nombre: {producto_info['nombre']}")
                print(f"   - SKU: {producto_info['sku']}")
                print(f"   - Precio: {producto_info['precio']}")
                print(f"   - Estado: {producto_info['estado']}")
                print(f"   - Categoría: {producto_info['categoria']}")
                if producto_info['imagen_principal_url']:
                    print(f"   - Imagen principal del producto: {producto_info['imagen_principal_url']}")
            
            # Información adicional (si está disponible)
            if 'color_stock_disponible' in imagen:
                print(f"\n📊 Información adicional:")
                print(f"   - Stock disponible: {imagen['color_stock_disponible']}")
                print(f"   - Es principal del producto: {imagen['color_es_principal_producto']}")
                print(f"   - Total imágenes del color: {imagen['color_total_imagenes']}")
                if imagen['producto_url']:
                    print(f"   - URL del producto: {imagen['producto_url']}")
                if imagen['producto_categoria_completa']:
                    cat = imagen['producto_categoria_completa']
                    print(f"   - Categoría completa: {cat['nombre']} ({cat['slug']})")
            
        else:
            print(f"❌ Error al obtener imagen: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_subir_multiples_imagenes():
    """Ejemplo de cómo subir múltiples imágenes a un color"""
    
    color_id = 1
    
    # Archivos de imagen
    files = [
        ('imagenes', open('imagen1.jpg', 'rb')),
        ('imagenes', open('imagen2.jpg', 'rb')),
        ('imagenes', open('imagen3.jpg', 'rb'))
    ]
    
    data = {
        'color_id': color_id
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/imagenes-color/upload_multiple/',
            data=data,
            files=files
        )
        
        if response.status_code == 201:
            resultado = response.json()
            print("✅ Múltiples imágenes subidas exitosamente:")
            print(f"   - Mensaje: {resultado['mensaje']}")
            print(f"   - Imágenes creadas: {resultado['imagenes_creadas']}")
            
            if resultado['errores']:
                print(f"   - Errores: {resultado['errores']}")
            
            # Información del color
            if resultado['color_info']:
                color_info = resultado['color_info']
                print(f"\n🎨 Información del color:")
                print(f"   - ID: {color_info['id']}")
                print(f"   - Nombre: {color_info['nombre']}")
                print(f"   - Código: {color_info['codigo_color']}")
                print(f"   - Total imágenes: {color_info['total_imagenes']}")
                
                if color_info['producto']:
                    producto = color_info['producto']
                    print(f"   - Producto: {producto['nombre']} ({producto['sku']})")
            
            # Listar imágenes creadas
            if resultado['imagenes']:
                print(f"\n📸 Imágenes creadas:")
                for i, imagen in enumerate(resultado['imagenes'], 1):
                    print(f"   {i}. {imagen['nombre_archivo']}")
                    print(f"      - URL: {imagen['imagen_url']}")
                    print(f"      - Tamaño: {imagen['tamaño_archivo']}")
                    print(f"      - Dimensiones: {imagen['dimensiones']}")
                    print(f"      - Es principal: {imagen['es_principal']}")
            
        else:
            print(f"❌ Error al subir imágenes: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_obtener_imagenes_por_color():
    """Ejemplo de cómo obtener todas las imágenes de un color específico"""
    
    color_id = 1
    
    try:
        response = requests.get(f'{API_BASE_URL}/imagenes-color/by_color/?color_id={color_id}')
        
        if response.status_code == 200:
            resultado = response.json()
            print("🎨 Imágenes del color:")
            
            # Información del color
            if resultado['color_info']:
                color_info = resultado['color_info']
                print(f"\n📋 Información del color:")
                print(f"   - ID: {color_info['id']}")
                print(f"   - Nombre: {color_info['nombre']}")
                print(f"   - Código: {color_info['codigo_color']}")
                print(f"   - Stock: {color_info['stock']}")
                print(f"   - Es principal: {color_info['es_principal']}")
                print(f"   - Total imágenes: {color_info['total_imagenes']}")
            
            # Información del producto
            if resultado['producto_info']:
                producto_info = resultado['producto_info']
                print(f"\n📦 Información del producto:")
                print(f"   - ID: {producto_info['id']}")
                print(f"   - Nombre: {producto_info['nombre']}")
                print(f"   - SKU: {producto_info['sku']}")
                print(f"   - Precio: {producto_info['precio']}")
                print(f"   - Estado: {producto_info['estado']}")
            
            # Listar imágenes
            if resultado['imagenes']:
                print(f"\n📸 Imágenes del color:")
                for i, imagen in enumerate(resultado['imagenes'], 1):
                    print(f"   {i}. {imagen['nombre_archivo']}")
                    print(f"      - ID: {imagen['id']}")
                    print(f"      - URL: {imagen['imagen_url']}")
                    print(f"      - Tamaño: {imagen['tamaño_archivo']}")
                    print(f"      - Dimensiones: {imagen['dimensiones']}")
                    print(f"      - Orden: {imagen['orden']}")
                    print(f"      - Es principal: {imagen['es_principal']}")
                    print(f"      - Descripción: {imagen['descripcion']}")
            else:
                print(f"\n❌ No hay imágenes para este color")
            
        else:
            print(f"❌ Error al obtener imágenes: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_eliminar_imagenes():
    """Ejemplo de cómo eliminar múltiples imágenes"""
    
    imagen_ids = [1, 2, 3]  # IDs de las imágenes a eliminar
    
    data = {
        'imagen_ids': imagen_ids
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/imagenes-color/bulk_delete/',
            json=data
        )
        
        if response.status_code == 200:
            resultado = response.json()
            print("✅ Imágenes eliminadas exitosamente:")
            print(f"   - Mensaje: {resultado['mensaje']}")
            
            if resultado['imagenes_eliminadas']:
                print(f"\n🗑️ Imágenes eliminadas:")
                for imagen in resultado['imagenes_eliminadas']:
                    print(f"   - ID: {imagen['id']}")
                    print(f"     Archivo: {imagen['nombre_archivo']}")
                    if imagen['color']:
                        print(f"     Color: {imagen['color']['nombre']} ({imagen['color']['codigo_color']})")
                    if imagen['producto']:
                        print(f"     Producto: {imagen['producto']['nombre']} ({imagen['producto']['sku']})")
            
        else:
            print(f"❌ Error al eliminar imágenes: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_reordenar_imagenes():
    """Ejemplo de cómo reordenar imágenes"""
    
    # Nuevo orden: imagen 3 va a posición 1, imagen 1 va a posición 2, etc.
    orden_data = {
        '3': 1,
        '1': 2,
        '2': 3,
        '4': 4
    }
    
    data = {
        'orden': orden_data
    }
    
    try:
        response = requests.post(
            f'{API_BASE_URL}/imagenes-color/bulk_reorder/',
            json=data
        )
        
        if response.status_code == 200:
            resultado = response.json()
            print("✅ Imágenes reordenadas exitosamente:")
            print(f"   - Mensaje: {resultado['mensaje']}")
            
            if resultado['imagenes_actualizadas']:
                print(f"\n🔄 Imágenes reordenadas:")
                for imagen in resultado['imagenes_actualizadas']:
                    print(f"   - ID: {imagen['id']}")
                    print(f"     Nueva posición: {imagen['nueva_posicion']}")
                    if imagen['color']:
                        print(f"     Color: {imagen['color']['nombre']}")
            
        else:
            print(f"❌ Error al reordenar imágenes: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def ejemplo_listar_todas_imagenes():
    """Ejemplo de cómo listar todas las imágenes con filtros"""
    
    # Parámetros de filtrado
    params = {
        'color': 1,  # Filtrar por color específico
        'es_principal': True,  # Solo imágenes principales
        'ordering': 'orden'  # Ordenar por orden
    }
    
    try:
        response = requests.get(f'{API_BASE_URL}/imagenes-color/', params=params)
        
        if response.status_code == 200:
            resultado = response.json()
            print("📸 Lista de imágenes:")
            print(f"   - Total: {resultado['count']}")
            
            for imagen in resultado['results']:
                print(f"\n🖼️ Imagen ID: {imagen['id']}")
                print(f"   - Archivo: {imagen['nombre_archivo']}")
                print(f"   - URL: {imagen['imagen_url']}")
                print(f"   - Tamaño: {imagen['tamaño_archivo']}")
                print(f"   - Dimensiones: {imagen['dimensiones']}")
                print(f"   - Orden: {imagen['orden']}")
                print(f"   - Es principal: {imagen['es_principal']}")
                print(f"   - Color: {imagen['color_nombre']} ({imagen['color_codigo']})")
                print(f"   - Producto: {imagen['producto_nombre']} ({imagen['producto_sku']})")
                
                # Información detallada del color
                if imagen['color_info']:
                    color_info = imagen['color_info']
                    print(f"   - Color ID: {color_info['id']}")
                    print(f"   - Stock: {color_info['stock']}")
                    print(f"   - Total imágenes: {color_info['total_imagenes']}")
                
                # Información del producto
                if imagen['producto_info']:
                    producto_info = imagen['producto_info']
                    print(f"   - Producto ID: {producto_info['id']}")
                    print(f"   - Precio: {producto_info['precio']}")
                    print(f"   - Estado: {producto_info['estado']}")
                    print(f"   - Categoría: {producto_info['categoria']}")
            
        else:
            print(f"❌ Error al listar imágenes: {response.json()}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🚀 Ejemplos de uso de serializers mejorados de imágenes de colores")
    print("=" * 70)
    
    # Ejecutar ejemplos
    print("\n1. Crear imagen para un color:")
    ejemplo_crear_imagen_color()
    
    print("\n2. Obtener información detallada de una imagen:")
    ejemplo_obtener_imagen_detalle()
    
    print("\n3. Subir múltiples imágenes a un color:")
    ejemplo_subir_multiples_imagenes()
    
    print("\n4. Obtener todas las imágenes de un color:")
    ejemplo_obtener_imagenes_por_color()
    
    print("\n5. Eliminar múltiples imágenes:")
    ejemplo_eliminar_imagenes()
    
    print("\n6. Reordenar imágenes:")
    ejemplo_reordenar_imagenes()
    
    print("\n7. Listar todas las imágenes con filtros:")
    ejemplo_listar_todas_imagenes()
    
    print("\n✅ Ejemplos completados!") 