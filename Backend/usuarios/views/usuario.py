# pylint: disable=C0114,C0115,C0116,no-member,W0718,W0613,W0611,W0212,C0301
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Prefetch
from ..models import Usuario, Rol, Bitacora
from ..serializers import UsuarioSerializer
from ..permissions import EsAdminOSoloLectura

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
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search)
            )
        roles = self.request.query_params.getlist('roles[]', None)
        if roles:
            for rol_id in roles:
                queryset = queryset.filter(roles__id=rol_id)
        activo = self.request.query_params.get('activo', None)
        if activo is not None:
            queryset = queryset.filter(is_active=activo.lower() == 'true')
        fecha_desde = self.request.query_params.get('fecha_desde', None)
        if fecha_desde:
            queryset = queryset.filter(date_joined__date__gte=fecha_desde)
        fecha_hasta = self.request.query_params.get('fecha_hasta', None)
        if fecha_hasta:
            queryset = queryset.filter(date_joined__date__lte=fecha_hasta)
        return queryset.order_by('-date_joined')

    # ── Bitácora automática via signals ───────────────────────
    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        instance = serializer.instance
        datos_antes = {
            'username':   instance.username,
            'email':      instance.email,
            'first_name': instance.first_name,
            'last_name':  instance.last_name,
            'is_active':  instance.is_active,
            'telefono':   instance.telefono,
            'roles':      list(instance.roles.values_list('nombre', flat=True)),
        }
        instance._datos_antes = datos_antes
        instance = serializer.save()

    def perform_destroy(self, instance):
        instance.delete()

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        usuario = self.get_object()
        if usuario.id == request.user.id:
            return Response({'error': 'No puedes cambiar tu propio estado'}, status=400)
        usuario.is_active = not usuario.is_active
        usuario._skip_signal = True
        usuario.save()
        Bitacora.registrar(
            usuario=request.user,
            accion='CAMBIAR_ESTADO',
            modulo='Usuarios',
            descripcion=f"Usuario '{usuario.username}' {'activado' if usuario.is_active else 'desactivado'}",
            ip=request.META.get('REMOTE_ADDR'),
            datos_extra={'usuario_id': usuario.id, 'nuevo_estado': usuario.is_active},
        )
        return Response({
            'message': f"Usuario {'activado' if usuario.is_active else 'desactivado'}",
            'is_active': usuario.is_active
        })

    @action(detail=True, methods=['post'])
    def asignar_roles(self, request, pk=None):
        usuario = self.get_object()
        roles_ids = request.data.get('roles_ids', [])
        if not roles_ids:
            return Response({'error': 'Debes proporcionar al menos un rol'}, status=400)
        roles_antes   = list(usuario.roles.values_list('nombre', flat=True))
        roles         = Rol.objects.filter(id__in=roles_ids, is_active=True)
        usuario.roles.set(roles)
        roles_despues = list(roles.values_list('nombre', flat=True))
        Bitacora.registrar(
            usuario=request.user,
            accion='EDITAR',
            modulo='Usuarios',
            descripcion=f"Roles modificados al usuario '{usuario.username}'",
            ip=request.META.get('REMOTE_ADDR'),
            datos_extra={'cambios': {'roles': {'antes': roles_antes, 'despues': roles_despues}}},
        )
        serializer = self.get_serializer(usuario)
        return Response(serializer.data)
