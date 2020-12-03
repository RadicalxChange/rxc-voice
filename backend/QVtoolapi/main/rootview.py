from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json


class RootView(APIView):
    def get(self, request):
        resp = {
            'title': 'RadicalxChange QV Tool API'
        }
        return Response(json.dumps(resp), status=status.HTTP_201_CREATED)
