# CONFIGURACIÓN PARA EJECUTAR EN PUERTO 8001

## 1. CONECTAR AL SERVIDOR
```bash
ssh root@72.60.7.133
```

## 2. NAVEGAR AL DIRECTORIO DEL PROYECTO
```bash
cd /ruta/a/tienda-backend-git
```

## 3. ACTIVAR EL ENTORNO VIRTUAL
```bash
source venv/bin/activate
```

## 4. VERIFICAR LA CONFIGURACIÓN ACTUAL
```bash
# Verificar si hay algún proceso corriendo en el puerto 8001
netstat -tlnp | grep :8001
lsof -i :8001
```

## 5. OPCIONES PARA EJECUTAR EN PUERTO 8001

### OPCIÓN A: Servidor de desarrollo Django
```bash
# Ejecutar directamente en puerto 8001
python manage.py runserver 0.0.0.0:8001

# O con configuración específica
python manage.py runserver 72.60.7.133:8001
```

### OPCIÓN B: Usando Gunicorn (Recomendado para producción)
```bash
# Instalar gunicorn si no está instalado
pip install gunicorn

# Ejecutar con gunicorn en puerto 8001
gunicorn --bind 0.0.0.0:8001 Backend.wsgi:application

# Con configuración más robusta
gunicorn --bind 0.0.0.0:8001 --workers 3 --timeout 120 Backend.wsgi:application
```

### OPCIÓN C: Configurar OpenLiteSpeed para puerto 8001

#### 5.1 Editar configuración de OpenLiteSpeed
```bash
# Editar el archivo de configuración principal
nano /usr/local/lsws/conf/httpd_config.xml
```

#### 5.2 Buscar y modificar la sección del listener
```xml
<listener>
  <name>Default</name>
  <address>*:8001</address>  <!-- Cambiar de 80 a 8001 -->
  <maxConns>10000</maxConns>
  <mapping>
    <name>Default</name>
    <type>0</type>
    <vhName>Default</vhName>
  </mapping>
</listener>
```

#### 5.3 Reiniciar OpenLiteSpeed
```bash
sudo systemctl restart lshttpd
```

## 6. VERIFICAR QUE FUNCIONA
```bash
# Verificar que el puerto está abierto
netstat -tlnp | grep :8001

# Probar la conexión localmente
curl http://localhost:8001/django/

# Verificar desde el exterior
curl http://72.60.7.133:8001/django/
```

## 7. CONFIGURAR FIREWALL (si es necesario)
```bash
# Abrir el puerto 8001 en el firewall
ufw allow 8001
ufw reload

# O con iptables
iptables -A INPUT -p tcp --dport 8001 -j ACCEPT
service iptables save
```

## 8. CREAR SCRIPT DE INICIO AUTOMÁTICO

### 8.1 Crear script de servicio
```bash
nano /etc/systemd/system/django-8001.service
```

### 8.2 Contenido del script
```ini
[Unit]
Description=Django Application on Port 8001
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/ruta/a/tienda-backend-git
Environment=PATH=/ruta/a/tienda-backend-git/venv/bin
ExecStart=/ruta/a/tienda-backend-git/venv/bin/gunicorn --bind 0.0.0.0:8001 --workers 3 Backend.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

### 8.3 Habilitar y iniciar el servicio
```bash
systemctl daemon-reload
systemctl enable django-8001
systemctl start django-8001
systemctl status django-8001
```

## 9. VERIFICAR LOGS
```bash
# Logs del servicio
journalctl -u django-8001 -f

# Logs de OpenLiteSpeed
tail -f /usr/local/lsws/logs/error.log
tail -f /usr/local/lsws/logs/access.log
```

## 10. URLS DE ACCESO
Una vez configurado, tu aplicación estará disponible en:
- API principal: http://72.60.7.133:8001/django/
- Admin: http://72.60.7.133:8001/django/admin/
- Archivos estáticos: http://72.60.7.133:8001/static/
- Archivos media: http://72.60.7.133:8001/media/

## 11. SOLUCIÓN DE PROBLEMAS

### Si el puerto está ocupado:
```bash
# Encontrar qué proceso usa el puerto 8001
lsof -i :8001
# O
netstat -tlnp | grep :8001

# Matar el proceso si es necesario
kill -9 <PID>
```

### Si hay problemas de permisos:
```bash
# Verificar permisos del directorio
ls -la /ruta/a/tienda-backend-git/

# Corregir permisos si es necesario
chmod 755 /ruta/a/tienda-backend-git/
chmod 644 /ruta/a/tienda-backend-git/Backend/wsgi.py
```

### Si hay problemas de base de datos:
```bash
# Verificar conexión a PostgreSQL
sudo -u postgres psql -c "\l"

# Verificar que la base de datos existe
sudo -u postgres psql -d tiendadb -c "SELECT version();"
```

## 12. COMANDOS RÁPIDOS DE VERIFICACIÓN
```bash
# Estado del servicio
systemctl status django-8001

# Verificar puerto
netstat -tlnp | grep :8001

# Probar API
curl -I http://72.60.7.133:8001/django/

# Ver logs en tiempo real
tail -f /var/log/syslog | grep django
```
