#!/bin/bash

echo "=== CONFIGURANDO DJANGO COMO SERVICIO PERMANENTE ==="

# Variables
SERVICE_NAME="django-8001"
SERVICE_FILE="/etc/systemd/system/django-8001.service"
PROJECT_PATH="/home/tienda-backend-git"

echo "1. Deteniendo procesos existentes..."
pkill -f "runserver.*8001" 2>/dev/null
systemctl stop $SERVICE_NAME 2>/dev/null

echo "2. Creando archivo de servicio..."
cat > $SERVICE_FILE << EOF
[Unit]
Description=Django Application on Port 8001
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_PATH
Environment=PATH=$PROJECT_PATH/venv/bin
ExecStart=$PROJECT_PATH/venv/bin/python manage.py runserver 0.0.0.0:8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "3. Configurando firewall..."
ufw allow 8001
ufw reload

echo "4. Recargando systemd..."
systemctl daemon-reload

echo "5. Habilitando el servicio..."
systemctl enable $SERVICE_NAME

echo "6. Iniciando el servicio..."
systemctl start $SERVICE_NAME

echo "7. Verificando estado..."
sleep 3
systemctl status $SERVICE_NAME

echo "8. Verificando que el puerto esté abierto..."
if netstat -tlnp | grep ":8001 " > /dev/null; then
    echo "✓ Puerto 8001 está abierto"
else
    echo "✗ Puerto 8001 no está abierto"
fi

echo ""
echo "=== CONFIGURACIÓN COMPLETADA ==="
echo "Django está configurado como servicio permanente"
echo ""
echo "Comandos útiles:"
echo "  - Ver estado: systemctl status $SERVICE_NAME"
echo "  - Ver logs: journalctl -u $SERVICE_NAME -f"
echo "  - Reiniciar: systemctl restart $SERVICE_NAME"
echo "  - Detener: systemctl stop $SERVICE_NAME"
echo "  - Iniciar: systemctl start $SERVICE_NAME"
echo ""
echo "URLs de acceso:"
echo "  - API principal: http://72.60.7.133:8001/"
echo "  - Admin: http://72.60.7.133:8001/admin/"
echo "  - Categorías: http://72.60.7.133:8001/api/categorias/"
echo "  - Productos: http://72.60.7.133:8001/api/productos/"
echo ""
echo "El servicio se iniciará automáticamente cuando el servidor se reinicie"
