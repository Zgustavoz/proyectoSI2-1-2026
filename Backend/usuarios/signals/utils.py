# pylint: disable=C0114,C0116
from ..middleware import get_current_request

def _get_ip(request=None):
    if request is None:
        request = get_current_request()
    if not request:
        return None
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded.split(',')[0] if x_forwarded else request.META.get('REMOTE_ADDR')

def get_request():
    return get_current_request()
