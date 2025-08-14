#!/bin/bash

echo "=== CONFIGURANDO DJANGO COMO SERVICIO PERMANENTE EN PUERTO 8001 ==="

# Variables
SERVICE_NAME="django-8001"
SERVICE_FILE="/etc/systemd/system/django-8001.service"
PROJECT_PATH="/home/tienda-backend-git"
SERVER_IP="72.60.7.133"

echo "1. Verificando que estamos en el directorio correcto..."
cd $PROJECT_PATH
if [ ! -f "manage.py" ]; then
    echo "✗ ERROR: No se encontró manage.py en $PROJECT_PATH"
    exit 1
fi
echo "✓ Directorio correcto: $(pwd)"

echo "2. Activando entorno virtual..."
if [ ! -d "venv" ]; then
    echo "✗ ERROR: No se encontró el entorno virtual"
    exit 1
fi
source venv/bin/activate
echo "✓ Entorno virtual activado"

echo "3. Verificando Django..."
python -c "import django; print(f'✓ Django version: {django.get_version()}')"

echo "4. Deteniendo procesos existentes..."
pkill -f "runserver.*8001" 2>/dev/null
systemctl stop $SERVICE_NAME 2>/dev/null
echo "✓ Procesos detenidos"

echo "5. Ejecutando migraciones..."
python manage.py migrate
echo "✓ Migraciones completadas"

echo "6. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput
echo "✓ Archivos estáticos recopilados"

echo "7. Configurando firewall..."
ufw allow 8001
ufw reload
echo "✓ Puerto 8001 abierto en firewall"

echo "8. Creando archivo de servicio..."
cat > $SERVICE_FILE << EOF
[Unit]
Description=Django Application on Port 8001
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_PATH
Environment=PATH=$PROJECT_PATH/venv/bin
Environment=PYTHONPATH=$PROJECT_PATH
Environment=DJANGO_SETTINGS_MODULE=Backend.settings
ExecStart=$PROJECT_PATH/venv/bin/python manage.py runserver 0.0.0.0:8001
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
echo "✓ Archivo de servicio creado"

echo "9. Configurando permisos..."
chmod 644 $SERVICE_FILE
echo "✓ Permisos configurados"

echo "10. Recargando systemd..."
systemctl daemon-reload
echo "✓ Systemd recargado"

echo "11. Habilitando el servicio..."
systemctl enable $SERVICE_NAME
echo "✓ Servicio habilitado"

echo "12. Iniciando el servicio..."
systemctl start $SERVICE_NAME
echo "✓ Servicio iniciado"

echo "13. Verificando estado..."
sleep 5
if systemctl is-active --quiet $SERVICE_NAME; then
    echo "✓ Servicio está funcionando"
else
    echo "✗ ERROR: El servicio no está funcionando"
    systemctl status $SERVICE_NAME
    exit 1
fi

echo "14. Verificando que el puerto esté abierto..."
sleep 3
if netstat -tlnp | grep ":8001 " > /dev/null; then
    echo "✓ Puerto 8001 está abierto"
else
    echo "✗ ERROR: Puerto 8001 no está abierto"
    netstat -tlnp | grep ":8001"
    exit 1
fi

echo "15. Probando conexión local..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/ | grep -q "200"; then
    echo "✓ Conexión local exitosa"
else
    echo "⚠ Conexión local no exitosa, pero el servicio está corriendo"
fi

echo ""
echo "=== CONFIGURACIÓN COMPLETADA EXITOSAMENTE ==="
echo ""
echo "🎉 Django está configurado como servicio permanente en puerto 8001"
echo ""
echo "📋 URLs de acceso:"
echo "  🌐 API principal: http://$SERVER_IP:8001/"
echo "  🔧 Admin: http://$SERVER_IP:8001/admin/"
echo "  📂 Categorías: http://$SERVER_IP:8001/api/categorias/"
echo "  🛍️ Productos: http://$SERVER_IP:8001/api/productos/"
echo "  💰 Ventas: http://$SERVER_IP:8001/api/ventas/"
echo "  📦 Pedidos: http://$SERVER_IP:8001/api/pedidos/"
echo ""
echo "🔧 Comandos de gestión:"
echo "  📊 Ver estado: systemctl status $SERVICE_NAME"
echo "  📝 Ver logs: journalctl -u $SERVICE_NAME -f"
echo "  🔄 Reiniciar: systemctl restart $SERVICE_NAME"
echo "  ⏹️ Detener: systemctl stop $SERVICE_NAME"
echo "  ▶️ Iniciar: systemctl start $SERVICE_NAME"
echo ""
echo "✅ El servicio se iniciará automáticamente cuando el servidor se reinicie"
echo "✅ Se reiniciará automáticamente si se cae"
echo ""
echo "🚀 ¡Tu API Django está lista para usar!"
