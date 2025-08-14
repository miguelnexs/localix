# Archivos de Requirements

Este proyecto tiene diferentes archivos de requirements según el entorno:

## 📁 Archivos disponibles

### `requirements.txt`
**Uso:** Desarrollo completo (incluye debug)
```bash
pip install -r requirements.txt
```
- Incluye todas las dependencias necesarias
- Incluye herramientas de debug
- Recomendado para desarrollo local

### `requirements-prod.txt`
**Uso:** Producción (Render, Heroku, etc.)
```bash
pip install -r requirements-prod.txt
```
- Solo dependencias necesarias para producción
- Sin herramientas de debug
- Optimizado para despliegue

### `requirements-dev.txt`
**Uso:** Herramientas adicionales de desarrollo
```bash
pip install -r requirements-dev.txt
```
- Testing (pytest, factory-boy)
- Linting y formateo (black, flake8, isort)
- Herramientas de desarrollo

## 🚀 Instalación rápida

### Para desarrollo:
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Opcional
```

### Para producción:
```bash
pip install -r requirements-prod.txt
```

## 📋 Dependencias principales

### Django Core
- `Django==5.2.4` - Framework principal
- `asgiref==3.9.1` - ASGI utilities
- `sqlparse==0.5.3` - SQL parsing

### Base de datos
- `psycopg2-binary==2.9.10` - PostgreSQL adapter
- `dj-database-url==3.0.1` - URL parsing para bases de datos

### REST API
- `djangorestframework==3.16.0` - REST framework
- `djangorestframework_simplejwt==5.5.1` - JWT authentication
- `PyJWT==2.10.1` - JSON Web Tokens

### Utilidades
- `django-cors-headers==4.7.0` - CORS support
- `django-filter==25.1` - Filtros avanzados
- `django-colorfield==0.14.0` - Campo de color
- `Pillow==11.3.0` - Procesamiento de imágenes
- `python-dotenv==1.1.1` - Variables de entorno
- `whitenoise==6.5.0` - Archivos estáticos en producción

## 🔧 Comandos útiles

### Actualizar requirements
```bash
pip freeze > requirements.txt
```

### Instalar solo dependencias de producción
```bash
pip install -r requirements-prod.txt
```

### Verificar dependencias
```bash
pip list
```

## 📝 Notas importantes

- **Render:** Usa `requirements-prod.txt` en el despliegue
- **Desarrollo local:** Usa `requirements.txt` completo
- **Testing:** Instala `requirements-dev.txt` para herramientas de testing
- **Versiones:** Las versiones están fijadas para evitar problemas de compatibilidad 