#!/bin/bash

# Script de despliegue para Django en VPS con OpenLiteSpeed
# IP del servidor: 72.60.7.133

echo "=== Configurando proyecto Django en VPS ==="

# 1. Activar entorno virtual (si existe)
if [ -d "venv" ]; then
    echo "Activando entorno virtual..."
    source venv/bin/activate
else
    echo "Creando entorno virtual..."
    python3 -m venv venv
    source venv/bin/activate
fi

# 2. Instalar dependencias
echo "Instalando dependencias..."
pip install -r requirements.txt

# 3. Crear directorios necesarios
echo "Creando directorios..."
mkdir -p staticfiles
mkdir -p media
mkdir -p static

# 4. Ejecutar migraciones
echo "Ejecutando migraciones..."
python manage.py makemigrations
python manage.py migrate

# 5. Recopilar archivos estáticos
echo "Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

# 6. Crear superusuario (opcional)
echo "¿Deseas crear un superusuario? (y/n)"
read -r create_superuser
if [ "$create_superuser" = "y" ]; then
    python manage.py createsuperuser
fi

# 7. Verificar configuración
echo "Verificando configuración..."
python manage.py check --deploy

echo "=== Configuración completada ==="
echo "Tu proyecto Django está listo para ejecutarse en:"
echo "http://72.60.7.133"
echo ""
echo "Para ejecutar el servidor de desarrollo:"
echo "python manage.py runserver 0.0.0.0:8000"
echo ""
echo "Para OpenLiteSpeed, asegúrate de configurar el virtual host"
echo "apuntando a este directorio y al archivo wsgi.py"
