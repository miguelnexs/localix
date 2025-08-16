from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from .models import Usuario

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ('username', 'email', 'nombre_completo', 'rol', 'es_activo', 'ultimo_acceso', 'fecha_creacion')
    list_filter = ('rol', 'es_activo', 'is_staff', 'is_superuser', 'fecha_creacion')
    search_fields = ('username', 'email', 'nombre_completo', 'first_name', 'last_name')
    ordering = ('-fecha_creacion',)
    
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Información Personal'), {
            'fields': ('nombre_completo', 'first_name', 'last_name', 'email', 'foto_perfil')
        }),
        (_('Información de Contacto'), {
            'fields': ('telefono', 'direccion', 'fecha_nacimiento')
        }),
        (_('Permisos'), {
            'fields': ('rol', 'es_activo', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Fechas importantes'), {
            'fields': ('last_login', 'ultimo_acceso', 'fecha_creacion', 'fecha_actualizacion'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'nombre_completo', 'password1', 'password2', 'rol'),
        }),
    )
    
    readonly_fields = ('fecha_creacion', 'fecha_actualizacion', 'ultimo_acceso')
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()
