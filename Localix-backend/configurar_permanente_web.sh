#!/bin/bash

echo "=== CONFIGURANDO DJANGO COMO SERVICIO WEB PERMANENTE ==="

# Variables
SERVICE_NAME="django-8001"
PROJECT_PATH="/home/tienda-backend-git"
SERVICE_FILE="/etc/systemd/system/django-8001.service"

echo "1. Deteniendo procesos existentes..."
pkill -f "runserver.*8001" 2>/dev/null
systemctl stop $SERVICE_NAME 2>/dev/null
systemctl stop lshttpd 2>/dev/null

echo "2. Navegando al proyecto..."
cd $PROJECT_PATH

echo "3. Activando entorno virtual..."
source venv/bin/activate

echo "4. Verificando Django..."
python -c "import django; print(f'✓ Django {django.get_version()} instalado')"

echo "5. Ejecutando migraciones..."
python manage.py migrate

echo "6. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput

echo "7. Configurando firewall..."
ufw allow 8001
ufw reload

echo "8. Creando archivo de servicio..."
cat > $SERVICE_FILE << EOF
[Unit]
Description=Django Web Application on Port 8001
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

echo "9. Configurando systemd..."
systemctl daemon-reload

echo "10. Habilitando el servicio..."
systemctl enable $SERVICE_NAME

echo "11. Iniciando el servicio..."
systemctl start $SERVICE_NAME

echo "12. Verificando estado..."
sleep 5
systemctl status $SERVICE_NAME

echo "13. Verificando puerto..."
if netstat -tlnp | grep ":8001 " > /dev/null; then
    echo "✓ Puerto 8001 está abierto"
else
    echo "✗ Puerto 8001 no está abierto"
    echo "Verificando logs..."
    journalctl -u $SERVICE_NAME -n 10
fi

echo "14. Probando conexión local..."
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✓ Conexión local exitosa"
else
    echo "✗ Error en conexión local"
fi

echo ""
echo "=== CONFIGURACIÓN COMPLETADA ==="
echo "🎉 Tu API Django está configurada como servicio permanente"
echo ""
echo "🌐 URLs de acceso:"
echo "  - API principal: http://72.60.7.133:8001/"
echo "  - Admin: http://72.60.7.133:8001/admin/"
echo "  - Categorías: http://72.60.7.133:8001/api/categorias/"
echo "  - Productos: http://72.60.7.133:8001/api/productos/"
echo "  - Ventas: http://72.60.7.133:8001/api/ventas/"
echo "  - Pedidos: http://72.60.7.133:8001/api/pedidos/"
echo ""
echo "🔧 Comandos de gestión:"
echo "  - Ver estado: systemctl status $SERVICE_NAME"
echo "  - Ver logs: journalctl -u $SERVICE_NAME -f"
echo "  - Reiniciar: systemctl restart $SERVICE_NAME"
echo "  - Detener: systemctl stop $SERVICE_NAME"
echo "  - Iniciar: systemctl start $SERVICE_NAME"
echo ""
echo "✅ El servicio se iniciará automáticamente:"
echo "   - Al reiniciar el servidor"
echo "   - Si se cae por algún error"
echo "   - Sin necesidad de estar conectado"
echo ""
echo "🚀 ¡Tu API está lista para usar desde cualquier lugar!"
