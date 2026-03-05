# pylint: disable=C0114,C0115,C0116,no-member
from rest_framework import serializers
from ..models import Rol, Permiso
from .permiso import PermisoSerializer

class RolSerializer(serializers.ModelSerializer):
    permisos_info = PermisoSerializer(source='permisos', many=True, read_only=True)
    permisos_ids = serializers.PrimaryKeyRelatedField(
        queryset=Permiso.objects.filter(is_active=True),
        many=True,
        write_only=True,
        source='permisos',
        required=False
    )
    usuarios_count = serializers.IntegerField(source='usuarios.count', read_only=True)

    class Meta:
        model = Rol
        fields = [
            'id', 'nombre', 'descripcion', 'es_admin',
            'is_active', 'fecha_creacion', 'usuarios_count',
            'permisos_info', 'permisos_ids'
        ]
        read_only_fields = ['id', 'fecha_creacion', 'usuarios_count']

    def validate_nombre(self, value):
        if Rol.objects.filter(nombre=value).exists():
            if self.instance and self.instance.nombre == value:
                return value
            raise serializers.ValidationError("Ya existe un rol con este nombre")
        return value
