# pylint: disable=C0114,C0115,C0116,no-member,C0321
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.utils.dateparse import parse_date
from django.conf import settings
from ..models import Bitacora


class VerificarPasswordBitacoraView(APIView):
    """Verifica la contraseña especial para acceder a la bitácora."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if not request.user.es_admin:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )
        password = request.data.get('password')
        if not password:
            return Response({'error': 'Contraseña requerida'}, status=400)

        if check_password(password, request.user.password):
            return Response({'acceso': True})

        password_bitacora = getattr(settings, 'BITACORA_PASSWORD', None)
        if password_bitacora and password == password_bitacora:
            return Response({'acceso': True})

        return Response({'error': 'Contraseña incorrecta'}, status=400)


class BitacoraListView(APIView):
    """Lista los registros de bitácora con filtros."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.es_admin:
            return Response(
                {'error': 'No tienes permisos'},
                status=status.HTTP_403_FORBIDDEN
            )

        qs = Bitacora.objects.select_related('usuario').all()

        # Filtros
        accion  = request.query_params.get('accion')
        modulo  = request.query_params.get('modulo')
        usuario = request.query_params.get('usuario')
        desde   = request.query_params.get('fecha_desde')
        hasta   = request.query_params.get('fecha_hasta')

        if accion:  qs = qs.filter(accion=accion)
        if modulo:  qs = qs.filter(modulo__icontains=modulo)
        if usuario: qs = qs.filter(usuario__username__icontains=usuario)
        if desde:   qs = qs.filter(fecha__date__gte=parse_date(desde))
        if hasta:   qs = qs.filter(fecha__date__lte=parse_date(hasta))

        # Paginación simple
        page      = int(request.query_params.get('page', 1))
        page_size = 20
        total     = qs.count()
        registros = qs[(page - 1) * page_size: page * page_size]

        data = []
        for r in registros:
            data.append({
                'id':          r.id,
                'usuario':     r.usuario.username if r.usuario else 'Sistema',
                'accion':      r.get_accion_display(),
                'accion_code': r.accion,
                'modulo':      r.modulo,
                'descripcion': r.descripcion,
                'ip':          r.ip,
                'fecha':       r.fecha.isoformat(),
                'datos_extra': r.get_datos_extra(),
            })

        return Response({
            'count':    total,
            'page':     page,
            'pages':    -(-total // page_size),
            'results':  data,
        })
