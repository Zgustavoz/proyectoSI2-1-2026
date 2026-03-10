# pylint: disable=C0114,C0115,C0116,no-member,W0718
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from django.conf import settings
from ..serializers import CustomTokenObtainPairSerializer
from ..models import Bitacora

def _get_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded.split(',')[0] if x_forwarded else request.META.get('REMOTE_ADDR')

def set_auth_cookies(response, access_token, refresh_token=None):
    access_lifetime  = int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds())
    refresh_lifetime = int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds())
    cookie_secure    = settings.SIMPLE_JWT.get('AUTH_COOKIE_SECURE', False)
    cookie_samesite  = settings.SIMPLE_JWT.get('AUTH_COOKIE_SAMESITE', 'Lax')
    response.set_cookie(
        key='access_token', value=access_token,
        httponly=True, secure=cookie_secure,
        samesite=cookie_samesite, max_age=access_lifetime,
    )
    if refresh_token:
        response.set_cookie(
            key='refresh_token', value=refresh_token,
            httponly=True, secure=cookie_secure,
            samesite=cookie_samesite, max_age=refresh_lifetime,
        )


class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0]) from e

        access_token  = serializer.validated_data['access']
        refresh_token = serializer.validated_data['refresh']
        response      = Response({'message': 'Login exitoso'}, status=status.HTTP_200_OK)
        set_auth_cookies(response, access_token, refresh_token)

        # ── Registrar login ───────────────────────────────────
        try:
            usuario = serializer.user
            Bitacora.registrar(
                usuario=usuario,
                accion='LOGIN',
                modulo='Autenticación',
                descripcion=f"Usuario '{usuario.username}' inició sesión",
                ip=_get_ip(request),
                datos_extra={'username': usuario.username, 'email': usuario.email},
            )
        except Exception:
            pass  # no interrumpir el login si falla el registro

        return response


class CookieTokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            return Response(
                {'error': 'No hay sesión activa'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        try:
            refresh      = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            response     = Response({'message': 'Token renovado'}, status=status.HTTP_200_OK)
            set_auth_cookies(response, access_token)
            return response
        except TokenError:
            return Response(
                {'error': 'Sesión expirada, inicia sesión nuevamente'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class CookieLogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # ── Registrar logout ──────────────────────────────────
        try:
            if request.user and request.user.is_authenticated:
                Bitacora.registrar(
                    usuario=request.user,
                    accion='LOGOUT',
                    modulo='Autenticación',
                    descripcion=f"Usuario '{request.user.username}' cerró sesión",
                    ip=_get_ip(request),
                    datos_extra={'username': request.user.username},
                )
        except Exception:
            pass  # no interrumpir el logout si falla el registro

        response = Response({'message': 'Sesión cerrada'}, status=status.HTTP_200_OK)
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
