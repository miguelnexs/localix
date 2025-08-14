#!/bin/bash

# Script simple para configurar Django en puerto 8001 con OpenLiteSpeed
# IP del servidor: 72.60.7.133

echo "=== CONFIGURANDO DJANGO EN PUERTO 8001 ==="

# Variables
SERVER_IP="72.60.7.133"
PORT="8001"
PROJECT_PATH="/ruta/a/tienda-backend-git"

echo "1. Verificando que el proyecto Django existe..."
if [ ! -d "$PROJECT_PATH" ]; then
    echo "ERROR: El directorio del proyecto no existe en $PROJECT_PATH"
    echo "Por favor, especifica la ruta correcta del proyecto Django"
    exit 1
fi

echo "2. Activando entorno virtual..."
cd $PROJECT_PATH
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "✓ Entorno virtual activado"
else
    echo "ERROR: No se encontró el entorno virtual"
    exit 1
fi

echo "3. Verificando dependencias..."
pip install -r requirements.txt

echo "4. Ejecutando migraciones..."
python manage.py migrate

echo "5. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

echo "6. Configurando firewall..."
ufw allow $PORT
ufw reload

echo "7. Iniciando Django en puerto 8001..."
echo "Ejecutando: python manage.py runserver 0.0.0.0:$PORT"
echo ""
echo "Para mantener el proceso ejecutándose en segundo plano, usa:"
echo "nohup python manage.py runserver 0.0.0.0:$PORT > django.log 2>&1 &"
echo ""
echo "Para verificar que funciona:"
echo "curl http://$SERVER_IP:$PORT/django/"
echo ""
echo "URLs de acceso:"
echo "  - API principal: http://$SERVER_IP:$PORT/django/"
echo "  - Admin: http://$SERVER_IP:$PORT/django/admin/"
echo "  - Archivos estáticos: http://$SERVER_IP:$PORT/static/"
echo "  - Archivos media: http://$SERVER_IP:$PORT/media/"
echo ""

# Iniciar Django
python manage.py runserver 0.0.0.0:$PORT
