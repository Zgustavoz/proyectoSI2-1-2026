# pylint: disable=C0114,C0115,C0116,W0613,C0206
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from ..models import Permiso, Bitacora
from .utils import _get_ip, get_request

@receiver(post_save, sender=Permiso)
def log_permiso_save(sender, instance, created, **kwargs):
    request = get_request()
    if request is None:
        return

    datos_antes   = getattr(instance, '_datos_antes', {})
    datos_despues = {
        'nombre':      instance.nombre,
        'codename':    instance.codename,
        'descripcion': instance.descripcion,
        'is_active':   instance.is_active,
    }

    if not created and datos_antes:
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
        accion='CREAR' if created else 'EDITAR',
        modulo='Permisos',
        descripcion=f"Permiso '{instance.nombre}' {'creado' if created else 'editado'}",
        ip=_get_ip(request),
        datos_extra=datos_extra,
    )

@receiver(post_delete, sender=Permiso)
def log_permiso_delete(sender, instance, **kwargs):
    request = get_request()
    if request is None:
        return
    Bitacora.registrar(
        usuario=request.user if request.user.is_authenticated else None,
        accion='ELIMINAR',
        modulo='Permisos',
        descripcion=f"Permiso '{instance.nombre}' eliminado",
        ip=_get_ip(request),
        datos_extra={'permiso_id': instance.id, 'codename': instance.codename},
    )
