#!/bin/bash

# Script para ejecutar directamente en el servidor 72.60.7.133
# Contraseña: Migel145712

echo "=== CONFIGURANDO DJANGO EN PUERTO 8001 ==="

# Variables
SERVER_IP="72.60.7.133"
PORT="8001"

echo "1. Verificando ubicación del proyecto..."
if [ -d "/home/tienda-backend-git" ]; then
    PROJECT_PATH="/home/tienda-backend-git"
    echo "✓ Proyecto encontrado en: $PROJECT_PATH"
elif [ -d "/root/tienda-backend-git" ]; then
    PROJECT_PATH="/root/tienda-backend-git"
    echo "✓ Proyecto encontrado en: $PROJECT_PATH"
else
    echo "✗ ERROR: No se encontró el proyecto Django"
    echo "Buscando en todo el sistema..."
    find / -name "manage.py" 2>/dev/null | head -5
    exit 1
fi

echo "2. Navegando al directorio del proyecto..."
cd $PROJECT_PATH
echo "Directorio actual: $(pwd)"

echo "3. Verificando estructura del proyecto..."
if [ -f "manage.py" ]; then
    echo "✓ manage.py encontrado"
else
    echo "✗ ERROR: manage.py no encontrado"
    ls -la
    exit 1
fi

echo "4. Verificando entorno virtual..."
if [ -d "venv" ]; then
    echo "✓ Entorno virtual encontrado"
    source venv/bin/activate
    echo "✓ Entorno virtual activado"
else
    echo "✗ Entorno virtual no encontrado, creando uno nuevo..."
    python3 -m venv venv
    source venv/bin/activate
    echo "✓ Nuevo entorno virtual creado y activado"
fi

echo "5. Instalando dependencias..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
    echo "✓ Dependencias instaladas"
else
    echo "⚠ requirements.txt no encontrado, instalando dependencias básicas..."
    pip install django djangorestframework django-cors-headers psycopg2-binary
    echo "✓ Dependencias básicas instaladas"
fi

echo "6. Ejecutando migraciones..."
python manage.py migrate
echo "✓ Migraciones ejecutadas"

echo "7. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput
echo "✓ Archivos estáticos recopilados"

echo "8. Configurando firewall..."
ufw allow $PORT
ufw reload
echo "✓ Puerto $PORT abierto en firewall"

echo "9. Verificando que no hay procesos en el puerto $PORT..."
if netstat -tlnp | grep ":$PORT " > /dev/null; then
    echo "⚠ Puerto $PORT ya está en uso"
    netstat -tlnp | grep ":$PORT"
    echo "Deteniendo proceso anterior..."
    PID=$(netstat -tlnp | grep ":$PORT " | awk '{print $7}' | cut -d'/' -f1)
    if [ ! -z "$PID" ]; then
        kill -9 $PID
        echo "✓ Proceso anterior detenido"
    fi
else
    echo "✓ Puerto $PORT está libre"
fi

echo "10. Iniciando Django en puerto $PORT..."
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
