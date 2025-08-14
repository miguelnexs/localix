# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Localix! Este documento te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Configuración del entorno de desarrollo](#configuración-del-entorno-de-desarrollo)
- [Flujo de trabajo](#flujo-de-trabajo)
- [Estándares de código](#estándares-de-código)
- [Tests](#tests)
- [Documentación](#documentación)
- [Reportar bugs](#reportar-bugs)
- [Solicitar características](#solicitar-características)
- [Preguntas frecuentes](#preguntas-frecuentes)

## 🚀 ¿Cómo puedo contribuir?

Hay muchas formas de contribuir a Localix:

### 🐛 Reportar Bugs
- Usa la plantilla de bug report
- Proporciona información detallada
- Incluye pasos para reproducir

### 💡 Sugerir Características
- Usa la plantilla de feature request
- Explica el caso de uso
- Considera el impacto en otros usuarios

### 🔧 Mejorar el Código
- Corregir bugs
- Agregar nuevas características
- Mejorar el rendimiento
- Refactorizar código

### 📚 Mejorar la Documentación
- Actualizar el README
- Agregar comentarios al código
- Crear guías de usuario
- Traducir documentación

### 🧪 Mejorar los Tests
- Agregar tests faltantes
- Mejorar la cobertura
- Optimizar tests existentes

## 🛠️ Configuración del Entorno de Desarrollo

### Prerrequisitos
- Python 3.8+
- Node.js 18+
- Git
- Un editor de código (VS Code recomendado)

### Configuración Inicial

1. **Fork el repositorio**
   ```bash
   # Ve a https://github.com/miguelnexs/localix
   # Haz clic en "Fork"
   ```

2. **Clona tu fork**
   ```bash
   git clone https://github.com/TU_USUARIO/localix.git
   cd localix
   ```

3. **Configura el upstream**
   ```bash
   git remote add upstream https://github.com/miguelnexs/localix.git
   ```

4. **Configura el backend**
   ```bash
   cd Localix-backend
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py runserver
   ```

5. **Configura el frontend**
   ```bash
   cd Localix-dashboard
   npm install
   npm run dev
   ```

## 🔄 Flujo de Trabajo

### 1. Mantén tu fork actualizado
```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### 2. Crea una rama para tu trabajo
```bash
git checkout -b feature/nombre-de-la-caracteristica
# o
git checkout -b fix/nombre-del-bug
```

### 3. Haz tus cambios
- Escribe código limpio y bien documentado
- Sigue los estándares de código
- Agrega tests cuando sea apropiado

### 4. Commit tus cambios
```bash
git add .
git commit -m "feat: agregar nueva característica

- Descripción detallada de los cambios
- Impacto en el usuario
- Tests agregados"
```

### 5. Push y crea un Pull Request
```bash
git push origin feature/nombre-de-la-caracteristica
# Ve a GitHub y crea un Pull Request
```

## 📝 Estándares de Código

### Python (Backend)
- **PEP 8**: Sigue las guías de estilo de Python
- **Docstrings**: Documenta todas las funciones y clases
- **Type hints**: Usa type hints cuando sea posible
- **Imports**: Organiza los imports correctamente

```python
from typing import List, Optional
from django.db import models
from django.contrib.auth.models import User


class Product(models.Model):
    """Modelo para representar un producto en el sistema."""
    
    name: str = models.CharField(max_length=200)
    description: Optional[str] = models.TextField(blank=True)
    price: float = models.DecimalField(max_digits=10, decimal_places=2)
    
    def get_display_price(self) -> str:
        """Retorna el precio formateado para mostrar."""
        return f"${self.price:.2f}"
```

### JavaScript/React (Frontend)
- **ESLint**: Sigue las reglas de ESLint
- **Prettier**: Usa Prettier para formateo
- **JSDoc**: Documenta funciones complejas
- **Hooks**: Usa hooks de React apropiadamente

```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar la lista de productos
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.products - Lista de productos
 * @param {Function} props.onProductSelect - Callback cuando se selecciona un producto
 */
const ProductList = ({ products, onProductSelect }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);
  
  return (
    <div className="product-list">
      {filteredProducts.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onProductSelect}
        />
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onProductSelect: PropTypes.func.isRequired,
};

export default ProductList;
```

### CSS/Tailwind
- **Tailwind CSS**: Usa clases de Tailwind cuando sea posible
- **Componentes**: Crea componentes reutilizables
- **Responsive**: Asegúrate de que sea responsive

```css
/* Usar Tailwind cuando sea posible */
.product-card {
  @apply bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow;
}

/* CSS personalizado solo cuando sea necesario */
.custom-animation {
  animation: fadeIn 0.3s ease-in-out;
}
```

## 🧪 Tests

### Backend Tests
```bash
cd Localix-backend
python manage.py test
```

### Frontend Tests
```bash
cd Localix-dashboard
npm test
```

### Cobertura de Tests
- Backend: Mínimo 80% de cobertura
- Frontend: Mínimo 70% de cobertura

## 📚 Documentación

### Comentarios en el Código
- Explica el "por qué", no el "qué"
- Usa comentarios para lógica compleja
- Mantén los comentarios actualizados

### README
- Mantén el README actualizado
- Agrega ejemplos de uso
- Documenta cambios importantes

### Wiki
- Crea páginas para características complejas
- Agrega guías paso a paso
- Mantén la documentación organizada

## 🐛 Reportar Bugs

### Antes de reportar
1. Busca en issues existentes
2. Verifica que no sea un problema de configuración
3. Revisa la documentación

### Información necesaria
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Información del sistema
- Logs de error

## 💡 Solicitar Características

### Antes de solicitar
1. Verifica que no exista ya
2. Considera el impacto en otros usuarios
3. Piensa en la implementación

### Información necesaria
- Descripción de la característica
- Caso de uso específico
- Beneficios para los usuarios
- Consideraciones técnicas

## ❓ Preguntas Frecuentes

### ¿Cómo sé si mi contribución será aceptada?
- Sigue las guías de contribución
- Escribe código limpio y bien documentado
- Agrega tests cuando sea apropiado
- Comunícate claramente

### ¿Qué pasa si mi PR no es aceptado?
- No te desanimes
- Pregunta por qué no fue aceptado
- Aprende de los comentarios
- Inténtalo de nuevo

### ¿Cómo puedo obtener ayuda?
- Revisa la documentación
- Busca en issues existentes
- Pregunta en Discussions
- Contacta al equipo

## 🎉 Reconocimiento

Todas las contribuciones son valiosas y serán reconocidas:

- **Contribuidores**: Listados en el README
- **Mantenedores**: Reconocimiento especial
- **Créditos**: En releases y documentación

## 📞 Contacto

Si tienes preguntas sobre contribuir:

- **Issues**: Para bugs y características
- **Discussions**: Para preguntas generales
- **Email**: miguel@example.com

---

**¡Gracias por contribuir a Localix!** 🚀
