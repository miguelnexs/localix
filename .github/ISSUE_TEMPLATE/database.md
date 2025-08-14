---
name: Database Issue
about: Report a problem with database functionality or suggest improvements
title: '[DATABASE] '
labels: 'database'
assignees: 'miguelnexs'

---

## 💾 Reporte de Base de Datos

### 🔍 Tipo de Problema

- [ ] **Conexión**: Problema con conexión a la base de datos
- [ ] **Consultas**: Problema con consultas SQL
- [ ] **Migraciones**: Problema con migraciones de Django
- [ ] **Modelos**: Problema con modelos de Django
- [ ] **Rendimiento**: Problema de rendimiento de consultas
- [ ] **Integridad**: Problema con integridad de datos
- [ ] **Backup**: Problema con respaldos de base de datos
- [ ] **Índices**: Problema con índices de base de datos
- [ ] **Transacciones**: Problema con transacciones

### 📋 Descripción

Describe el problema de base de datos de manera clara:

- **Qué está mal**: ¿Qué funcionalidad de base de datos tiene problemas?
- **Comportamiento esperado**: ¿Cómo debería funcionar?
- **Impacto**: ¿Cómo afecta a los usuarios?

### 🔍 Pasos para Reproducir

1. Ejecuta '....'
2. Haz consulta '....'
3. Observa el error '....'

### 💾 Información de Base de Datos

- **Tipo**: [ej. PostgreSQL, MySQL, SQLite, SQL Server]
- **Versión**: [ej. PostgreSQL 15, MySQL 8.0, SQLite 3.35]
- **Host**: [ej. localhost, 127.0.0.1, db.example.com]
- **Puerto**: [ej. 5432, 3306, 1433]

### 🔗 Información de Conexión

- **Estado**: [ej. Conectado, Desconectado, Timeout]
- **Pool de conexiones**: [ej. 10 conexiones, 50 conexiones]
- **Timeout**: [ej. 30 segundos, 60 segundos]
- **SSL**: [ej. Habilitado, Deshabilitado, Requerido]

### 📊 Información de Consultas

- **Tipo de consulta**: [ej. SELECT, INSERT, UPDATE, DELETE]
- **Tabla**: [ej. productos, clientes, ventas]
- **Complejidad**: [ej. Simple, JOIN, Subquery, Agregación]
- **Tiempo de ejecución**: [ej. 5 segundos, 30 segundos, Timeout]

### 🔄 Información de Migraciones

- **Migración problemática**: [ej. 0001_initial, 0002_add_field]
- **Estado**: [ej. Aplicada, Pendiente, Fallida]
- **Dependencias**: [ej. Sin dependencias, Depende de 0001]
- **Rollback**: [ej. Posible, No posible, Parcial]

### 🏗️ Información de Modelos

- **Modelo**: [ej. Product, Customer, Sale]
- **Campo problemático**: [ej. name, email, created_at]
- **Tipo de campo**: [ej. CharField, IntegerField, DateTimeField]
- **Restricciones**: [ej. unique=True, null=False, blank=False]

### 🐛 Error de Base de Datos

Si hay un error específico:

```sql
-- Error SQL
ERROR: relation "productos" does not exist
LINE 1: SELECT * FROM productos WHERE id = 1;
```

```python
# Error de Django
django.db.utils.OperationalError: connection to server at "localhost" (127.0.0.1), port 5432 failed: Connection refused
```

### 📊 Datos de Ejemplo

Si es relevante, incluye ejemplos de los datos:

```sql
-- Consulta problemática
SELECT p.name, p.price, c.name as category_name
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
WHERE p.precio > 100
ORDER BY p.precio DESC;
```

```python
# Modelo problemático
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'productos'
```

### ⏱️ Información de Rendimiento

- **Tiempo de consulta**: [ej. 10 segundos]
- **Tiempo esperado**: [ej. 1 segundo]
- **Tamaño de datos**: [ej. 100,000 registros, 1GB]
- **Recursos**: [ej. CPU 90%, RAM 4GB, Disco lento]

### 🎯 Área Afectada

- [ ] **Frontend**: Llamadas que afectan la BD
- [ ] **Backend**: Lógica de base de datos
- [ ] **ORM**: Consultas de Django ORM
- [ ] **SQL**: Consultas SQL directas
- [ ] **Migraciones**: Sistema de migraciones
- [ ] **Backup**: Sistema de respaldos

### 🔧 Entorno de Desarrollo

- **OS**: [ej. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Python**: [ej. 3.11.0]
- **Django**: [ej. 4.2.0]
- **Driver**: [ej. psycopg2, mysqlclient, sqlite3]

### 📸 Capturas de Pantalla

**IMPORTANTE**: Incluye capturas de pantalla que muestren:

- **Herramienta de BD**: pgAdmin, MySQL Workbench, SQLite Browser
- **Error de consulta**: Error completo de la consulta
- **Logs de Django**: Logs de base de datos
- **Estado de migraciones**: Estado de las migraciones

### 💡 Sugerencias de Mejora

Si tienes ideas para mejorar la base de datos:

- **Mejores consultas**: Optimizaciones de consultas
- **Mejores índices**: Índices que faltan
- **Mejor estructura**: Cambios en la estructura
- **Mejor rendimiento**: Optimizaciones generales

### 🔗 Enlaces Útiles

- [Guía de Base de Datos](https://github.com/miguelnexs/localix/wiki/database)
- [Migraciones](https://github.com/miguelnexs/localix/wiki/migrations)
- [Optimización](https://github.com/miguelnexs/localix/wiki/database-optimization)

### 📝 Información Adicional

Agrega cualquier otra información relevante sobre el problema de base de datos.

### 🎯 Casos de Uso

- **Uso típico**: ¿Cómo usas normalmente la base de datos?
- **Frecuencia**: ¿Con qué frecuencia haces consultas?
- **Propósito**: ¿Qué datos consultas/modificas?

### 📊 Métricas de Base de Datos

- **Tamaño**: [ej. 1GB, 10GB, 100GB]
- **Registros**: [ej. 100,000 productos, 50,000 clientes]
- **Consultas por día**: [ej. 10,000 consultas]
- **Tiempo promedio**: [ej. 500ms por consulta]

### 🔄 Transacciones

- **Tipo**: [ej. ACID, No ACID]
- **Isolation level**: [ej. READ COMMITTED, SERIALIZABLE]
- **Rollback**: [ej. Automático, Manual, No disponible]
- **Deadlocks**: [ej. Frecuentes, Ocasionales, Nunca]

### 📈 Índices

- **Índices existentes**: [ej. PRIMARY KEY, UNIQUE, INDEX]
- **Índices faltantes**: [ej. Para búsquedas, Para ordenamiento]
- **Fragmentación**: [ej. Alta, Media, Baja]
- **Mantenimiento**: [ej. Automático, Manual, No disponible]

### 🔒 Seguridad

- **Autenticación**: [ej. Usuario/contraseña, Certificados]
- **Autorización**: [ej. Roles, Permisos, Schemas]
- **Encriptación**: [ej. En tránsito, En reposo, No disponible]
- **Auditoría**: [ej. Logs completos, Logs parciales, No disponible]

---

**Gracias por reportar este problema de base de datos. Tu feedback nos ayuda a mantener Localix como una herramienta confiable para el almacenamiento de datos.** 💾
