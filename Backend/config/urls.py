"""
Archivo de URLs principal de Django para Proyecto1.
Define rutas de admin, health check y usuarios.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def health(_request):
    """Endpoint para verificar que el servidor está vivo."""
    return HttpResponse("OK")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('health/', health, name='health'),
    path('usuarios/', include('usuarios.urls')),
]
