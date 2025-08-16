#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.db import connection

def create_table_manually():
    """Crear la tabla de usuarios manualmente"""
    
    print("🔧 Creando tabla de usuarios manualmente...")
    
    with connection.cursor() as cursor:
        # Crear la tabla usuarios_usuario
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios_usuario (
                id SERIAL PRIMARY KEY,
                password VARCHAR(128) NOT NULL,
                last_login TIMESTAMP WITH TIME ZONE,
                is_superuser BOOLEAN NOT NULL,
                username VARCHAR(150) UNIQUE NOT NULL,
                first_name VARCHAR(150) NOT NULL,
                last_name VARCHAR(150) NOT NULL,
                email VARCHAR(254) UNIQUE NOT NULL,
                is_staff BOOLEAN NOT NULL,
                is_active BOOLEAN NOT NULL,
                date_joined TIMESTAMP WITH TIME ZONE NOT NULL,
                nombre_completo VARCHAR(255) NOT NULL,
                rol VARCHAR(20) NOT NULL,
                telefono VARCHAR(20) NOT NULL,
                direccion TEXT NOT NULL,
                fecha_nacimiento DATE,
                foto_perfil VARCHAR(100),
                es_activo BOOLEAN NOT NULL,
                ultimo_acceso TIMESTAMP WITH TIME ZONE,
                fecha_creacion TIMESTAMP WITH TIME ZONE NOT NULL,
                fecha_actualizacion TIMESTAMP WITH TIME ZONE NOT NULL
            );
        """)
        
        # Crear la tabla usuarios_usuario_groups
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios_usuario_groups (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER NOT NULL REFERENCES usuarios_usuario(id) ON DELETE CASCADE,
                group_id INTEGER NOT NULL REFERENCES auth_group(id) ON DELETE CASCADE,
                UNIQUE(usuario_id, group_id)
            );
        """)
        
        # Crear la tabla usuarios_usuario_user_permissions
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS usuarios_usuario_user_permissions (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER NOT NULL REFERENCES usuarios_usuario(id) ON DELETE CASCADE,
                permission_id INTEGER NOT NULL REFERENCES auth_permission(id) ON DELETE CASCADE,
                UNIQUE(usuario_id, permission_id)
            );
        """)
        
        print("✅ Tablas creadas exitosamente!")
        
        # Marcar la migración como aplicada
        cursor.execute("""
            INSERT INTO django_migrations (app, name, applied) 
            VALUES ('usuarios', '0001_initial', NOW());
        """)
        
        print("✅ Migración marcada como aplicada")

if __name__ == '__main__':
    create_table_manually()
