@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 🚀 Script de Despliegue para Localix (Windows)
REM Este script facilita la subida del proyecto a GitHub

echo 🚀 Iniciando despliegue de Localix...

REM Verificar si git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ [ERROR] Git no está instalado. Por favor instala Git primero.
    pause
    exit /b 1
)

REM Verificar si estamos en un repositorio git
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo [INFO] Inicializando repositorio Git...
    git init
)

REM Verificar el estado del repositorio
echo [INFO] Verificando estado del repositorio...

REM Agregar todos los archivos
echo [INFO] Agregando archivos al staging area...
git add .

REM Verificar si hay cambios para commitear
git diff --cached --quiet
if errorlevel 1 (
    echo [INFO] Hay cambios para commitear.
) else (
    echo ⚠️ [WARNING] No hay cambios para commitear.
    pause
    exit /b 0
)

REM Solicitar mensaje de commit
echo.
echo [INFO] Ingresa un mensaje de commit (o presiona Enter para usar el mensaje por defecto):
set /p commit_message=

if "!commit_message!"=="" (
    set commit_message=🚀 Initial commit: Localix - Sistema de Gestión de Inventario

✨ Características principales:
- Backend Django con API REST
- Frontend React/Electron
- Gestión de productos con múltiples colores
- Sistema de ventas y clientes
- Dashboard con estadísticas
- Exportación a Excel
- Tema claro/oscuro

🔧 Tecnologías:
- Django 4.2+
- React 18+
- Electron 25+
- Tailwind CSS
- PostgreSQL/SQLite
)

REM Hacer commit
echo [INFO] Haciendo commit con mensaje: !commit_message!
git commit -m "!commit_message!"

REM Verificar si el remote existe
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [INFO] Configurando remote origin...
    git remote add origin https://github.com/miguelnexs/localix.git
)

REM Verificar si la rama main existe
git branch --list | findstr "main" >nul
if errorlevel 1 (
    echo [INFO] Creando rama main...
    git branch -M main
)

REM Hacer push
echo [INFO] Subiendo cambios a GitHub...
git push -u origin main
if errorlevel 1 (
    echo ❌ [ERROR] Error al subir el proyecto. Verifica tus credenciales de GitHub.
    echo 💡 [WARNING] Asegúrate de tener configurado tu token de acceso personal.
    pause
    exit /b 1
) else (
    echo ✅ [SUCCESS] ¡Proyecto subido exitosamente a GitHub!
    echo 🌐 [SUCCESS] Repositorio: https://github.com/miguelnexs/localix
)

REM Mostrar información adicional
echo.
echo 🎉 [SUCCESS] ¡Despliegue completado!
echo.
echo [INFO] 📋 Próximos pasos:
echo    1. Verifica el repositorio en GitHub
echo    2. Configura GitHub Pages si es necesario
echo    3. Revisa las GitHub Actions
echo    4. Actualiza la documentación si es necesario
echo.
echo [INFO] 🔗 Enlaces útiles:
echo    - Repositorio: https://github.com/miguelnexs/localix
echo    - Issues: https://github.com/miguelnexs/localix/issues
echo    - Wiki: https://github.com/miguelnexs/localix/wiki
echo.

echo ✨ [SUCCESS] ¡Localix está ahora disponible en GitHub!
pause
