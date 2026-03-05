# pylint: disable=C0114,C0115,C0116,no-member
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from ..models import Usuario, Rol
from .rol import RolSerializer
from ..models import Permiso

class UsuarioSerializer(serializers.ModelSerializer):
    roles_info = RolSerializer(source='roles', many=True, read_only=True)
    roles_ids = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.filter(is_active=True),
        many=True,
        write_only=True,
        source='roles',
        required=False
    )
    password = serializers.CharField(
        write_only=True,
        required=False,
        validators=[validate_password]
    )
    permisos = serializers.SerializerMethodField()
    permisos_nombres = serializers.SerializerMethodField()  # ← nuevo

    class Meta:
        model = Usuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'telefono', 'is_active', 'is_online', 'ultima_conexion',
            'date_joined', 'last_login', 'roles', 'roles_info',
            'roles_ids', 'password', 'permisos', 'permisos_nombres', 'es_admin'
        ]
        read_only_fields = [
            'id', 'date_joined', 'last_login',
            'permisos', 'permisos_nombres', 'es_admin', 'is_online', 'ultima_conexion'
        ]

    def get_permisos(self, obj):
        return obj.get_permisos()

    def get_permisos_nombres(self, obj):  # ← nuevo
        if obj.es_admin:
            return list(Permiso.objects.filter(is_active=True).values_list('nombre', flat=True))
        return list(
            obj.roles.filter(is_active=True)
            .values_list('permisos__nombre', flat=True)
            .distinct()
            .exclude(permisos__nombre=None)
        )

    def create(self, validated_data):
        roles_data = validated_data.pop('roles', [])
        password = validated_data.pop('password', None)
        user = Usuario.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
        if roles_data:
            user.roles.set(roles_data)
        user.save()
        return user

    def update(self, instance, validated_data):
        roles_data = validated_data.pop('roles', None)
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        if roles_data is not None:
            instance.roles.set(roles_data)
        instance.save()
        return instance
