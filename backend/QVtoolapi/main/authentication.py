import rest_framework.authentication

from .models import Token


class TokenAuthentication(rest_framework.authentication.TokenAuthentication):
    model = Token
