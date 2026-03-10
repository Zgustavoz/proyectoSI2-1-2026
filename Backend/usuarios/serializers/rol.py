# pylint: disable=C0114,C0115,C0116,no-member,W0212
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

    def create(self, validated_data):
        permisos_data = validated_data.pop('permisos', [])
        rol = Rol.objects.create(**validated_data)
        if permisos_data:
            rol.permisos.set(permisos_data)
        rol._skip_signal = True
        rol.save()
        return rol

    def update(self, instance, validated_data):
        permisos_data = validated_data.pop('permisos', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if permisos_data is not None:
            instance.permisos.set(permisos_data)
        instance.save()
        return instance
