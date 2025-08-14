#!/bin/bash

# Script para recopilar archivos estáticos en el servidor VPS
# IP: 72.60.7.133

echo "=== Recopilando archivos estáticos para OpenLiteSpeed ==="

# Activar entorno virtual
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "Entorno virtual activado"
else
    echo "ERROR: No se encontró el entorno virtual"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "manage.py" ]; then
    echo "ERROR: No se encontró manage.py. Asegúrate de estar en el directorio del proyecto"
    exit 1
fi

# Crear directorio staticfiles si no existe
if [ ! -d "staticfiles" ]; then
    mkdir -p staticfiles
    echo "Directorio staticfiles creado"
fi

# Limpiar archivos estáticos anteriores
echo "Limpiando archivos estáticos anteriores..."
rm -rf staticfiles/*

# Recopilar archivos estáticos
echo "Recopilando archivos estáticos..."
python manage.py collectstatic --noinput --clear

# Verificar que se crearon los archivos
if [ -d "staticfiles" ] && [ "$(ls -A staticfiles)" ]; then
    echo "✓ Archivos estáticos recopilados exitosamente"
    echo "Ubicación: $(pwd)/staticfiles"
    echo "Contenido:"
    ls -la staticfiles/
else
    echo "⚠ Advertencia: No se encontraron archivos estáticos para recopilar"
fi

# Configurar permisos para OpenLiteSpeed
echo "Configurando permisos..."
chmod -R 755 staticfiles/
chown -R www-data:www-data staticfiles/ 2>/dev/null || echo "No se pudo cambiar el propietario (ejecutar como root)"

echo "=== Proceso completado ==="
echo "Los archivos estáticos están listos para ser servidos por OpenLiteSpeed"
echo "URL de acceso: http://72.60.7.133/static/"
