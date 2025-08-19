@echo off
REM Script para iniciar el servidor en modo desarrollo seguro (Windows)

echo 🚀 Iniciando servidor en modo desarrollo seguro...

REM Configurar variables de entorno
set DJANGO_SETTINGS_MODULE=Backend.settings_desarrollo_seguro

REM Crear directorio de logs si no existe
if not exist logs mkdir logs

REM Iniciar servidor
python manage.py runserver 0.0.0.0:8000

echo ✅ Servidor iniciado en modo desarrollo seguro
echo 📝 Logs disponibles en: logs/django.log
pause 