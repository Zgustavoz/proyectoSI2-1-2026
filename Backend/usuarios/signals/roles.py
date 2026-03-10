# pylint: disable=C0114,C0115,C0116,W0613,C0206,W0212,W0612
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from ..models import Rol, Bitacora
from .utils import _get_ip, get_request

@receiver(post_save, sender=Rol)
def log_rol_save(sender, instance, created, **kwargs):
    if created and not getattr(instance, '_skip_signal', False):
        return
    skip = getattr(instance, '_skip_signal', False)
    if skip:
        instance._skip_signal = False
    request = get_request()
    if request is None:
        return
    datos_antes   = getattr(instance, '_datos_antes', {})
    datos_despues = {
        'nombre':      instance.nombre,
        'descripcion': instance.descripcion,
        'es_admin':    instance.es_admin,
        'is_active':   instance.is_active,
        'permisos':    list(instance.permisos.values_list('nombre', flat=True)),
    }

    if not skip and datos_antes:
        cambios = {
            campo: {'antes': datos_antes[campo], 'despues': datos_despues[campo]}
            for campo in datos_despues
            if datos_antes.get(campo) != datos_despues.get(campo)
        }
        datos_extra = {'cambios': cambios}
    else:
        datos_extra = {'datos': datos_despues}

    Bitacora.registrar(
        usuario=request.user if request.user.is_authenticated else None,
        accion='CREAR' if skip else 'EDITAR',
        modulo='Roles',
        descripcion=f"Rol '{instance.nombre}' {'creado' if skip else 'editado'}",
        ip=_get_ip(request),
        datos_extra=datos_extra,
    )

@receiver(post_delete, sender=Rol)
def log_rol_delete(sender, instance, **kwargs):
    request = get_request()
    if request is None:
        return
    Bitacora.registrar(
        usuario=request.user if request.user.is_authenticated else None,
        accion='ELIMINAR',
        modulo='Roles',
        descripcion=f"Rol '{instance.nombre}' eliminado",
        ip=_get_ip(request),
        datos_extra={'rol_id': instance.id, 'nombre': instance.nombre},
    )
