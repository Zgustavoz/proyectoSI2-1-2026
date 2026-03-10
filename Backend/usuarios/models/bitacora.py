# pylint: disable=C0114,C0115,C0411
from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet
import json

class Bitacora(models.Model):
    ACCIONES = [
        ('LOGIN',           'Inicio de sesión'),
        ('LOGOUT',          'Cierre de sesión'),
        ('CREAR',           'Crear registro'),
        ('EDITAR',          'Editar registro'),
        ('ELIMINAR',        'Eliminar registro'),
        ('CAMBIAR_ESTADO',  'Cambiar estado'),
        ('EXPORTAR',        'Exportar reporte'),
        ('COMPRA',          'Compra'),
        ('PEDIDO',          'Pedido'),
        ('PAGO',            'Pago'),
        ('OTRO',            'Otro'),
    ]

    usuario         = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='bitacora'
    )
    accion          = models.CharField(max_length=20, choices=ACCIONES)
    modulo          = models.CharField(max_length=100)           # ej: "Usuarios", "Roles"
    descripcion     = models.TextField()
    ip              = models.GenericIPAddressField(null=True, blank=True)
    datos_extra     = models.TextField(blank=True)               # JSON encriptado
    fecha           = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'bitacora'
        verbose_name    = 'Bitácora'
        ordering        = ['-fecha']

    def __str__(self):
        return f"{self.usuario} - {self.accion} - {self.fecha}"

    # ── Encriptación ──────────────────────────────────────────
    @staticmethod
    def _fernet():
        key = settings.BITACORA_FERNET_KEY.encode()
        return Fernet(key)

    def set_datos_extra(self, datos: dict):
        """Encripta y guarda datos adicionales."""
        if not datos:
            self.datos_extra = ''
            return
        raw = json.dumps(datos, ensure_ascii=False).encode()
        self.datos_extra = self._fernet().encrypt(raw).decode()

    def get_datos_extra(self) -> dict:
        """Desencripta y retorna datos adicionales."""
        if not self.datos_extra:
            return {}
        raw = self._fernet().decrypt(self.datos_extra.encode())
        return json.loads(raw.decode())

    @classmethod
    def registrar(cls, usuario, accion, modulo, descripcion, ip=None, datos_extra=None):
        """Método de conveniencia para crear un registro."""
        entrada = cls(
            usuario=usuario,
            accion=accion,
            modulo=modulo,
            descripcion=descripcion,
            ip=ip,
        )
        entrada.set_datos_extra(datos_extra or {})
        entrada.save()
        return entrada
