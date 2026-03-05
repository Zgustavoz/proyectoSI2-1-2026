# pylint: disable=C0114,C0115,C0116,no-member,W0718
import traceback
import threading
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
# from google.oauth2 import id_token
# from google.auth.transport import requests as google_requests
from decouple import config
import requests as req


from ..serializers import UsuarioSerializer, CustomTokenObtainPairSerializer, RegistroSerializer
from ..models import Usuario, Rol
from .auth_cookies import set_auth_cookies


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegistroView(generics.CreateAPIView):
    queryset = Usuario.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            'message': 'Usuario creado exitosamente.'
        }, status=status.HTTP_201_CREATED)


class PerfilUsuarioView(generics.RetrieveUpdateAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'El email es requerido'}, status=400)

        def send_reset_email(user, email):
            try:
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{config('FRONTEND_URL')}/reset-password/{uid}/{token}/"
                send_mail(
                    'Recuperación de Contraseña',
                    f'Enlace para restablecer tu contraseña: {reset_url}',
                    settings.DEFAULT_FROM_EMAIL,
                    [email],
                    fail_silently=False,
                )
            except Exception:
                traceback.print_exc()

        try:
            user = Usuario.objects.get(email=email)
            thread = threading.Thread(target=send_reset_email, args=(user, email))
            thread.daemon = False
            thread.start()
            return Response({'message': 'Email enviado'}, status=200)
        except Usuario.DoesNotExist:
            return Response({'message': 'Email enviado'}, status=200)
        except Exception:
            traceback.print_exc()
            return Response({'error': 'Error interno'}, status=500)


class RestablecerPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uidb64, token):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = Usuario.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, Usuario.DoesNotExist):
            return Response(
                {'error': 'El enlace no es válido'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {'error': 'El enlace ha expirado o ya fue utilizado'},
                status=status.HTTP_400_BAD_REQUEST
            )

        new_password = request.data.get('new_password')
        if not new_password:
            return Response(
                {'error': 'Debes proporcionar una nueva contraseña'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(new_password) < 8:
            return Response(
                {'error': 'La contraseña debe tener al menos 8 caracteres'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Contraseña restablecida exitosamente.'})


class GoogleLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            access_token = request.data.get('token')
            if not access_token:
                return Response(
                    {'error': 'Token no proporcionado'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Obtener info del usuario desde Google con el access_token
            google_response = req.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                headers={'Authorization': f'Bearer {access_token}'}
            )

            if google_response.status_code != 200:
                return Response(
                    {'error': 'Token de Google inválido'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            idinfo = google_response.json()
            email = idinfo.get('email')
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            google_id = idinfo.get('sub')

            if not email:
                return Response(
                    {'error': 'No se pudo obtener el email'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user, created = Usuario.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0] + '_' + google_id[:6],
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )

            if created:
                try:
                    rol_cliente = Rol.objects.get(nombre='cliente')
                except Rol.DoesNotExist:
                    rol_cliente = Rol.objects.create(
                        nombre='cliente',
                        descripcion='Rol de cliente por defecto'
                    )
                user.roles.add(rol_cliente)
                user.save()

            refresh = CustomTokenObtainPairSerializer.get_token(user)
            response = Response(
                {'message': 'Login con Google exitoso'},
                status=status.HTTP_200_OK
            )
            set_auth_cookies(response, str(refresh.access_token), str(refresh))
            return response

        except Exception as e:
            return Response(
                {'error': f'Error en el servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
