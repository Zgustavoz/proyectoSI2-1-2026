#pylint: disable=no-member,abstract-method
"""auth serializer"""
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from ..models import Usuario, Rol
from ..models import Permiso

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """z"""
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email if user.email else ''
        token['roles'] = list(
            user.roles.filter(is_active=True).values_list('nombre', flat=True)
        )
        token['roles_ids'] = list(
            user.roles.filter(is_active=True).values_list('id', flat=True)
        )
        token['es_admin'] = user.es_admin

        # Codenames para verificar permisos
        token['permisos'] = user.get_permisos()

        # Nombres para mostrar en UI
        if user.es_admin:
            token['permisos_nombres'] = list(
                Permiso.objects.filter(is_active=True)
                .values_list('nombre', flat=True)
            )
        else:
            token['permisos_nombres'] = list(
                user.roles.filter(is_active=True)
                .values_list('permisos__nombre', flat=True)
                .distinct()
                .exclude(permisos__nombre=None)
            )

        return token


class RegistroSerializer(serializers.ModelSerializer):
    """z"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        """z"""
        model = Usuario
        fields = [
            'username', 'email', 'password', 'password2',
            'first_name', 'last_name', 'telefono'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')

        user = Usuario.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            telefono=validated_data.get('telefono', ''),
            password=validated_data['password']
        )

        # Asignar rol cliente automáticamente
        try:
            rol_cliente = Rol.objects.get(nombre='cliente')
            user.roles.add(rol_cliente)
        except Rol.DoesNotExist:
            pass

        return user
