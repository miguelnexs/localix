#!/bin/bash

# Script para configurar OpenLiteSpeed en puerto 8001
# IP del servidor: 72.60.7.133

echo "=== CONFIGURANDO OPENLITESPEED PARA PUERTO 8001 ==="

# Variables
SERVER_IP="72.60.7.133"
PORT="8001"
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.xml"

echo "1. Verificando que OpenLiteSpeed esté instalado..."
if ! command -v lshttpd &> /dev/null; then
    echo "✗ ERROR: OpenLiteSpeed no está instalado"
    exit 1
else
    echo "✓ OpenLiteSpeed está instalado"
fi

echo "2. Creando backup de la configuración actual..."
cp $CONFIG_FILE ${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)
echo "✓ Backup creado"

echo "3. Configurando OpenLiteSpeed para puerto $PORT..."

# Crear configuración simplificada para puerto 8001
cat > /tmp/ols_config_8001.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<httpServerConfig>
  <serverName>72.60.7.133</serverName>
  <serverUser>nobody</serverUser>
  <serverGroup>nobody</serverGroup>
  <serverAdmin>admin@72.60.7.133</serverAdmin>
  <serverEmail>admin@72.60.7.133</serverEmail>
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
  <adminEmails>admin@72.60.7.133</adminEmails>
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
      <address>*:8001</address>
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
      <vhRoot>/usr/local/lsws/DEFAULT</vhRoot>
      <configFile>/usr/local/lsws/conf/httpd_config.xml</configFile>
      <allowSymbolLink>1</allowSymbolLink>
      <enableScript>1</enableScript>
      <restrained>1</restrained>
      <setUIDMode>0</setUIDMode>
      <chrootMode>0</chrootMode>
      <contextList>
        <context>
          <type>0</type>
          <uri>/</uri>
          <location>/home/tienda-backend-git</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html, index.php</index>
          <script>1</script>
          <extFilter>0</extFilter>
        </context>
        <context>
          <type>0</type>
          <uri>/django</uri>
          <location>/home/tienda-backend-git</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html, index.php</index>
          <script>1</script>
          <extFilter>0</extFilter>
          <rewrite>
            <enable>1</enable>
            <autoLoadHtaccess>1</autoLoadHtaccess>
          </rewrite>
        </context>
        <context>
          <type>0</type>
          <uri>/static</uri>
          <location>/home/tienda-backend-git/staticfiles</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html, index.php</index>
          <script>0</script>
          <extFilter>0</extFilter>
        </context>
        <context>
          <type>0</type>
          <uri>/media</uri>
          <location>/home/tienda-backend-git/media</location>
          <allowBrowse>1</allowBrowse>
          <index>index.html, index.php</index>
          <script>0</script>
          <extFilter>0</extFilter>
        </context>
      </contextList>
      <rewrite>
        <enable>1</enable>
        <autoLoadHtaccess>1</autoLoadHtaccess>
      </rewrite>
    </virtualHost>
  </virtualHostList>
</httpServerConfig>
EOF

echo "4. Aplicando nueva configuración..."
cp /tmp/ols_config_8001.xml $CONFIG_FILE
echo "✓ Configuración aplicada"

echo "5. Configurando firewall para puerto $PORT..."
ufw allow $PORT
ufw reload
echo "✓ Firewall configurado"

echo "6. Verificando permisos del proyecto..."
chmod 755 /home/tienda-backend-git
chmod 644 /home/tienda-backend-git/Backend/wsgi.py
chmod -R 755 /home/tienda-backend-git/staticfiles
chmod -R 755 /home/tienda-backend-git/media
echo "✓ Permisos configurados"

echo "7. Reiniciando OpenLiteSpeed..."
systemctl restart lshttpd
echo "✓ OpenLiteSpeed reiniciado"

echo "8. Verificando que el servicio esté funcionando..."
sleep 3
if systemctl is-active --quiet lshttpd; then
    echo "✓ OpenLiteSpeed está funcionando"
else
    echo "✗ Error: OpenLiteSpeed no está funcionando"
    systemctl status lshttpd
    exit 1
fi

echo "9. Verificando que el puerto $PORT esté abierto..."
if netstat -tlnp | grep ":$PORT " > /dev/null; then
    echo "✓ Puerto $PORT está abierto"
else
    echo "✗ Error: Puerto $PORT no está abierto"
    netstat -tlnp | grep ":$PORT"
    exit 1
fi

echo "10. Probando conexión local..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:$PORT/ | grep -q "200\|404"; then
    echo "✓ Conexión local exitosa"
else
    echo "✗ Error: No se puede conectar localmente"
fi

echo ""
echo "=== CONFIGURACIÓN COMPLETADA ==="
echo "Tu aplicación Django está configurada en:"
echo "  HTTP:  http://$SERVER_IP:$PORT/"
echo "  HTTPS: https://$SERVER_IP:$PORT/"
echo ""
echo "URLs específicas:"
echo "  - API principal: http://$SERVER_IP:$PORT/django/"
echo "  - Admin: http://$SERVER_IP:$PORT/django/admin/"
echo "  - Archivos estáticos: http://$SERVER_IP:$PORT/static/"
echo "  - Archivos media: http://$SERVER_IP:$PORT/media/"
echo ""
echo "Para verificar logs:"
echo "  tail -f /usr/local/lsws/logs/error.log"
echo "  tail -f /usr/local/lsws/logs/access.log"
echo ""
echo "Para reiniciar el servicio:"
echo "  systemctl restart lshttpd"
