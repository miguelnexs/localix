# Serializers Mejorados de Imágenes de Colores - Documentación

## Descripción General

He mejorado significativamente los serializers de imágenes de colores para que proporcionen información completa sobre el color al que pertenece cada imagen y el producto asociado. Esto facilita la gestión y comprensión de las relaciones entre imágenes, colores y productos.

## Serializers Disponibles

### 1. `ImagenColorSerializer` (Básico)
Serializer principal que incluye información básica del color y producto.

**Campos incluidos:**
- Información de la imagen (URL, tamaño, dimensiones, etc.)
- Información del color asociado
- Información del producto asociado

### 2. `ImagenColorDetailSerializer` (Detallado)
Serializer para obtener información completa de una imagen específica.

**Campos adicionales:**
- Stock disponible del color
- Si el color es principal del producto
- Total de imágenes del color
- URL del producto
- Información completa de la categoría

### 3. `ImagenColorCreateSerializer` (Creación)
Serializer específico para crear imágenes con validaciones mejoradas.

**Características:**
- Validación de límite de imágenes por color
- Verificación de color asociado a producto
- Validación de imagen principal única

## Información Proporcionada

### Información del Color
```json
{
  "color_info": {
    "id": 1,
    "nombre": "Azul Marino",
    "codigo_color": "#000080",
    "stock": 25,
    "orden": 1,
    "es_principal": false,
    "total_imagenes": 3,
    "color_display": "<div style='width:20px;height:20px;background:#000080;border:1px solid #000'></div>"
  },
  "color_nombre": "Azul Marino",
  "color_codigo": "#000080"
}
```

### Información del Producto
```json
{
  "producto_info": {
    "id": 1,
    "nombre": "Camiseta Básica",
    "sku": "CAM-001",
    "precio": "29.99",
    "estado": "publicado",
    "categoria": "Ropa",
    "imagen_principal_url": "http://localhost:8000/media/productos/colores/imagen1.jpg"
  },
  "producto_nombre": "Camiseta Básica",
  "producto_sku": "CAM-001"
}
```

### Información de la Imagen
```json
{
  "id": 1,
  "imagen": "productos/colores/imagen1.jpg",
  "imagen_url": "http://localhost:8000/media/productos/colores/imagen1.jpg",
  "thumbnail_url": "http://localhost:8000/media/productos/colores/imagen1_thumb.jpg",
  "tamaño_archivo": "2.5 MB",
  "dimensiones": "1920x1080px",
  "nombre_archivo": "imagen1.jpg",
  "descripcion": "Vista frontal del producto",
  "orden": 1,
  "es_principal": true
}
```

## Endpoints Mejorados

### 1. Crear Imagen
**URL:** `POST /api/imagenes-color/`
**Content-Type:** `multipart/form-data`

**Campos requeridos:**
- `color` (int): ID del color
- `imagen` (file): Archivo de imagen

**Campos opcionales:**
- `descripcion` (string): Descripción de la imagen
- `orden` (int): Orden de visualización
- `es_principal` (boolean): Si es la imagen principal

**Respuesta:**
```json
{
  "id": 1,
  "color": 1,
  "imagen": "productos/colores/imagen1.jpg",
  "descripcion": "Vista frontal del producto",
  "orden": 1,
  "es_principal": true,
  "color_info": {
    "id": 1,
    "nombre": "Azul Marino",
    "codigo_color": "#000080",
    "total_imagenes_actual": 3,
    "limite_imagenes": 4
  },
  "producto_info": {
    "id": 1,
    "nombre": "Camiseta Básica",
    "sku": "CAM-001"
  }
}
```

### 2. Obtener Imagen Detallada
**URL:** `GET /api/imagenes-color/{id}/`

**Respuesta completa:**
```json
{
  "id": 1,
  "imagen": "productos/colores/imagen1.jpg",
  "imagen_url": "http://localhost:8000/media/productos/colores/imagen1.jpg",
  "thumbnail_url": "http://localhost:8000/media/productos/colores/imagen1_thumb.jpg",
  "tamaño_archivo": "2.5 MB",
  "dimensiones": "1920x1080px",
  "nombre_archivo": "imagen1.jpg",
  "descripcion": "Vista frontal del producto",
  "orden": 1,
  "es_principal": true,
  "color": 1,
  "color_info": {
    "id": 1,
    "nombre": "Azul Marino",
    "codigo_color": "#000080",
    "stock": 25,
    "orden": 1,
    "es_principal": false,
    "total_imagenes": 3,
    "color_display": "<div style='width:20px;height:20px;background:#000080;border:1px solid #000'></div>"
  },
  "producto_info": {
    "id": 1,
    "nombre": "Camiseta Básica",
    "sku": "CAM-001",
    "precio": "29.99",
    "estado": "publicado",
    "categoria": "Ropa",
    "imagen_principal_url": "http://localhost:8000/media/productos/colores/imagen1.jpg"
  },
  "color_nombre": "Azul Marino",
  "color_codigo": "#000080",
  "producto_nombre": "Camiseta Básica",
  "producto_sku": "CAM-001",
  "color_stock_disponible": 25,
  "color_es_principal_producto": false,
  "color_total_imagenes": 3,
  "producto_url": "http://localhost:8000/api/productos/camiseta-basica/",
  "producto_categoria_completa": {
    "id": 1,
    "nombre": "Ropa",
    "descripcion": "Vestimenta y accesorios",
    "slug": "ropa"
  }
}
```

### 3. Subir Múltiples Imágenes
**URL:** `POST /api/imagenes-color/upload_multiple/`
**Content-Type:** `multipart/form-data`

**Campos:**
- `color_id` (int): ID del color
- `imagenes` (files): Múltiples archivos de imagen

**Respuesta:**
```json
{
  "mensaje": "Procesadas 3 de 3 imágenes",
  "imagenes_creadas": 3,
  "errores": [],
  "color_info": {
    "id": 1,
    "nombre": "Azul Marino",
    "codigo_color": "#000080",
    "total_imagenes": 4,
    "producto": {
      "id": 1,
      "nombre": "Camiseta Básica",
      "sku": "CAM-001"
    }
  },
  "imagenes": [
    {
      "id": 1,
      "imagen": "productos/colores/imagen1.jpg",
      "imagen_url": "http://localhost:8000/media/productos/colores/imagen1.jpg",
      "tamaño_archivo": "2.5 MB",
      "dimensiones": "1920x1080px",
      "nombre_archivo": "imagen1.jpg",
      "descripcion": "Imagen 1 para Azul Marino",
      "orden": 1,
      "es_principal": false
    }
  ]
}
```

### 4. Obtener Imágenes por Color
**URL:** `GET /api/imagenes-color/by_color/?color_id={id}`

**Respuesta:**
```json
{
  "color_info": {
    "id": 1,
    "nombre": "Azul Marino",
    "codigo_color": "#000080",
    "stock": 25,
    "es_principal": false,
    "total_imagenes": 3
  },
  "producto_info": {
    "id": 1,
    "nombre": "Camiseta Básica",
    "sku": "CAM-001",
    "precio": "29.99",
    "estado": "publicado"
  },
  "imagenes": [
    {
      "id": 1,
      "imagen": "productos/colores/imagen1.jpg",
      "imagen_url": "http://localhost:8000/media/productos/colores/imagen1.jpg",
      "tamaño_archivo": "2.5 MB",
      "dimensiones": "1920x1080px",
      "nombre_archivo": "imagen1.jpg",
      "descripcion": "Vista frontal del producto",
      "orden": 1,
      "es_principal": true
    }
  ]
}
```

### 5. Eliminar Múltiples Imágenes
**URL:** `POST /api/imagenes-color/bulk_delete/`
**Content-Type:** `application/json`

**Campos:**
- `imagen_ids` (list): Lista de IDs de imágenes a eliminar

**Respuesta:**
```json
{
  "mensaje": "Eliminadas 3 imágenes",
  "imagenes_eliminadas": [
    {
      "id": 1,
      "nombre_archivo": "imagen1.jpg",
      "color": {
        "id": 1,
        "nombre": "Azul Marino",
        "codigo_color": "#000080"
      },
      "producto": {
        "id": 1,
        "nombre": "Camiseta Básica",
        "sku": "CAM-001"
      }
    }
  ]
}
```

### 6. Reordenar Imágenes
**URL:** `POST /api/imagenes-color/bulk_reorder/`
**Content-Type:** `application/json`

**Campos:**
- `orden` (dict): Diccionario con {imagen_id: nueva_posicion}

**Respuesta:**
```json
{
  "mensaje": "Orden de imágenes actualizado",
  "imagenes_actualizadas": [
    {
      "id": 1,
      "nueva_posicion": 2,
      "color": {
        "id": 1,
        "nombre": "Azul Marino"
      }
    }
  ]
}
```

## Validaciones Mejoradas

### Al Crear Imágenes
1. **Límite de imágenes**: Máximo 4 imágenes por color
2. **Color asociado**: El color debe estar asociado a un producto
3. **Imagen principal**: Solo una imagen principal por color
4. **Validaciones de archivo**: Tamaño, formato, dimensiones

### Al Actualizar Imágenes
1. **Consistencia**: Mantener integridad de datos
2. **Relaciones**: Actualizar automáticamente imagen principal del producto
3. **Orden**: Reordenar automáticamente si es necesario

## Filtros Disponibles

### Filtros Básicos
- `color`: Filtrar por ID del color
- `es_principal`: Filtrar por imágenes principales
- `color__producto`: Filtrar por producto del color
- `color__producto__categoria`: Filtrar por categoría del producto

### Ordenamiento
- `orden`: Ordenar por orden de imagen
- `id`: Ordenar por ID
- `color__nombre`: Ordenar por nombre del color
- `color__producto__nombre`: Ordenar por nombre del producto

## Ejemplos de Uso

### JavaScript
```javascript
// Crear imagen para un color
const formData = new FormData();
formData.append('color', 1);
formData.append('imagen', file);
formData.append('descripcion', 'Vista frontal');
formData.append('es_principal', true);

const response = await fetch('/api/imagenes-color/', {
    method: 'POST',
    body: formData
});

const imagen = await response.json();
console.log(`Imagen creada para color: ${imagen.color_nombre}`);
console.log(`Producto: ${imagen.producto_nombre}`);
```

### Python
```python
import requests

# Crear imagen
files = {'imagen': open('imagen.jpg', 'rb')}
data = {
    'color': 1,
    'descripcion': 'Vista frontal del producto',
    'es_principal': True
}

response = requests.post('http://localhost:8000/api/imagenes-color/', 
                        data=data, files=files)
imagen = response.json()

print(f"Imagen creada para color: {imagen['color_nombre']}")
print(f"Producto: {imagen['producto_nombre']}")
```

### cURL
```bash
# Crear imagen
curl -X POST http://localhost:8000/api/imagenes-color/ \
  -F "color=1" \
  -F "imagen=@imagen.jpg" \
  -F "descripcion=Vista frontal" \
  -F "es_principal=true"

# Obtener imágenes de un color
curl http://localhost:8000/api/imagenes-color/by_color/?color_id=1

# Eliminar múltiples imágenes
curl -X POST http://localhost:8000/api/imagenes-color/bulk_delete/ \
  -H "Content-Type: application/json" \
  -d '{"imagen_ids": [1, 2, 3]}'
```

## Beneficios de los Serializers Mejorados

1. **Información Completa**: Cada imagen incluye información del color y producto
2. **Fácil Identificación**: Sabes inmediatamente a qué color pertenece cada imagen
3. **Validaciones Robustas**: Previene errores y mantiene integridad de datos
4. **Flexibilidad**: Diferentes serializers para diferentes necesidades
5. **Optimización**: Consultas optimizadas con select_related y prefetch_related
6. **Compatibilidad**: Funciona con formularios HTML y JSON

## Notas Importantes

1. **Rendimiento**: Los serializers están optimizados para evitar consultas N+1
2. **Validaciones**: Se ejecutan validaciones en tiempo real
3. **Relaciones**: Se mantienen automáticamente las relaciones entre entidades
4. **Errores**: Se proporcionan mensajes de error detallados y específicos
5. **Compatibilidad**: Mantiene compatibilidad con el código existente

Los serializers mejorados proporcionan una experiencia mucho más rica y completa para gestionar imágenes de colores, facilitando la identificación y gestión de las relaciones entre imágenes, colores y productos. 