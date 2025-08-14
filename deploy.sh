#!/bin/bash

# 🚀 Script de Despliegue para Localix
# Este script facilita la subida del proyecto a GitHub

set -e  # Salir si hay algún error

echo "🚀 Iniciando despliegue de Localix..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    print_error "Git no está instalado. Por favor instala Git primero."
    exit 1
fi

# Verificar si estamos en un repositorio git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Inicializando repositorio Git..."
    git init
fi

# Verificar el estado del repositorio
print_status "Verificando estado del repositorio..."

# Agregar todos los archivos
print_status "Agregando archivos al staging area..."
git add .

# Verificar si hay cambios para commitear
if git diff --cached --quiet; then
    print_warning "No hay cambios para commitear."
    exit 0
fi

# Solicitar mensaje de commit
echo ""
print_status "Ingresa un mensaje de commit (o presiona Enter para usar el mensaje por defecto):"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="🚀 Initial commit: Localix - Sistema de Gestión de Inventario

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
- PostgreSQL/SQLite"
fi

# Hacer commit
print_status "Haciendo commit con mensaje: $commit_message"
git commit -m "$commit_message"

# Verificar si el remote existe
if ! git remote get-url origin &> /dev/null; then
    print_status "Configurando remote origin..."
    git remote add origin https://github.com/miguelnexs/localix.git
fi

# Verificar si la rama main existe
if ! git branch --list | grep -q "main"; then
    print_status "Creando rama main..."
    git branch -M main
fi

# Hacer push
print_status "Subiendo cambios a GitHub..."
if git push -u origin main; then
    print_success "✅ ¡Proyecto subido exitosamente a GitHub!"
    print_success "🌐 Repositorio: https://github.com/miguelnexs/localix"
else
    print_error "❌ Error al subir el proyecto. Verifica tus credenciales de GitHub."
    print_warning "💡 Asegúrate de tener configurado tu token de acceso personal."
    exit 1
fi

# Mostrar información adicional
echo ""
print_success "🎉 ¡Despliegue completado!"
echo ""
print_status "📋 Próximos pasos:"
echo "   1. Verifica el repositorio en GitHub"
echo "   2. Configura GitHub Pages si es necesario"
echo "   3. Revisa las GitHub Actions"
echo "   4. Actualiza la documentación si es necesario"
echo ""
print_status "🔗 Enlaces útiles:"
echo "   - Repositorio: https://github.com/miguelnexs/localix"
echo "   - Issues: https://github.com/miguelnexs/localix/issues"
echo "   - Wiki: https://github.com/miguelnexs/localix/wiki"
echo ""

print_success "✨ ¡Localix está ahora disponible en GitHub!"
