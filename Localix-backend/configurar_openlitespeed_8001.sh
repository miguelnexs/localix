#!/bin/bash

# Script para configurar OpenLiteSpeed en puerto 8001
# IP del servidor: 72.60.7.133

echo "=== CONFIGURANDO OPENLITESPEED PARA PUERTO 8001 ==="

# Variables
SERVER_IP="72.60.7.133"
PORT="8001"
PROJECT_PATH="/ruta/a/tienda-backend-git"
CONFIG_FILE="/usr/local/lsws/conf/httpd_config.xml"

echo "1. Verificando que OpenLiteSpeed esté instalado..."
if ! command -v lshttpd &> /dev/null; then
    echo "ERROR: OpenLiteSpeed no está instalado. Instalando..."
    wget -O - http://rpms.litespeedtech.com/debian/enable_lst_debian_repo.sh | bash
    apt-get install openlitespeed -y
else
    echo "✓ OpenLiteSpeed ya está instalado"
fi

echo "2. Verificando que el proyecto Django existe..."
if [ ! -d "$PROJECT_PATH" ]; then
    echo "ERROR: El directorio del proyecto no existe en $PROJECT_PATH"
    echo "Por favor, especifica la ruta correcta del proyecto Django"
    exit 1
fi

echo "3. Creando backup de la configuración actual..."
cp $CONFIG_FILE ${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)
echo "✓ Backup creado"

echo "4. Configurando OpenLiteSpeed para puerto $PORT..."

# Crear configuración temporal
cat > /tmp/openlitespeed_config_8001.xml << EOF
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
  <useIpInProxyHeader>1</useIpInProxyHeader>
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
  <mime>conf/mime.properties</mime>
  <extMaxSize>50M</extMaxSize>
  <lsrecaptcha>
    <type>recaptcha</type>
    <key>6LfGAxwTAAAAAJKC42xO3yaguMblVWT4d6XWsSWK</key>
    <secret>6LfGAxwTAAAAALzrrekpzocmYtDyzxTIcxPUoKbK</secret>
  </lsrecaptcha>
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
      <vhRoot>/usr/local/lsws/DEFAULT</vhRoot>
      <configFile>$CONFIG_FILE</configFile>
      <allowSymbolLink>1</allowSymbolLink>
      <enableScript>1</enableScript>
      <restrained>1</restrained>
      <setUIDMode>0</setUIDMode>
      <chrootMode>0</chrootMode>
      <vhssl>
        <keyFile>/usr/local/lsws/conf/example.key</keyFile>
        <certFile>/usr/local/lsws/conf/example.crt</certFile>
        <certChain>1</certChain>
        <certChainFile></certChainFile>
        <CACertPath>/usr/local/lsws/conf/</CACertPath>
        <CACertFile>ca.pem</CACertFile>
        <SSLProtocol>24</SSLProtocol>
        <enableECDHE>1</enableECDHE>
        <enableDHE>1</enableDHE>
        <enableStapling>1</enableStapling>
        <ocspRespMaxAge>86400</ocspRespMaxAge>
        <sslSessionCache>1</sslSessionCache>
        <sslSessionTickets>1</sslSessionTickets>
        <enableSpdy>15</enableSpdy>
        <enableQuic>1</enableQuic>
        <enableAltSvc>1</enableAltSvc>
        <enableH2c>1</enableH2c>
        <altSvcMaxAge>86400</altSvcMaxAge>
        <enableOCSP>0</enableOCSP>
        <ocspResponder></ocspResponder>
        <ocspCACerts></ocspCACerts>
        <ocspVerifyCert>0</ocspVerifyCert>
        <enableCTLogs>0</enableCTLogs>
        <ctLogsCAFile></ctLogsCAFile>
        <enableMultiCerts>0</enableMultiCerts>
        <enableAnonAuth>1</enableAnonAuth>
        <enableFakeBasicAuth>0</enableFakeBasicAuth>
        <scache>
          <type>0</type>
          <checkPrivateCache>1</checkPrivateCache>
          <checkPublicCache>1</checkPublicCache>
          <maxCacheObjSize>10M</maxCacheObjSize>
          <maxStaleAge>200</maxStaleAge>
          <qsCache>1</qsCache>
          <reqCookieCache>1</reqCookieCache>
          <respCookieCache>1</respCookieCache>
          <ignoreReqCacheCtrl>1</ignoreReqCacheCtrl>
          <ignoreRespCacheCtrl>0</ignoreRespCacheCtrl>
          <enableCache>0</enableCache>
          <expireInSeconds>3600</expireInSeconds>
          <enablePrivateCache>0</enablePrivateCache>
          <privateExpireInSeconds>3600</privateExpireInSeconds>
        </scache>
        <contextList>
          <context>
            <type>0</type>
            <uri>/</uri>
            <location>$PROJECT_PATH</location>
            <allowBrowse>1</allowBrowse>
            <index>index.html, index.php</index>
            <script>1</script>
            <extFilter>0</extFilter>
          </context>
          <context>
            <type>0</type>
            <uri>/django</uri>
            <location>$PROJECT_PATH</location>
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
            <location>$PROJECT_PATH/staticfiles</location>
            <allowBrowse>1</allowBrowse>
            <index>index.html, index.php</index>
            <script>0</script>
            <extFilter>0</extFilter>
          </context>
          <context>
            <type>0</type>
            <uri>/media</uri>
            <location>$PROJECT_PATH/media</location>
            <allowBrowse>1</allowBrowse>
            <index>index.html, index.php</index>
            <script>0</script>
            <extFilter>0</extFilter>
          </context>
        </contextList>
        <extProcessorList>
          <extProcessor>
            <type>lsapi</type>
            <name>lsphp74</name>
            <address>uds://tmp/lshttpd/lsphp.sock</address>
            <maxConns>35</maxConns>
            <env>PHP_LSAPI_MAX_REQUESTS=500</env>
            <env>PHP_LSAPI_CHILDREN=35</env>
            <initTimeout>60</initTimeout>
            <retryTimeout>0</retryTimeout>
            <pcKeepAliveTimeout>5</pcKeepAliveTimeout>
            <respBuffer>0</respBuffer>
            <autoStart>1</autoStart>
            <path>lsphp74/bin/lsphp</path>
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
            <suffix>php</suffix>
            <type>lsapi</type>
            <handler>lsphp74</handler>
          </scriptHandler>
        </scriptHandlerList>
        <rewrite>
          <enable>1</enable>
          <autoLoadHtaccess>1</autoLoadHtaccess>
        </rewrite>
      </vhssl>
    </virtualHost>
  </virtualHostList>
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
  <useIpInProxyHeader>1</useIpInProxyHeader>
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
  <mime>conf/mime.properties</mime>
  <extMaxSize>50M</extMaxSize>
  <lsrecaptcha>
    <type>recaptcha</type>
    <key>6LfGAxwTAAAAAJKC42xO3yaguMblVWT4d6XWsSWK</key>
    <secret>6LfGAxwTAAAAALzrrekpzocmYtDyzxTIcxPUoKbK</secret>
  </lsrecaptcha>
</httpServerConfig>
EOF

echo "5. Aplicando nueva configuración..."
cp /tmp/openlitespeed_config_8001.xml $CONFIG_FILE
echo "✓ Configuración aplicada"

echo "6. Configurando firewall para puerto $PORT..."
ufw allow $PORT
ufw reload
echo "✓ Firewall configurado"

echo "7. Verificando permisos del proyecto..."
chmod 755 $PROJECT_PATH
chmod 644 $PROJECT_PATH/Backend/wsgi.py
chmod -R 755 $PROJECT_PATH/staticfiles
chmod -R 755 $PROJECT_PATH/media
echo "✓ Permisos configurados"

echo "8. Reiniciando OpenLiteSpeed..."
systemctl restart lshttpd
echo "✓ OpenLiteSpeed reiniciado"

echo "9. Verificando que el servicio esté funcionando..."
sleep 3
if systemctl is-active --quiet lshttpd; then
    echo "✓ OpenLiteSpeed está funcionando"
else
    echo "✗ Error: OpenLiteSpeed no está funcionando"
    systemctl status lshttpd
    exit 1
fi

echo "10. Verificando que el puerto $PORT esté abierto..."
if netstat -tlnp | grep ":$PORT " > /dev/null; then
    echo "✓ Puerto $PORT está abierto"
else
    echo "✗ Error: Puerto $PORT no está abierto"
    netstat -tlnp | grep ":$PORT"
    exit 1
fi

echo "11. Probando conexión local..."
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
