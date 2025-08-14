---
name: Backend Issue
about: Report a backend problem or suggest improvements
title: '[BACKEND] '
labels: 'backend'
assignees: 'miguelnexs'

---

## 🔧 Reporte de Backend

### 🔍 Tipo de Problema

- [ ] **API**: Problema con endpoints de la API
- [ ] **Base de datos**: Problema con modelos o consultas
- [ ] **Autenticación**: Problema con login/registro
- [ ] **Validación**: Problema con validación de datos
- [ ] **Rendimiento**: Problema de rendimiento del servidor
- [ ] **Seguridad**: Problema de seguridad
- [ ] **Migración**: Problema con migraciones de base de datos
- [ ] **Configuración**: Problema de configuración
- [ ] **Dependencias**: Problema con librerías Python

### 📋 Descripción

Describe el problema del backend de manera clara:

- **Qué está mal**: ¿Qué funcionalidad tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ejecuta el comando '...'
2. Haz una petición a '....'
3. Observa el error '....'

### 🌐 Información de la API

- **Endpoint**: [ej. /api/productos/productos/]
- **Método**: [GET, POST, PUT, DELETE]
- **Parámetros**: [ej. page=1, search=producto]
- **Headers**: [ej. Authorization: Bearer token]

### 🗄️ Información de Base de Datos

- **Modelo**: [ej. Product, Category, User]
- **Campo**: [ej. name, price, created_at]
- **Tipo de consulta**: [ej. SELECT, INSERT, UPDATE, DELETE]
- **Base de datos**: [SQLite, PostgreSQL, MySQL]

### 📊 Logs del Servidor

Incluye los logs relevantes:

```python
# Log de Django
[2024-01-15 10:30:45] ERROR: Internal Server Error: /api/productos/
Traceback (most recent call last):
  File "views.py", line 45, in create_product
    product.save()
IntegrityError: UNIQUE constraint failed: productos_product.sku
```

### 🔐 Información de Autenticación

- **Tipo de autenticación**: [JWT, Session, Token]
- **Usuario**: [ej. admin, user123]
- **Permisos**: [ej. is_staff, is_superuser]
- **Rol**: [ej. admin, manager, user]

### 📝 Datos de Entrada

Si es un problema con datos de entrada:

```json
{
  "name": "Producto Test",
  "price": 99.99,
  "category": 1,
  "description": "Descripción del producto"
}
```

### 📤 Respuesta del Servidor

Si hay una respuesta de error:

```json
{
  "error": "Validation failed",
  "details": {
    "name": ["This field is required"],
    "price": ["Must be a positive number"]
  },
  "status_code": 400
}
```

### 🎯 Área Específica

- [ ] **Models**: Modelos de Django
- [ ] **Views**: Vistas y lógica de negocio
- [ ] **Serializers**: Serialización de datos
- [ ] **URLs**: Configuración de rutas
- [ ] **Settings**: Configuración de Django
- [ ] **Middleware**: Middleware personalizado
- [ ] **Signals**: Señales de Django
- [ ] **Admin**: Panel de administración

### 🔧 Entorno de Desarrollo

- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **DRF**: [ej. 3.14.0]
- **Base de datos**: [ej. SQLite 3.35.0]
- **OS**: [ej. Windows 10, Ubuntu 20.04]

### 🐛 Stack Trace

Si hay un error, incluye el stack trace completo:

```python
Traceback (most recent call last):
  File "manage.py", line 22, in execute_from_command_line
    utility.execute()
  File "django/core/management/__init__.py", line 419, in execute
    self.fetch_command(subcommand).run_from_argv(self.argv)
  File "django/core/management/base.py", line 373, in run_from_argv
    self.execute(*args, **cmd_options)
  File "django/core/management/base.py", line 419, in execute
    output = self.handle(*args, **options)
  File "productos/management/commands/import_products.py", line 45, in handle
    product.save()
  File "django/db/models/base.py", line 746, in save
    force_update=force_update, update_fields=update_fields)
  File "django/db/models/base.py", line 784, in force_insert
    updated = self._save_table(raw, cls, force_insert, force_update, using, update_fields)
  File "django/db/models/base.py", line 847, in _save_table
    result = self._do_insert(cls._meta, insert_pk, update_pk, raw, using, update_fields)
  File "django/db/models/deletion.py", line 19, in _do_insert
    return manager._insert([self], fields=fields, return_id=update_pk, using=using, raw=raw)
  File "django/db/models/manager.py", line 85, in _insert
    return query.get_compiler(using=using).execute_sql(return_id)
  File "django/db/models/sql/compiler.py", line 1140, in execute_sql
    cursor.execute(sql, params)
  File "django/db/backends/utils.py", line 67, in execute
    return self.cursor.execute(sql, params)
  File "django/db/backends/sqlite3/base.py", line 413, in execute
    return Database.Cursor.execute(self, query, params)
django.db.utils.IntegrityError: UNIQUE constraint failed: productos_product.sku
```

### 💡 Sugerencias de Solución

Si tienes ideas para solucionar el problema:

- **Código**: Cambios específicos en el código
- **Configuración**: Cambios en la configuración
- **Base de datos**: Cambios en la estructura de la BD
- **Dependencias**: Actualizaciones de librerías

### 🔗 Enlaces Útiles

- [Documentación de Django](https://docs.djangoproject.com/)
- [Documentación de DRF](https://www.django-rest-framework.org/)
- [Guía de Backend](https://github.com/miguelnexs/localix/wiki/backend)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema del backend.

---

**Gracias por reportar este problema del backend. Tu feedback nos ayuda a mantener Localix robusto y confiable.** 🔧
