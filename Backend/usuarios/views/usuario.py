# pylint: disable=C0114,C0115,C0116,no-member,W0718,W0613,W0611
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Prefetch
from ..models import Usuario, Rol
from ..serializers import UsuarioSerializer
from ..permissions import EsAdmin, EsAdminOSoloLectura

class UsuarioPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all().prefetch_related(
        Prefetch('roles', queryset=Rol.objects.all())
    ).order_by('-date_joined')
    serializer_class = UsuarioSerializer
    permission_classes = [EsAdminOSoloLectura]
    pagination_class = UsuarioPagination

    def get_queryset(self):
        queryset = Usuario.objects.all().prefetch_related('roles').distinct()

        # Búsqueda
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )

        # Filtro por roles
        roles = self.request.query_params.getlist('roles[]', None)
        if roles:
            for rol_id in roles:
                queryset = queryset.filter(roles__id=rol_id)

        # Filtro por estado
        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')

        # Filtro por fecha desde
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(date_joined__date__gte=fecha_desde)

        # Filtro por fecha hasta
        fecha_hasta = self.request.query_params.get('fecha_hasta', None)
        if fecha_hasta:
            queryset = queryset.filter(date_joined__date__lte=fecha_hasta)

        return queryset.order_by('-date_joined')

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response(
                {'error': 'No puedes eliminarte a ti mismo'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        usuario = self.get_object()
        if usuario.id == request.user.id:
            return Response(
                {'error': 'No puedes cambiar tu propio estado'},
                status=status.HTTP_400_BAD_REQUEST
            )
        usuario.is_active = not usuario.is_active
        usuario.save()
        return Response({
            'message': f"Usuario {'activado' if usuario.is_active else 'desactivado'}",
            'is_active': usuario.is_active
        })

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def asignar_roles(self, request, pk=None):
        usuario = self.get_object()
        roles_ids = request.data.get('roles_ids', [])
        if not roles_ids:
            return Response(
                {'error': 'Debes proporcionar al menos un rol'},
                status=status.HTTP_400_BAD_REQUEST
            )
        roles = Rol.objects.filter(id__in=roles_ids, is_active=True)
        usuario.roles.set(roles)
        usuario.save()
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)
