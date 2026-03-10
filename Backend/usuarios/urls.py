# pylint: disable=C0114,C0115,C0301
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CookieTokenObtainPairView,
    CookieTokenRefreshView,
    CookieLogoutView,
    RegistroView,
    PerfilUsuarioView,
    PasswordResetView,
    RestablecerPasswordView,
    GoogleLoginView,
    UsuarioViewSet,
    RolViewSet,
    PermisoViewSet,
    BitacoraListView,
    VerificarPasswordBitacoraView,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'roles', RolViewSet, basename='rol')
router.register(r'permisos', PermisoViewSet, basename='permiso')

urlpatterns = [
    # Auth
    path('token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', CookieLogoutView.as_view(), name='logout'),

    # Registro y perfil
    path('registro/', RegistroView.as_view(), name='registro'),
    path('perfil/', PerfilUsuarioView.as_view(), name='perfil'),

    # Recuperación de contraseña
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('restablecer-password/<str:uidb64>/<str:token>/', RestablecerPasswordView.as_view(), name='restablecer_password'),

    # Google OAuth
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),

    #Auditoria
    path('bitacora/', BitacoraListView.as_view(), name='bitacora'),
    path('bitacora/verificar/', VerificarPasswordBitacoraView.as_view(), name='bitacora_verificar'),

    # CRUD
    path('', include(router.urls)),
    
]
