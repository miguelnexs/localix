# 🛍️ Tienda Backend API

[![Django](https://img.shields.io/badge/Django-4.x-092E20?style=flat&logo=django&logoColor=white)](https://djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST_Framework-3.x-ff1709?style=flat)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org/)

API REST completa para sistema de tienda desarrollada con Django y Django REST Framework. Proporciona endpoints para gestión de productos, categorías, pedidos y ventas.

## 🚀 Características

### 📦 Gestión de Productos
- ✅ CRUD completo de productos
- 🎨 Sistema de colores y variantes
- 📸 Soporte para múltiples imágenes
- 📊 Control de stock por color/variante
- 🔍 Filtros avanzados y búsqueda

### 🏷️ Sistema de Categorías
- ✅ Categorías jerárquicas
- 🔗 Relaciones múltiples producto-categoría
- 📱 Optimizado para frontend

### 🛒 Pedidos y Ventas
- ✅ Gestión completa de pedidos
- 💰 Sistema de ventas con múltiples métodos de pago
- 👤 Gestión de clientes
- 📈 Tracking de estados

## 🛠️ Tecnologías Utilizadas

- **Backend Framework**: Django 4.x
- **API**: Django REST Framework
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Autenticación**: Django Auth + DRF Token Auth
- **Filtros**: Django Filter
- **CORS**: Django CORS Headers

## 📁 Estructura del Proyecto

```
Backend/
├── Backend/           # Configuración principal Django
│   ├── settings.py    # Configuraciones
│   ├── urls.py        # URLs principales
│   └── wsgi.py        # WSGI application
├── categorias/        # App gestión de categorías
├── productos/         # App principal de productos
│   ├── models.py      # Modelos de productos, colores, variantes
│   ├── serializers/   # Serializadores organizados
│   ├── views/         # Vistas organizadas por funcionalidad
│   └── filters.py     # Filtros personalizados
├── pedidos/           # App gestión de pedidos
├── ventas/            # App procesamiento de ventas
└── requirements.txt   # Dependencias
```

## ⚡ Instalación y Configuración

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/miguelnexs/Tienda-backend.git
cd Tienda-backend
```

### 2️⃣ Crear entorno virtual
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 3️⃣ Instalar dependencias
```bash
pip install -r requirements.txt
```

### 4️⃣ Configurar base de datos
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5️⃣ Crear superusuario
```bash
python manage.py createsuperuser
```

### 6️⃣ Ejecutar servidor
```bash
python manage.py runserver
```

## 🔧 Configuración de Entorno

Copia `env.example` a `.env` y configura las variables:

```env
DEBUG=True
SECRET_KEY=tu-clave-secreta-aqui
DATABASE_URL=sqlite:///db.sqlite3
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

## 📚 API Endpoints

### Productos
- `GET /api/productos/` - Listar productos con filtros
- `POST /api/productos/` - Crear producto
- `GET /api/productos/{id}/` - Detalle producto
- `PUT /api/productos/{id}/` - Actualizar producto
- `DELETE /api/productos/{id}/` - Eliminar producto

### Categorías
- `GET /api/categorias/` - Listar categorías
- `POST /api/categorias/` - Crear categoría
- `GET /api/categorias/{id}/productos/` - Productos por categoría

### Ventas
- `POST /api/ventas/` - Procesar venta
- `GET /api/ventas/` - Historial de ventas
- `GET /api/ventas/{id}/` - Detalle venta

### Pedidos
- `GET /api/pedidos/` - Listar pedidos
- `POST /api/pedidos/` - Crear pedido
- `PUT /api/pedidos/{id}/estado/` - Actualizar estado

## 🔍 Filtros Disponibles

### Productos
- `categoria` - Filtrar por categoría
- `precio_min` / `precio_max` - Rango de precios
- `disponible` - Solo productos disponibles
- `search` - Búsqueda por nombre/descripción
- `color` - Filtrar por color disponible

## 🚀 Despliegue

### Heroku
```bash
# Instalar Heroku CLI y hacer login
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Docker
```dockerfile
# Dockerfile incluido en el proyecto
docker build -t tienda-backend .
docker run -p 8000:8000 tienda-backend  
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

**Miguel** - [@miguelnexs](https://github.com/miguelnexs)

## 🆘 Soporte

Si tienes problemas o preguntas:
- 🐛 [Reportar bug](https://github.com/miguelnexs/Tienda-backend/issues)
- 💡 [Solicitar feature](https://github.com/miguelnexs/Tienda-backend/issues)
- 📧 Contacto directo

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐ 