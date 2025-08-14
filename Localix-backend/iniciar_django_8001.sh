#!/bin/bash

echo "=== INICIANDO DJANGO EN PUERTO 8001 ==="

cd /home/tienda-backend-git
source venv/bin/activate

echo "1. Verificando que Django esté instalado..."
python -c "import django; print(f'Django version: {django.get_version()}')"

echo "2. Verificando configuración..."
python manage.py check

echo "3. Ejecutando migraciones..."
python manage.py migrate

echo "4. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

echo "5. Abriendo puerto en firewall..."
ufw allow 8001
ufw reload

echo "6. Iniciando Django en puerto 8001..."
echo "Django estará disponible en: http://72.60.7.133:8001/"
echo "Para detener, presiona Ctrl+C"

python manage.py runserver 0.0.0.0:8001
