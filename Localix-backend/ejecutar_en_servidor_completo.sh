#!/bin/bash

echo "🚀 CONFIGURANDO DJANGO COMO SERVICIO PERMANENTE EN PUERTO 8001"

# 1. Navegar al proyecto y activar entorno virtual
echo "1. Navegando al proyecto..."
cd /home/tienda-backend-git
source venv/bin/activate
echo "✓ Entorno virtual activado"

# 2. Detener procesos existentes
echo "2. Deteniendo procesos existentes..."
pkill -f runserver 2>/dev/null
systemctl stop lshttpd 2>/dev/null
echo "✓ Procesos detenidos"

# 3. Verificar que Django esté instalado
echo "3. Verificando Django..."
python -c "import django; print(f'✓ Django {django.get_version()} instalado')"

# 4. Ejecutar migraciones
echo "4. Ejecutando migraciones..."
python manage.py migrate
echo "✓ Migraciones completadas"

# 5. Recopilar archivos estáticos
echo "5. Recopilando archivos estáticos..."
python manage.py collectstatic --noinput
echo "✓ Archivos estáticos recopilados"

# 6. Crear archivo de servicio
echo "6. Creando servicio systemd..."
cat > /etc/systemd/system/django-8001.service << 'EOF'
[Unit]
Description=Django Application on Port 8001
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/tienda-backend-git
Environment=PATH=/home/tienda-backend-git/venv/bin
ExecStart=/home/tienda-backend-git/venv/bin/python manage.py runserver 0.0.0.0:8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
echo "✓ Archivo de servicio creado"

# 7. Configurar firewall
echo "7. Configurando firewall..."
ufw allow 8001
ufw reload
echo "✓ Puerto 8001 abierto en firewall"

# 8. Habilitar e iniciar servicio
echo "8. Habilitando e iniciando servicio..."
systemctl daemon-reload
systemctl enable django-8001
systemctl start django-8001
echo "✓ Servicio habilitado e iniciado"

# 9. Verificar estado
echo "9. Verificando estado..."
sleep 3
systemctl status django-8001 --no-pager

# 10. Verificar puerto
echo "10. Verificando puerto..."
if netstat -tlnp | grep ":8001 " > /dev/null; then
    echo "✓ Puerto 8001 está abierto"
else
    echo "✗ Puerto 8001 no está abierto"
fi

# 11. Probar conexión local
echo "11. Probando conexión local..."
if curl -s http://localhost:8001/ > /dev/null; then
    echo "✓ Conexión local exitosa"
else
    echo "✗ Error en conexión local"
fi

echo ""
echo "🎉 CONFIGURACIÓN COMPLETADA"
echo "================================"
echo "Tu API Django está disponible en:"
echo "  🌐 API principal: http://72.60.7.133:8001/"
echo "  🔐 Admin: http://72.60.7.133:8001/admin/"
echo "  📂 Categorías: http://72.60.7.133:8001/api/categorias/"
echo "  🛍️ Productos: http://72.60.7.133:8001/api/productos/"
echo ""
echo "Comandos útiles:"
echo "  📊 Ver estado: systemctl status django-8001"
echo "  📝 Ver logs: journalctl -u django-8001 -f"
echo "  🔄 Reiniciar: systemctl restart django-8001"
echo "  ⏹️ Detener: systemctl stop django-8001"
echo "  ▶️ Iniciar: systemctl start django-8001"
echo ""
echo "✅ El servicio se iniciará automáticamente al reiniciar el servidor"
