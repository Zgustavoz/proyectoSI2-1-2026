"""modelo rol"""
from django.db import models
from .permiso import Permiso

class Rol(models.Model):
    """clase rol"""
    nombre = models.CharField(max_length=100, unique=True)
    descripcion = models.TextField(blank=True)
    es_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  # ← estado
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    permisos = models.ManyToManyField(Permiso, blank=True, related_name='roles')

    class Meta:
        """meta"""
        db_table = 'roles'
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return str(self.nombre)
