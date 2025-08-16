from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class Usuario(AbstractUser):
    ROLES = [
        ('admin', 'Administrador'),
        ('vendedor', 'Vendedor'),
        ('inventario', 'Inventario'),
        ('viewer', 'Solo Lectura'),
    ]
    
    email = models.EmailField(_('email address'), unique=True)
    nombre_completo = models.CharField(_('nombre completo'), max_length=255, blank=True)
    rol = models.CharField(_('rol'), max_length=20, choices=ROLES, default='vendedor')
    telefono = models.CharField(_('teléfono'), max_length=20, blank=True)
    direccion = models.TextField(_('dirección'), blank=True)
    fecha_nacimiento = models.DateField(_('fecha de nacimiento'), null=True, blank=True)
    foto_perfil = models.ImageField(_('foto de perfil'), upload_to='usuarios/fotos/', null=True, blank=True)
    es_activo = models.BooleanField(_('activo'), default=True)
    ultimo_acceso = models.DateTimeField(_('último acceso'), null=True, blank=True)
    fecha_creacion = models.DateTimeField(_('fecha de creación'), auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(_('fecha de actualización'), auto_now=True)
    
    # Campos requeridos para el login
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'nombre_completo']
    
    class Meta:
        verbose_name = _('usuario')
        verbose_name_plural = _('usuarios')
        db_table = 'usuarios_usuario'
    
    def __str__(self):
        return f"{self.nombre_completo} ({self.username})"
    
    def get_full_name(self):
        return self.nombre_completo or f"{self.first_name} {self.last_name}".strip()
    
    def get_short_name(self):
        return self.first_name or self.username
