"""
modelo permiso
"""
from django.db import models

class Permiso(models.Model):
    """modelo permiso"""
    nombre = models.CharField(max_length=100, unique=True)
    codename = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)  # ← estado
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        """meta"""
        db_table = 'permisos'
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return f"{self.nombre} ({self.codename})"
