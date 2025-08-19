@echo off
echo Reiniciando aplicacion Localix...
echo.

echo 1. Deteniendo procesos de Electron...
taskkill /f /im electron.exe 2>nul
taskkill /f /im Localix.exe 2>nul
timeout /t 2 /nobreak >nul

echo 2. Limpiando cache de Electron...
if exist "%APPDATA%\Localix" (
    rmdir /s /q "%APPDATA%\Localix" 2>nul
    echo Cache limpiado.
) else (
    echo No se encontro cache para limpiar.
)

echo 3. Verificando que el servidor Django este ejecutandose...
curl -s http://localhost:8000/api/ >nul 2>&1
if %errorlevel% equ 0 (
    echo Servidor Django esta ejecutandose.
) else (
    echo ADVERTENCIA: El servidor Django no parece estar ejecutandose.
    echo Por favor, inicia el servidor Django antes de continuar.
    pause
    exit /b 1
)

echo 4. Iniciando aplicacion Electron...
cd /d "%~dp0"
npm run dev

echo.
echo Aplicacion iniciada. Si sigues teniendo problemas:
echo 1. Verifica que el servidor Django este ejecutandose en puerto 8000
echo 2. Ejecuta el script de verificacion en la consola del navegador
echo 3. Revisa los logs de la aplicacion
pause 