"""permisos"""
from rest_framework.permissions import BasePermission
from rest_framework.permissions import SAFE_METHODS

class EsAdmin(BasePermission):
    """Solo administradores"""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.es_admin
        )


class EsAdminOSoloLectura(BasePermission):
    """Admin puede todo, autenticados solo lectura"""
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        return bool(
            request.user and
            request.user.is_authenticated and
            request.user.es_admin
        )


class TienePermiso(BasePermission):
    """
    Uso:
    permission_classes = [TienePermiso]
    permiso_requerido = 'P001'
    """
    permiso_requerido = None

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.es_admin:
            return True
        permiso = getattr(view, 'permiso_requerido', self.permiso_requerido)
        if not permiso:
            return True
        return permiso in request.user.get_permisos()


def permiso_requerido(codename):
    """
    Factory para crear permisos dinámicamente
    Uso:
    permission_classes = [permiso_requerido('P001')]
    """
    class PermisoRequerido(BasePermission):
        """z"""
        def has_permission(self, request, view):
            if not request.user or not request.user.is_authenticated:
                return False
            if request.user.es_admin:
                return True
            return codename in request.user.get_permisos()

    PermisoRequerido.__name__ = f'TienePermiso_{codename}'
    return PermisoRequerido
