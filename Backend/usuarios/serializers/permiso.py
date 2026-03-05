#pylint: disable=no-member
"""z"""
from rest_framework import serializers
from ..models import Permiso

class PermisoSerializer(serializers.ModelSerializer):
    """z"""
    class Meta:
        """z"""
        model = Permiso
        fields = ['id', 'nombre', 'codename', 'descripcion', 'is_active', 'fecha_creacion']
        read_only_fields = ['id', 'fecha_creacion']

    def validate_codename(self, value):
        """z"""
        # Verificar que el codename sea único al crear o editar
        if Permiso.objects.filter(codename=value).exists():
            if self.instance and self.instance.codename == value:
                return value
            raise serializers.ValidationError("Ya existe un permiso con este codename")
        return value
