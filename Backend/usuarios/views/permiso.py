# pylint: disable=C0114,C0115,C0116,no-member,W0718,W0212,W0613,C0301
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Permiso, Bitacora
from ..serializers import PermisoSerializer
from ..permissions import EsAdmin

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all().order_by('nombre')
    serializer_class = PermisoSerializer
    permission_classes = [EsAdmin]

    def get_queryset(self):
        queryset = Permiso.objects.all().order_by('nombre')
        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nombre__icontains=search)
        return queryset

    # ── Bitácora ──────────────────────────────────────────────
    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        instance = serializer.instance
        datos_antes = {
            'nombre':      instance.nombre,
            'codename':    instance.codename,
            'descripcion': instance.descripcion,
            'is_active':   instance.is_active,
        }

        instance._datos_antes = datos_antes
        instance = serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    # ── Toggle active ─────────────────────────────────────────
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        permiso = self.get_object()
        permiso.is_active = not permiso.is_active
        permiso.save()
        Bitacora.registrar(
            usuario=request.user,
            accion='CAMBIAR_ESTADO',
            modulo='Permisos',
            descripcion=f"Permiso '{permiso.nombre}' {'activado' if permiso.is_active else 'desactivado'}",
            ip=request.META.get('REMOTE_ADDR'),
            datos_extra={'permiso_id': permiso.id, 'nuevo_estado': permiso.is_active},
        )
        return Response({
            'message': f"Permiso {'activado' if permiso.is_active else 'desactivado'}",
            'is_active': permiso.is_active
        })
