# pylint: disable=C0114,C0115,C0116,no-member,W0718
from rest_framework import viewsets#, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Permiso
from ..serializers import PermisoSerializer
from ..permissions import EsAdmin

class PermisoViewSet(viewsets.ModelViewSet):
    queryset = Permiso.objects.all().order_by('nombre')
    serializer_class = PermisoSerializer
    permission_classes = [EsAdmin]

    def get_queryset(self):
        queryset = Permiso.objects.all().order_by('nombre')

        # Filtro por estado
        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')

        # Búsqueda
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(nombre__icontains=search)

        return queryset

    @action(detail=True, methods=['post'])
    def toggle_active(self, _request, _pk=None):
        permiso = self.get_object()
        permiso.is_active = not permiso.is_active
        permiso.save()
        return Response({
            'message': f"Permiso {'activado' if permiso.is_active else 'desactivado'}",
            'is_active': permiso.is_active
        })
