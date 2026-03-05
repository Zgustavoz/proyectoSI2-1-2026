# pylint: disable=C0114,C0115
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Primero intenta desde cookie
        access_token = request.COOKIES.get('access_token')

        if not access_token:
            # Fallback al header Authorization
            return super().authenticate(request)

        try:
            validated_token = self.get_validated_token(access_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, TokenError):
            return None
