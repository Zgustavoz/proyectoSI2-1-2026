# pylint: disable=C0114,C0115
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Usuario, Rol, Permiso

@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'is_active', 'is_online']
    list_filter = ['is_active', 'is_online', 'roles']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    fieldsets = UserAdmin.fieldsets + (
        ('Info adicional', {'fields': ('telefono', 'is_online', 'ultima_conexion', 'roles')}),
    )

@admin.register(Rol)
class RolAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'descripcion', 'es_admin', 'is_active', 'fecha_creacion']
    list_filter = ['is_active', 'es_admin']
    search_fields = ['nombre']

@admin.register(Permiso)
class PermisoAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'codename', 'is_active', 'fecha_creacion']
    list_filter = ['is_active']
    search_fields = ['nombre', 'codename']
