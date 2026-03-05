#pylint: disable=E1101
"""Modelo Usuario extendido con roles y permisos."""
from django.contrib.auth.models import AbstractUser
from django.db import models
from .rol import Rol
from ..models.permiso import Permiso

class Usuario(AbstractUser):
    """
    Modelo de usuario extendido de Django.
    Incluye campos adicionales como teléfono, estado, roles y última conexión.
    """
    telefono = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    ultima_conexion = models.DateTimeField(null=True, blank=True)
    roles = models.ManyToManyField(Rol, blank=True, related_name='usuarios')

    class Meta:
        """Meta información del modelo Usuario."""
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    @property
    def es_admin(self):
        """Determina si el usuario es administrador."""
        return self.is_superuser or self.roles.filter(
            es_admin=True, is_active=True
        ).exists()

    def get_permisos(self):
        """Devuelve la lista de codenames de los permisos del usuario."""
        if self.es_admin:
            return list(Permiso.objects.values_list('codename', flat=True))
        return list(
            self.roles.filter(is_active=True)
            .values_list('permisos__codename', flat=True)
            .distinct()
            .exclude(permisos__codename=None)
        )

    def __str__(self):
        """Representación en string del usuario."""
        return str(self.username)


#z
