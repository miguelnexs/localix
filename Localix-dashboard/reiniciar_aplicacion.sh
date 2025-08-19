#!/bin/bash

echo "Reiniciando aplicación Localix..."
echo

echo "1. Deteniendo procesos de Electron..."
pkill -f electron 2>/dev/null
pkill -f Localix 2>/dev/null
sleep 2

echo "2. Limpiando cache de Electron..."
if [ -d "$HOME/.config/Localix" ]; then
    rm -rf "$HOME/.config/Localix" 2>/dev/null
    echo "Cache limpiado."
else
    echo "No se encontró cache para limpiar."
fi

echo "3. Verificando que el servidor Django esté ejecutándose..."
if curl -s http://localhost:8000/api/ >/dev/null 2>&1; then
    echo "Servidor Django está ejecutándose."
else
    echo "ADVERTENCIA: El servidor Django no parece estar ejecutándose."
    echo "Por favor, inicia el servidor Django antes de continuar."
    read -p "Presiona Enter para continuar..."
    exit 1
fi

echo "4. Iniciando aplicación Electron..."
cd "$(dirname "$0")"
npm run dev

echo
echo "Aplicación iniciada. Si sigues teniendo problemas:"
echo "1. Verifica que el servidor Django esté ejecutándose en puerto 8000"
echo "2. Ejecuta el script de verificación en la consola del navegador"
echo "3. Revisa los logs de la aplicación"
read -p "Presiona Enter para continuar..." 