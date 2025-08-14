# INSTRUCCIONES PARA CONFIGURAR PUERTO 8001

## PASO 1: Conectar al servidor
```bash
ssh root@72.60.7.133
# Contraseña: Migel145712
```

## PASO 2: Verificar la ubicación del proyecto
```bash
# Buscar el proyecto Django
find / -name "manage.py" 2>/dev/null

# Navegar al directorio del proyecto
cd /home/tienda-backend-git
# o
cd /root/tienda-backend-git
```

## PASO 3: Configurar Django para puerto 8001

### Opción A: Ejecutar Django directamente
```bash
# Activar entorno virtual
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar migraciones
python manage.py migrate

# Recopilar archivos estáticos
python manage.py collectstatic --noinput

# Abrir puerto en firewall
ufw allow 8001
ufw reload

# Iniciar Django en puerto 8001
python manage.py runserver 0.0.0.0:8001
```

### Opción B: Ejecutar en segundo plano
```bash
# Iniciar Django en segundo plano
nohup python manage.py runserver 0.0.0.0:8001 > django.log 2>&1 &

# Verificar que está funcionando
ps aux | grep runserver
netstat -tlnp | grep :8001
```

## PASO 4: Configurar OpenLiteSpeed (Opcional)

### Editar configuración de OpenLiteSpeed
```bash
# Crear backup
cp /usr/local/lsws/conf/httpd_config.xml /usr/local/lsws/conf/httpd_config.xml.backup

# Editar configuración
nano /usr/local/lsws/conf/httpd_config.xml
```

### Buscar y cambiar la línea del listener
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

### Reiniciar OpenLiteSpeed
```bash
systemctl restart lshttpd
```

## PASO 5: Verificar que funciona

### Verificar puerto
```bash
netstat -tlnp | grep :8001
```

### Probar conexión local
```bash
curl http://localhost:8001/django/
```

### Probar desde el exterior
```bash
curl http://72.60.7.133:8001/django/
```

## PASO 6: URLs de acceso

Una vez configurado, tu aplicación estará disponible en:

- **API principal:** http://72.60.7.133:8001/django/
- **Admin:** http://72.60.7.133:8001/django/admin/
- **Archivos estáticos:** http://72.60.7.133:8001/static/
- **Archivos media:** http://72.60.7.133:8001/media/

## PASO 7: Comandos útiles

### Ver logs
```bash
# Logs de Django
tail -f django.log

# Logs de OpenLiteSpeed
tail -f /usr/local/lsws/logs/error.log
tail -f /usr/local/lsws/logs/access.log
```

### Reiniciar servicios
```bash
# Reiniciar Django
pkill -f runserver
python manage.py runserver 0.0.0.0:8001

# Reiniciar OpenLiteSpeed
systemctl restart lshttpd
```

### Verificar estado
```bash
# Estado de OpenLiteSpeed
systemctl status lshttpd

# Procesos en puerto 8001
lsof -i :8001
```

## SOLUCIÓN DE PROBLEMAS

### Si el puerto está ocupado
```bash
# Encontrar proceso
lsof -i :8001

# Matar proceso
kill -9 <PID>
```

### Si hay problemas de permisos
```bash
# Corregir permisos
chmod 755 /home/tienda-backend-git
chmod 644 /home/tienda-backend-git/Backend/wsgi.py
chmod -R 755 /home/tienda-backend-git/staticfiles
chmod -R 755 /home/tienda-backend-git/media
```

### Si hay problemas de base de datos
```bash
# Verificar PostgreSQL
sudo -u postgres psql -c "\l"

# Verificar conexión
sudo -u postgres psql -d tiendadb -c "SELECT version();"
```

## SCRIPT AUTOMATIZADO

También puedes usar el script automatizado que creé:

```bash
# Dar permisos de ejecución
chmod +x ejecutar_en_servidor.sh

# Ejecutar script
./ejecutar_en_servidor.sh
```
