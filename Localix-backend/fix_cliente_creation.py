#!/usr/bin/env python3
"""
Script para corregir problemas con la creación de clientes en Localix
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from ventas.models import Cliente
from django.db import connection

User = get_user_model()

def verificar_base_datos():
    """Verificar que la base de datos esté configurada correctamente"""
    print("🔍 Verificando base de datos...")
    
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ Base de datos conectada: {version[0]}")
            
            # Verificar que la tabla de clientes existe
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'ventas_cliente';
            """)
            
            if cursor.fetchone():
                print("✅ Tabla ventas_cliente existe")
            else:
                print("❌ Tabla ventas_cliente no existe")
                return False
                
    except Exception as e:
        print(f"❌ Error verificando base de datos: {e}")
        return False
    
    return True

def verificar_migraciones():
    """Verificar que las migraciones estén aplicadas"""
    print("🔍 Verificando migraciones...")
    
    try:
        # Ejecutar makemigrations
        print("📝 Ejecutando makemigrations...")
        execute_from_command_line(['manage.py', 'makemigrations', 'ventas'])
        
        # Ejecutar migrate
        print("🔄 Ejecutando migrate...")
        execute_from_command_line(['manage.py', 'migrate'])
        
        print("✅ Migraciones aplicadas correctamente")
        return True
        
    except Exception as e:
        print(f"❌ Error aplicando migraciones: {e}")
        return False

def verificar_usuarios():
    """Verificar que existan usuarios en el sistema"""
    print("🔍 Verificando usuarios...")
    
    try:
        usuarios = User.objects.all()
        print(f"✅ Usuarios encontrados: {usuarios.count()}")
        
        if usuarios.count() == 0:
            print("⚠️ No hay usuarios en el sistema")
            print("🔧 Creando usuario de prueba...")
            
            # Crear usuario de prueba
            usuario = User.objects.create_user(
                username='admin',
                email='admin@localix.com',
                password='admin123',
                first_name='Administrador',
                last_name='Sistema'
            )
            print(f"✅ Usuario creado: {usuario.username}")
            return usuario
        else:
            print("✅ Usuarios existentes:")
            for usuario in usuarios[:5]:  # Mostrar solo los primeros 5
                print(f"  - {usuario.username} ({usuario.email})")
            return usuarios.first()
            
    except Exception as e:
        print(f"❌ Error verificando usuarios: {e}")
        return None

def verificar_clientes():
    """Verificar que se puedan crear clientes"""
    print("🔍 Verificando creación de clientes...")
    
    try:
        # Obtener un usuario para la prueba
        usuario = User.objects.first()
        if not usuario:
            print("❌ No hay usuarios disponibles para la prueba")
            return False
        
        # Verificar clientes existentes
        clientes_existentes = Cliente.objects.filter(usuario=usuario).count()
        print(f"✅ Clientes existentes para {usuario.username}: {clientes_existentes}")
        
        # Intentar crear un cliente de prueba
        cliente_prueba = Cliente.objects.create(
            usuario=usuario,
            nombre='Cliente de Prueba',
            email='test@example.com',
            telefono='3001234567',
            tipo_documento='dni',
            numero_documento='12345678',
            direccion='Dirección de prueba',
            activo=True
        )
        
        print(f"✅ Cliente de prueba creado exitosamente: {cliente_prueba.nombre}")
        
        # Eliminar el cliente de prueba
        cliente_prueba.delete()
        print("✅ Cliente de prueba eliminado")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creando cliente de prueba: {e}")
        return False

def verificar_permisos():
    """Verificar permisos de la base de datos"""
    print("🔍 Verificando permisos de base de datos...")
    
    try:
        with connection.cursor() as cursor:
            # Verificar permisos de inserción
            cursor.execute("""
                SELECT has_table_privilege('ventas_cliente', 'INSERT') as can_insert,
                       has_table_privilege('ventas_cliente', 'SELECT') as can_select,
                       has_table_privilege('ventas_cliente', 'UPDATE') as can_update,
                       has_table_privilege('ventas_cliente', 'DELETE') as can_delete;
            """)
            
            permisos = cursor.fetchone()
            print(f"✅ Permisos de tabla ventas_cliente:")
            print(f"  - INSERT: {permisos[0]}")
            print(f"  - SELECT: {permisos[1]}")
            print(f"  - UPDATE: {permisos[2]}")
            print(f"  - DELETE: {permisos[3]}")
            
            return all(permisos)
            
    except Exception as e:
        print(f"❌ Error verificando permisos: {e}")
        return False

def corregir_problemas():
    """Corregir problemas identificados"""
    print("🔧 Iniciando corrección de problemas...")
    
    # 1. Verificar base de datos
    if not verificar_base_datos():
        print("❌ Problemas con la base de datos")
        return False
    
    # 2. Verificar migraciones
    if not verificar_migraciones():
        print("❌ Problemas con las migraciones")
        return False
    
    # 3. Verificar permisos
    if not verificar_permisos():
        print("❌ Problemas con los permisos")
        return False
    
    # 4. Verificar usuarios
    usuario = verificar_usuarios()
    if not usuario:
        print("❌ Problemas con los usuarios")
        return False
    
    # 5. Verificar creación de clientes
    if not verificar_clientes():
        print("❌ Problemas con la creación de clientes")
        return False
    
    print("✅ Todos los problemas han sido corregidos")
    return True

def mostrar_estado():
    """Mostrar el estado actual del sistema"""
    print("\n📊 ESTADO ACTUAL DEL SISTEMA:")
    print("=" * 50)
    
    try:
        # Usuarios
        usuarios_count = User.objects.count()
        print(f"👥 Usuarios: {usuarios_count}")
        
        # Clientes
        clientes_count = Cliente.objects.count()
        print(f"👤 Clientes: {clientes_count}")
        
        # Clientes por usuario
        for usuario in User.objects.all()[:3]:  # Solo los primeros 3
            clientes_usuario = Cliente.objects.filter(usuario=usuario).count()
            print(f"  - {usuario.username}: {clientes_usuario} clientes")
        
        # Últimos clientes creados
        ultimos_clientes = Cliente.objects.order_by('-fecha_registro')[:5]
        if ultimos_clientes:
            print(f"\n📅 Últimos clientes creados:")
            for cliente in ultimos_clientes:
                print(f"  - {cliente.nombre} ({cliente.fecha_registro.strftime('%Y-%m-%d %H:%M')})")
        
    except Exception as e:
        print(f"❌ Error obteniendo estado: {e}")

def main():
    """Función principal"""
    print("🚀 SCRIPT DE CORRECCIÓN DE PROBLEMAS CON CLIENTES")
    print("=" * 60)
    
    # Mostrar estado inicial
    mostrar_estado()
    
    print("\n🔧 INICIANDO CORRECCIÓN...")
    print("=" * 30)
    
    # Ejecutar correcciones
    if corregir_problemas():
        print("\n✅ CORRECCIÓN COMPLETADA EXITOSAMENTE")
        print("=" * 40)
        
        # Mostrar estado final
        mostrar_estado()
        
        print("\n🎉 El sistema está listo para crear clientes")
        print("💡 Si sigues teniendo problemas, verifica:")
        print("   1. Que el servidor Django esté ejecutándose")
        print("   2. Que las credenciales de autenticación sean correctas")
        print("   3. Que el frontend esté configurado correctamente")
        print("   4. Los logs del servidor para errores específicos")
    else:
        print("\n❌ LA CORRECCIÓN FALLÓ")
        print("=" * 25)
        print("🔍 Revisa los errores anteriores y verifica:")
        print("   1. La conexión a la base de datos")
        print("   2. Los permisos del usuario de la base de datos")
        print("   3. Las migraciones de Django")
        print("   4. La configuración del proyecto")

if __name__ == '__main__':
    main() 