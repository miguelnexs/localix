---
name: Frontend Issue
about: Report a frontend problem or suggest improvements
title: '[FRONTEND] '
labels: 'frontend'
assignees: 'miguelnexs'

---

## 🎯 Reporte de Frontend

### 🔍 Tipo de Problema

- [ ] **React**: Problema con componentes React
- [ ] **Electron**: Problema con la aplicación de escritorio
- [ ] **Estado**: Problema con gestión de estado
- [ ] **Rutas**: Problema con React Router
- [ ] **Estilos**: Problema con CSS/Tailwind
- [ ] **API**: Problema con llamadas a la API
- [ ] **Rendimiento**: Problema de rendimiento del frontend
- [ ] **Build**: Problema con el proceso de build
- [ ] **Dependencias**: Problema con librerías JavaScript

### 📋 Descripción

Describe el problema del frontend de manera clara:

- **Qué está mal**: ¿Qué funcionalidad tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ve a '...'
2. Haz clic en '....'
3. Realiza la acción '....'
4. Observa el error '....'

### ⚛️ Información de React

- **Componente**: [ej. ProductList, ProductForm, Dashboard]
- **Hook**: [ej. useState, useEffect, useCallback]
- **Estado**: [ej. products, loading, error]
- **Props**: [ej. product, onSave, onDelete]

### 🖥️ Información de Electron

- **Proceso**: [Main, Renderer, Preload]
- **Evento**: [ej. window-all-closed, ready-to-show]
- **API**: [ej. ipcRenderer, dialog, shell]
- **Configuración**: [ej. webPreferences, nodeIntegration]

### 🌐 Información de API

- **Endpoint**: [ej. /api/productos/]
- **Método**: [GET, POST, PUT, DELETE]
- **Headers**: [ej. Authorization, Content-Type]
- **Payload**: [ej. { name: "Producto", price: 100 }]

### 🎨 Información de Estilos

- **Framework**: [Tailwind CSS, CSS Modules, Styled Components]
- **Clase**: [ej. bg-blue-500, text-white, p-4]
- **Responsive**: [ej. md:flex, lg:grid, sm:hidden]
- **Tema**: [Claro, Oscuro, Ambos]

### 📱 Información de Dispositivos

- **OS**: [Windows, macOS, Linux]
- **Navegador**: [Chrome, Firefox, Safari, Edge]
- **Versión**: [ej. Chrome 96, Firefox 95]
- **Resolución**: [ej. 1920x1080, 1366x768]

### 🐛 Error de JavaScript

Si hay un error en la consola:

```javascript
// Error en la consola del navegador
Uncaught TypeError: Cannot read property 'name' of undefined
    at ProductCard (ProductCard.jsx:25)
    at render (ProductList.jsx:45)
    at ReactDOM.render (index.js:17)
```

### 📊 Estado de la Aplicación

Si es un problema con el estado:

```javascript
// Estado actual
{
  products: [],
  loading: true,
  error: "Failed to fetch products"
}

// Estado esperado
{
  products: [{ id: 1, name: "Producto 1" }],
  loading: false,
  error: null
}
```

### 🔄 Información de Rutas

- **Ruta**: [ej. /productos, /productos/1, /dashboard]
- **Parámetros**: [ej. id: 1, category: "electronics"]
- **Query**: [ej. search=producto, page=1]
- **Navegación**: [ej. Link, useNavigate, history.push]

### 🎯 Área Específica

- [ ] **Componentes**: Componentes React
- [ ] **Hooks**: Hooks personalizados
- [ ] **Context**: Context API
- [ ] **Redux**: Estado global (si se usa)
- [ ] **Router**: React Router
- [ ] **Estilos**: CSS y Tailwind
- [ ] **Build**: Vite/Webpack
- [ ] **Electron**: Proceso principal/renderer

### 🔧 Entorno de Desarrollo

- **Node.js**: [ej. 18.0.0]
- **React**: [ej. 18.2.0]
- **Electron**: [ej. 25.0.0]
- **Vite**: [ej. 4.0.0]
- **Tailwind**: [ej. 3.3.0]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Problema actual**: Cómo se ve ahora
- **Comportamiento esperado**: Cómo debería verse
- **Consola del navegador**: Errores en la consola
- **DevTools**: React DevTools, Network tab

### 💡 Sugerencias de Solución

Si tienes ideas para solucionar el problema:

- **Código**: Cambios específicos en el código
- **Estado**: Cambios en la gestión de estado
- **Estilos**: Cambios en CSS/Tailwind
- **Dependencias**: Actualizaciones de librerías

### 🔗 Enlaces Útiles

- [Documentación de React](https://reactjs.org/docs/)
- [Documentación de Electron](https://www.electronjs.org/docs)
- [Documentación de Tailwind](https://tailwindcss.com/docs)
- [Guía de Frontend](https://github.com/miguelnexs/localix/wiki/frontend)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema del frontend.

### 🎨 Código de Ejemplo

Si es relevante, incluye código que muestre el problema:

```jsx
// Componente con problema
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white p-4 rounded-lg">
      <h3>{product.name}</h3> {/* Error aquí si product es undefined */}
      <p>{product.price}</p>
    </div>
  );
};
```

---

**Gracias por reportar este problema del frontend. Tu feedback nos ayuda a mantener Localix hermoso y funcional.** 🎯
