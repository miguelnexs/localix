---
name: Testing Issue
about: Report a testing problem or suggest test improvements
title: '[TESTING] '
labels: 'testing'
assignees: 'miguelnexs'

---

## 🧪 Reporte de Testing

### 🔍 Tipo de Problema

- [ ] **Test fallando**: Un test que está fallando
- [ ] **Test faltante**: Falta un test para una funcionalidad
- [ ] **Cobertura**: Baja cobertura de tests
- [ ] **Test lento**: Tests que tardan demasiado
- [ ] **Test flaky**: Tests que fallan intermitentemente
- [ ] **Test obsoleto**: Tests que ya no son relevantes
- [ ] **Mejora**: Sugerencia para mejorar los tests

### 📋 Descripción

Describe el problema de testing de manera clara:

- **Qué está mal**: ¿Qué test o funcionalidad tiene problemas?
- **Impacto**: ¿Cómo afecta la calidad del código?
- **Contexto**: ¿En qué circunstancias ocurre?

### 🔍 Pasos para Reproducir

Para tests que fallan:

1. Ejecuta el comando '...'
2. Ve a la línea '....'
3. Observa el error '....'

### 📊 Información del Test

- **Archivo de test**: [ej. test_products.py, ProductList.test.js]
- **Función/Clase**: [ej. test_create_product, ProductList.test]
- **Línea**: [ej. línea 45]
- **Tiempo de ejecución**: [ej. 2.5 segundos]

### 🐛 Error del Test

Si el test está fallando, incluye el error completo:

```bash
# Comando ejecutado
python manage.py test productos.tests.test_create_product

# Error obtenido
Traceback (most recent call last):
  File "test_products.py", line 45, in test_create_product
    self.assertEqual(product.name, "Test Product")
AssertionError: 'Test Product' != 'Test Product Modified'
```

### 📈 Cobertura de Tests

Si es un problema de cobertura:

- **Cobertura actual**: [ej. 65%]
- **Cobertura esperada**: [ej. 80%]
- **Archivos sin cobertura**: [ej. models.py, views.py]
- **Funciones sin cobertura**: [ej. create_product, update_product]

### 🎯 Área Afectada

- [ ] **Backend**: Tests de Django/Python
- [ ] **Frontend**: Tests de React/JavaScript
- [ ] **API**: Tests de endpoints
- [ ] **Base de datos**: Tests de modelos
- [ ] **Integración**: Tests de integración
- [ ] **E2E**: Tests end-to-end

### 🔧 Entorno de Testing

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Node.js**: [ej. 18.0.0]
- **Base de datos**: [ej. SQLite, PostgreSQL]
- **Herramientas**: [ej. pytest, jest, cypress]

### 📝 Test Faltante

Si falta un test, describe qué debería probar:

- **Funcionalidad**: ¿Qué funcionalidad necesita testing?
- **Casos de prueba**: ¿Qué casos específicos deberían cubrirse?
- **Importancia**: ¿Por qué es importante este test?

### 🐌 Test Lento

Si el test es lento:

- **Tiempo actual**: [ej. 30 segundos]
- **Tiempo esperado**: [ej. 5 segundos]
- **Operaciones lentas**: [ej. consultas a base de datos, llamadas HTTP]
- **Frecuencia**: [ej. cada commit, solo en CI]

### 🔄 Test Flaky

Si el test falla intermitentemente:

- **Frecuencia**: [ej. 30% de las veces]
- **Condiciones**: [ej. solo en CI, solo en ciertos horarios]
- **Patrón**: [ej. siempre falla en la segunda ejecución]

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar los tests:

- **Optimización**: Cómo hacer los tests más rápidos
- **Cobertura**: Cómo aumentar la cobertura
- **Organización**: Cómo mejorar la estructura de tests
- **Herramientas**: Nuevas herramientas de testing

### 📸 Capturas de Pantalla

Si es aplicable, incluye:
- Capturas de herramientas de testing
- Gráficos de cobertura
- Logs de ejecución de tests

### 🔗 Enlaces Útiles

- [Guía de Testing](https://github.com/miguelnexs/localix/wiki/testing)
- [Herramientas de Testing](https://github.com/miguelnexs/localix/wiki/testing-tools)
- [Cobertura de Tests](https://github.com/miguelnexs/localix/wiki/test-coverage)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de testing.

---

**Gracias por reportar este problema de testing. Tu feedback nos ayuda a mantener Localix confiable y de alta calidad.** 🧪
