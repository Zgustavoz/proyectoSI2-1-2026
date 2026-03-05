# pylint: disable=C0114,C0115,C0116,no-member,W0718,W0613
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from ..models import Rol, Permiso
from ..serializers import RolSerializer
from ..permissions import EsAdmin

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.annotate(
        usuarios_count=Count('usuarios')
    ).order_by('-fecha_creacion')
    serializer_class = RolSerializer
    permission_classes = [EsAdmin]

    def get_queryset(self):
        queryset = Rol.objects.annotate(usuarios_count=Count('usuarios'))

        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(nombre__icontains=search) |
                Q(descripcion__icontains=search)
            )

        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')

        return queryset.order_by('-fecha_creacion')

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        rol = self.get_object()
        if rol.usuarios.filter(is_active=True).exists():
            return Response(
                {'error': 'No puedes desactivar un rol con usuarios activos asignados'},
                status=status.HTTP_400_BAD_REQUEST
            )
        rol.is_active = not rol.is_active
        rol.save()
        return Response({
            'message': f"Rol {'activado' if rol.is_active else 'desactivado'}",
            'is_active': rol.is_active
        })

    @action(detail=True, methods=['post'])
    def asignar_permisos(self, request, pk=None):
        rol = self.get_object()
        permisos_ids = request.data.get('permisos_ids', [])
        permisos = Permiso.objects.filter(id__in=permisos_ids, is_active=True)
        rol.permisos.set(permisos)
        rol.save()
        serializer = self.get_serializer(rol)
        return Response(serializer.data)
