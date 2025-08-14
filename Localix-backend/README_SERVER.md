# Despliegue en Servidor VPS con OpenLiteSpeed

## Información del Servidor
- **IP**: 72.60.7.133
- **Servidor Web**: OpenLiteSpeed
- **Base de Datos**: PostgreSQL

## Configuración Realizada

### 1. Settings.py Actualizado
- ✅ `ALLOWED_HOSTS` configurado para incluir la IP del servidor
- ✅ Configuración de archivos estáticos optimizada para OpenLiteSpeed
- ✅ CORS configurado para permitir acceso desde el servidor
- ✅ WhiteNoise configurado para servir archivos estáticos

### 2. Archivos Creados
- `deploy_server.sh` - Script de despliegue completo
- `collect_static.sh` - Script para recopilar archivos estáticos
- `openlitespeed_config.txt` - Instrucciones de configuración de OpenLiteSpeed
- `env.server.example` - Variables de entorno para producción

## Pasos para Desplegar

### Paso 1: Subir el Proyecto al Servidor
```bash
# Clonar o copiar el proyecto al servidor
git clone <tu-repositorio> /ruta/a/tienda-backend-git
cd /ruta/a/tienda-backend-git
```

### Paso 2: Ejecutar el Script de Despliegue
```bash
# Dar permisos de ejecución
chmod +x deploy_server.sh
chmod +x collect_static.sh

# Ejecutar el script de despliegue
./deploy_server.sh
```

### Paso 3: Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp env.server.example .env

# Editar las variables de entorno
nano .env
```

### Paso 4: Configurar OpenLiteSpeed
Seguir las instrucciones en `openlitespeed_config.txt`

### Paso 5: Recopilar Archivos Estáticos
```bash
# Ejecutar el script de collectstatic
./collect_static.sh
```

## URLs de Acceso

Una vez configurado, podrás acceder a:

- **API Principal**: http://72.60.7.133/django/
- **Admin Django**: http://72.60.7.133/django/admin/
- **Archivos Estáticos**: http://72.60.7.133/static/
- **Archivos Media**: http://72.60.7.133/media/

## Verificación

### Verificar que Django funciona:
```bash
python manage.py check --deploy
```

### Verificar archivos estáticos:
```bash
ls -la staticfiles/
```

### Verificar logs de OpenLiteSpeed:
```bash
tail -f /usr/local/lsws/logs/error.log
```

## Troubleshooting

### Error: "No module named 'django'"
```bash
# Activar entorno virtual
source venv/bin/activate
pip install -r requirements.txt
```

### Error: "Permission denied"
```bash
# Configurar permisos
chmod -R 755 /ruta/a/tienda-backend-git
chown -R www-data:www-data /ruta/a/tienda-backend-git
```

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql

# Verificar conexión a la base de datos
python manage.py dbshell
```

## Comandos Útiles

### Reiniciar OpenLiteSpeed
```bash
sudo systemctl restart lshttpd
```

### Ver estado del servicio
```bash
sudo systemctl status lshttpd
```

### Ver logs en tiempo real
```bash
tail -f /usr/local/lsws/logs/access.log
tail -f /usr/local/lsws/logs/error.log
```

### Ejecutar Django en modo desarrollo
```bash
python manage.py runserver 0.0.0.0:8000
```

## Seguridad

### Cambiar SECRET_KEY
```bash
# Generar nueva clave secreta
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Configurar firewall
```bash
# Permitir solo puertos necesarios
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22
```

## Backup

### Backup de la base de datos
```bash
pg_dump -U productos -h localhost tiendadb > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Backup de archivos media
```bash
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz media/
```
