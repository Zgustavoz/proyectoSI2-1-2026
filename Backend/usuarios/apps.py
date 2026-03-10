#pylint: disable=C0114,C0115, W0611,C0415
from django.apps import AppConfig

class UsuariosConfig(AppConfig):
    name = 'usuarios'

    def ready(self):
        import usuarios.signals  # noqa
