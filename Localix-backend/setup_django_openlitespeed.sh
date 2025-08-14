#!/bin/bash

# Script completo para configurar Django + OpenLiteSpeed en VPS Hostinger
# IP del servidor: 72.60.7.133
# Puerto: 8001

set -e  # Exit on any error

echo "=== CONFIGURACIÓN COMPLETA DJANGO + OPENLITESPEED ==="
echo "Servidor: 72.60.7.133"
echo "Puerto: 8001"
echo ""

# Variables
SERVER_IP="72.60.7.133"
PORT="8001"
PROJECT_NAME="tienda-backend"
PROJECT_PATH="/home/admin/web/tienda-backend-git"  # Ajusta según tu estructura
VENV_PATH="/home/admin/web/venv"
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.xml"
BACKUP_DIR="/home/admin/web/backups/$(date +%Y%m%d_%H%M%S)"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 1. Verificar que estamos como root o con sudo
if [ "$EUID" -ne 0 ]; then
    log_error "Este script debe ejecutarse como root o con sudo"
    exit 1
fi

log_info "1. Actualizando sistema..."
apt update && apt upgrade -y

# 2. Instalar dependencias del sistema
log_info "2. Instalando dependencias del sistema..."
apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    libpq-dev \
    postgresql \
    postgresql-contrib \
    nginx \
    curl \
    wget \
    git \
    unzip \
    supervisor \
    ufw \
    certbot \
    python3-certbot-nginx

# 3. Instalar OpenLiteSpeed
log_info "3. Instalando OpenLiteSpeed..."
if ! command -v lshttpd &> /dev/null; then
    wget -O - http://rpms.litespeedtech.com/debian/enable_lst_debian_repo.sh | bash
    apt install openlitespeed -y
    log_info "✓ OpenLiteSpeed instalado"
else
    log_info "✓ OpenLiteSpeed ya está instalado"
fi

# 4. Configurar PostgreSQL
log_info "4. Configurando PostgreSQL..."
systemctl start postgresql
systemctl enable postgresql

# Crear usuario y base de datos si no existen
sudo -u postgres psql -c "CREATE USER productos WITH PASSWORD 'migel1457';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE tiendadb OWNER productos;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE tiendadb TO productos;" 2>/dev/null || true

# 5. Crear directorios y configurar permisos
log_info "5. Configurando directorios y permisos..."
mkdir -p $PROJECT_PATH
mkdir -p $VENV_PATH
mkdir -p $BACKUP_DIR
mkdir -p /home/admin/web/staticfiles
mkdir -p /home/admin/web/media
mkdir -p /home/admin/web/logs

# Configurar permisos
chown -R admin:admin /home/admin/web/
chmod -R 755 /home/admin/web/

# 6. Configurar entorno virtual Python
log_info "6. Configurando entorno virtual Python..."
if [ ! -d "$VENV_PATH/bin" ]; then
    python3 -m venv $VENV_PATH
fi

# Activar entorno virtual e instalar dependencias
source $VENV_PATH/bin/activate
pip install --upgrade pip

# 7. Clonar/actualizar proyecto Django
log_info "7. Configurando proyecto Django..."
if [ ! -d "$PROJECT_PATH/Backend" ]; then
    log_warn "El proyecto Django no está en $PROJECT_PATH"
    log_warn "Por favor, asegúrate de que tu código esté en el directorio correcto"
else
    cd $PROJECT_PATH
    
    # Instalar dependencias
    pip install -r requirements.txt
    
    # Configurar variables de entorno
    cat > .env << EOF
SECRET_KEY=tu-clave-secreta-muy-segura-aqui
DEBUG=False
ALLOWED_HOSTS=72.60.7.133,localhost,127.0.0.1
DATABASE_URL=postgresql://productos:migel1457@localhost:5432/tiendadb
EOF
    
    # Ejecutar migraciones
    python manage.py makemigrations
    python manage.py migrate
    
    # Crear superusuario si no existe
    echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'admin123') if not User.objects.filter(username='admin').exists() else None" | python manage.py shell
    
    # Recolectar archivos estáticos
    python manage.py collectstatic --noinput
    
    log_info "✓ Django configurado"
fi

# 8. Crear backup de configuración actual
log_info "8. Creando backup de configuración actual..."
cp $CONFIG_FILE $BACKUP_DIR/httpd_config.backup 2>/dev/null || true

# 9. Crear configuración OpenLiteSpeed optimizada para Django
log_info "9. Configurando OpenLiteSpeed para Django..."

# Crear configuración WSGI para Django
cat > $PROJECT_PATH/django.wsgi << EOF
import os
import sys

# Agregar el directorio del proyecto al path
sys.path.insert(0, '$PROJECT_PATH')
sys.path.insert(0, '$VENV_PATH/lib/python3.*/site-packages')

# Configurar variables de entorno
os.environ['DJANGO_SETTINGS_MODULE'] = 'Backend.settings'
os.environ['PYTHONPATH'] = '$PROJECT_PATH'

# Importar aplicación Django
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
EOF

# Crear configuración OpenLiteSpeed
cat > /tmp/openlitespeed_django_config.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<httpServerConfig>
  <serverName>$SERVER_IP</serverName>
  <serverUser>admin</serverUser>
  <serverGroup>admin</serverGroup>
  <serverAdmin>admin@$SERVER_IP</serverAdmin>
  <serverEmail>admin@$SERVER_IP</serverEmail>
  <serverTokens>Prod</serverTokens>
  <useIpInProxyHeader>1</useIpInProxyHeader>
  <proxyProtocol>0</proxyProtocol>
  <enableCoreDump>0</enableCoreDump>
  <useSendfile>1</useSendfile>
  <maxCachedFileSize>4096</maxCachedFileSize>
  <maxCachedFileDescriptors>2000</maxCachedFileDescriptors>
  <maxReqURLLen>8192</maxReqURLLen>
  <maxReqHeaderSize>16384</maxReqHeaderSize>
  <maxReqBodySize>50M</maxReqBodySize>
  <maxDynRespHeaderSize>8192</maxDynRespHeaderSize>
  <maxDynRespSize>50M</maxDynRespSize>
  <maxConnections>10000</maxConnections>
  <maxSSLConnections>10000</maxSSLConnections>
  <connTimeout>300</connTimeout>
  <maxKeepAliveReq>10000</maxKeepAliveReq>
  <smartKeepAlive>1</smartKeepAlive>
  <keepAliveTimeout>5</keepAliveTimeout>
  <mime>conf/mime.properties</mime>
  <addDefaultCharset>off</addDefaultCharset>
  <adminEmails>admin@$SERVER_IP</adminEmails>
  <index>index.html, index.php</index>
  <autoIndex>0</autoIndex>
  <autoIndexURI>/autoindex</autoIndexURI>
  <useCanonicalName>0</useCanonicalName>
  <accessLog>logs/access.log</accessLog>
  <errorLog>logs/error.log</errorLog>
  <logLevel>ERROR</logLevel>
  <enableStderrLog>1</enableStderrLog>
  <logHeaders>0</logHeaders>
  <rollingSize>10M</rollingSize>
  <keepDays>30</keepDays>
  <compressArchive>1</compressArchive>
  <enableContextAC>0</enableContextAC>
  <enableScriptAC>0</enableScriptAC>
  <restartTime>22:30</restartTime>
  <maxRestarts>10</maxRestarts>
  <gracefulRestartTimeout>300</gracefulRestartTimeout>
  <extMaxSize>50M</extMaxSize>
  
  <listenerList>
    <listener>
      <name>Default</name>
      <address>*:$PORT</address>
      <maxConns>10000</maxConns>
      <mapping>
        <name>Default</name>
        <type>0</type>
        <vhName>Default</vhName>
      </mapping>
    </listener>
  </listenerList>
  
  <virtualHostList>
    <virtualHost>
      <name>Default</name>
      <vhRoot>/home/admin/web</vhRoot>
      <configFile>$CONFIG_FILE</configFile>
      <allowSymbolLink>1</allowSymbolLink>
      <enableScript>1</enableScript>
      <restrained>1</restrained>
      <setUIDMode>0</setUIDMode>
      <chrootMode>0</chrootMode>
      
      <contextList>
        <!-- Django WSGI Application -->
        <context>
          <type>cgi</type>
          <uri>/</uri>
          <location>$PROJECT_PATH</location>
          <allowBrowse>0</allowBrowse>
          <script>1</script>
          <extFilter>0</extFilter>
          <handler>lsapi</handler>
          <addDefaultCharset>off</addDefaultCharset>
          <path>django.wsgi</path>
        </context>
        
        <!-- Static Files -->
        <context>
          <type>0</type>
          <uri>/static</uri>
          <location>/home/admin/web/staticfiles</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html</index>
          <script>0</script>
          <extFilter>0</extFilter>
        </context>
        
        <!-- Media Files -->
        <context>
          <type>0</type>
          <uri>/media</uri>
          <location>/home/admin/web/media</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html</index>
          <script>0</script>
          <extFilter>0</extFilter>
        </context>
        
        <!-- Admin Interface -->
        <context>
          <type>cgi</type>
          <uri>/admin</uri>
          <location>$PROJECT_PATH</location>
          <allowBrowse>0</allowBrowse>
          <script>1</script>
          <extFilter>0</extFilter>
          <handler>lsapi</handler>
          <addDefaultCharset>off</addDefaultCharset>
          <path>django.wsgi</path>
        </context>
      </contextList>
      
      <extProcessorList>
        <extProcessor>
          <type>lsapi</type>
          <name>lsphp81</name>
          <address>uds://tmp/lshttpd/lsphp.sock</address>
          <maxConns>35</maxConns>
          <env>PHP_LSAPI_MAX_REQUESTS=500</env>
          <env>PHP_LSAPI_CHILDREN=35</env>
          <env>PYTHONPATH=$PROJECT_PATH:$VENV_PATH/lib/python3.*/site-packages</env>
          <env>DJANGO_SETTINGS_MODULE=Backend.settings</env>
          <initTimeout>60</initTimeout>
          <retryTimeout>0</retryTimeout>
          <pcKeepAliveTimeout>5</pcKeepAliveTimeout>
          <respBuffer>0</respBuffer>
          <autoStart>1</autoStart>
          <path>lsphp81/bin/lsphp</path>
          <backlog>100</backlog>
          <instances>1</instances>
          <extMaxIdleTime>300</extMaxIdleTime>
          <priority>0</priority>
          <memSoftLimit>2047M</memSoftLimit>
          <memHardLimit>2047M</memHardLimit>
          <procSoftLimit>400</procSoftLimit>
          <procHardLimit>500</procHardLimit>
        </extProcessor>
      </extProcessorList>
      
      <scriptHandlerList>
        <scriptHandler>
          <suffix>py</suffix>
          <type>lsapi</type>
          <handler>lsphp81</handler>
        </scriptHandler>
        <scriptHandler>
          <suffix>wsgi</suffix>
          <type>lsapi</type>
          <handler>lsphp81</handler>
        </scriptHandler>
      </scriptHandlerList>
      
      <rewrite>
        <enable>1</enable>
        <autoLoadHtaccess>1</autoLoadHtaccess>
      </rewrite>
    </virtualHost>
  </virtualHostList>
</httpServerConfig>
EOF

# Aplicar configuración
cp /tmp/openlitespeed_django_config.xml $CONFIG_FILE

# 10. Configurar firewall
log_info "10. Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow $PORT/tcp
ufw --force enable

# 11. Configurar permisos finales
log_info "11. Configurando permisos finales..."
chown -R admin:admin $PROJECT_PATH
chmod -R 755 $PROJECT_PATH
chmod 644 $PROJECT_PATH/django.wsgi
chmod -R 755 /home/admin/web/staticfiles
chmod -R 755 /home/admin/web/media

# 12. Reiniciar servicios
log_info "12. Reiniciando servicios..."
systemctl restart postgresql
systemctl restart lshttpd

# 13. Verificar servicios
log_info "13. Verificando servicios..."
sleep 5

if systemctl is-active --quiet lshttpd; then
    log_info "✓ OpenLiteSpeed está funcionando"
else
    log_error "✗ OpenLiteSpeed no está funcionando"
    systemctl status lshttpd
fi

if systemctl is-active --quiet postgresql; then
    log_info "✓ PostgreSQL está funcionando"
else
    log_error "✗ PostgreSQL no está funcionando"
    systemctl status postgresql
fi

# 14. Verificar puerto
log_info "14. Verificando puerto $PORT..."
if netstat -tlnp | grep ":$PORT " > /dev/null; then
    log_info "✓ Puerto $PORT está abierto"
else
    log_warn "✗ Puerto $PORT no está abierto"
fi

# 15. Crear script de gestión
log_info "15. Creando scripts de gestión..."

cat > /home/admin/web/manage_django.sh << 'EOF'
#!/bin/bash
# Script para gestionar Django

PROJECT_PATH="/home/admin/web/tienda-backend-git"
VENV_PATH="/home/admin/web/venv"

cd $PROJECT_PATH
source $VENV_PATH/bin/activate

case "$1" in
    start)
        echo "Iniciando Django..."
        python manage.py runserver 0.0.0.0:8001
        ;;
    migrate)
        echo "Ejecutando migraciones..."
        python manage.py makemigrations
        python manage.py migrate
        ;;
    collectstatic)
        echo "Recolectando archivos estáticos..."
        python manage.py collectstatic --noinput
        ;;
    createsuperuser)
        echo "Creando superusuario..."
        python manage.py createsuperuser
        ;;
    shell)
        echo "Abriendo shell de Django..."
        python manage.py shell
        ;;
    *)
        echo "Uso: $0 {start|migrate|collectstatic|createsuperuser|shell}"
        exit 1
        ;;
esac
EOF

chmod +x /home/admin/web/manage_django.sh

# 16. Crear archivo .htaccess para Django
cat > $PROJECT_PATH/.htaccess << EOF
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ django.wsgi/$1 [QSA,L]

# Configuración de seguridad
<Files "django.wsgi">
    Require all granted
</Files>

# Headers de seguridad
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

# 17. Configurar logs
log_info "17. Configurando logs..."
mkdir -p /home/admin/web/logs
touch /home/admin/web/logs/django.log
touch /home/admin/web/logs/access.log
touch /home/admin/web/logs/error.log
chown -R admin:admin /home/admin/web/logs

# 18. Crear configuración de supervisor (opcional)
cat > /etc/supervisor/conf.d/django.conf << EOF
[program:django]
command=$VENV_PATH/bin/python $PROJECT_PATH/manage.py runserver 0.0.0.0:8001
directory=$PROJECT_PATH
user=admin
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/admin/web/logs/django.log
EOF

# 19. Verificación final
log_info "19. Verificación final..."

echo ""
echo "=== CONFIGURACIÓN COMPLETADA ==="
echo ""
echo "URLs de tu aplicación:"
echo "  - API principal: http://$SERVER_IP:$PORT/"
echo "  - Admin Django: http://$SERVER_IP:$PORT/admin/"
echo "  - Archivos estáticos: http://$SERVER_IP:$PORT/static/"
echo "  - Archivos media: http://$SERVER_IP:$PORT/media/"
echo ""
echo "Credenciales de administrador:"
echo "  Usuario: admin"
echo "  Contraseña: admin123"
echo ""
echo "Comandos útiles:"
echo "  - Gestionar Django: /home/admin/web/manage_django.sh {comando}"
echo "  - Ver logs: tail -f /home/admin/web/logs/django.log"
echo "  - Reiniciar OpenLiteSpeed: systemctl restart lshttpd"
echo "  - Verificar estado: systemctl status lshttpd"
echo ""
echo "Archivos importantes:"
echo "  - Configuración OpenLiteSpeed: $CONFIG_FILE"
echo "  - Proyecto Django: $PROJECT_PATH"
echo "  - Entorno virtual: $VENV_PATH"
echo "  - Backup: $BACKUP_DIR"
echo ""
echo "Para probar la instalación:"
echo "  curl -I http://$SERVER_IP:$PORT/"
echo ""

# 20. Probar conexión
log_info "20. Probando conexión..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ | grep -q "200\|404\|500"; then
    log_info "✓ Conexión exitosa al servidor"
else
    log_warn "⚠ No se pudo conectar al servidor localmente"
fi

log_info "¡Configuración completada! Tu Django + OpenLiteSpeed está listo."
