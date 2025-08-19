@echo off
echo ========================================
echo REINICIO COMPLETO DE LOCALIX
echo ========================================
echo.

echo 1. Deteniendo todos los procesos de Electron...
taskkill /f /im electron.exe 2>nul
taskkill /f /im Localix.exe 2>nul
taskkill /f /im node.exe 2>nul
timeout /t 3 /nobreak >nul

echo 2. Limpiando cache y archivos temporales...
if exist "%APPDATA%\Localix" (
    rmdir /s /q "%APPDATA%\Localix" 2>nul
    echo Cache de Electron limpiado.
)

if exist "node_modules\.cache" (
    rmdir /s /q "node_modules\.cache" 2>nul
    echo Cache de Node.js limpiado.
)

echo 3. Verificando que el servidor Django este ejecutandose...
curl -s http://localhost:8000/api/ >nul 2>&1
if %errorlevel% equ 0 (
    echo Servidor Django esta ejecutandose correctamente.
) else (
    echo ADVERTENCIA: El servidor Django no parece estar ejecutandose.
    echo Iniciando servidor Django...
    start "Django Server" cmd /k "cd Localix-backend && python manage.py runserver"
    timeout /t 5 /nobreak >nul
)

echo 4. Verificando dependencias...
echo Verificando que todas las dependencias esten instaladas...
npm install

echo 5. Limpiando build anterior...
if exist "out" (
    rmdir /s /q "out" 2>nul
    echo Build anterior limpiado.
)

echo 6. Reconstruyendo la aplicacion...
echo Compilando la aplicacion Electron...
npm run build

echo 7. Iniciando aplicacion en modo desarrollo...
echo Iniciando Localix Dashboard...
npm run dev

echo.
echo ========================================
echo REINICIO COMPLETADO
echo ========================================
echo.
echo Si sigues teniendo problemas:
echo 1. Verifica que el servidor Django este ejecutandose en puerto 8000
echo 2. Ejecuta el script de verificacion en la consola del navegador
echo 3. Revisa los logs de la aplicacion
echo 4. Verifica que no haya errores en la consola
echo.
pause 