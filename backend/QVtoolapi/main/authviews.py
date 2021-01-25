from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import generics, mixins, status
from django.contrib.auth.models import Permission, Group, User
from .serializers import (DelegateSerializer,
                          PermissionSerializer,
                          GroupSerializer,
                          UserSerializer
                          )
from .permissions import DelegatePermission, GroupPermission
from .models import Delegate, Transfer
import requests
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.views import APIView
import json
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .utils import account_activation_token


class DelegateList(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   generics.GenericAPIView):
    queryset = Delegate.objects.all()
    serializer_class = DelegateSerializer

    permission_classes = (DelegatePermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)

    # Deletes ALL users. For testing only.
    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class DelegateDetail(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):
    queryset = Delegate.objects.all()
    serializer_class = DelegateSerializer

    permission_classes = (DelegatePermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class UserDetail(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = (DelegatePermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class GroupList(mixins.CreateModelMixin,
                mixins.ListModelMixin,
                generics.GenericAPIView):

    queryset = Group.objects.all()
    serializer_class = GroupSerializer

    permission_classes = (GroupPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PermissionList(mixins.CreateModelMixin,
                     mixins.ListModelMixin,
                     generics.GenericAPIView):

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomAuthToken(ObtainAuthToken):
    # serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            delegate = Delegate.objects.get(user=token.user)
            print(delegate.user.id)
            return Response({
                'token': token.key,
                'id': delegate.pk,
                'username': token.user.username,
                'email': token.user.email,
                # 'phone_number': token.user.phone_number,
                'first_name': token.user.first_name,
                'last_name': token.user.last_name,
                'profile_pic': delegate.profile_pic,
                # 'invited_by': token.user.invited_by,
                'credit_balance': delegate.credit_balance,
            })


class ValidateAuthToken(ObtainAuthToken):
    # serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(request.data["uidb64"]))
            delegate = Delegate.objects.get(pk=uid)
            print(json.dumps(request.data))
            print(delegate)
        except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
            delegate = None
        if delegate is not None and account_activation_token.check_token(delegate, request.data["token"]):
            delegate.user.is_active = True
            delegate.user.save()
            token, created = Token.objects.get_or_create(user=delegate.user)
            return Response({
                'token': token.key,
                'id': delegate.pk,
                'user_id': delegate.user.id,
                'username': token.user.username,
                'email': token.user.email,
                # 'phone_number': token.user.phone_number,
                'first_name': token.user.first_name,
                'last_name': token.user.last_name,
                'profile_pic': delegate.profile_pic,
                # 'invited_by': token.user.invited_by,
                'credit_balance': delegate.credit_balance,
            })
        else:
            return HttpResponse('Activation link is invalid!')


class GetGithubToken(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
        data = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": request.data["code"]
        }
        r = requests.post(
            'https://github.com/login/oauth/access_token',
            headers=headers,
            data=json.dumps(data)
        )
        # save token
        cors_header = {
            'Access-Control-Allow-Origin': '*',
        }
        r.headers.update(cors_header)
        return Response(r.json())


class GetGithubUser(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        headers = {
            'Authorization': 'token ' + request.data["access_token"]
        }
        r = requests.get(
            'https://api.github.com/user',
            headers=headers
        )
        delegate = Delegate.objects.filter(user__id=request.user.id).first()
        if delegate:
            github_data = r.json()
            if github_data["login"]:
                delegate.oauth_provider = "git"
                delegate.public_username = github_data["login"]
                delegate.oauth_token = request.data["access_token"]
                Transfer.objects.filter(recipient=delegate.user.email).filter(status='P').update(status='A')
                # profile pic available at github_data["avatar_url"]
                delegate.save()

        # save github handle
        cors_header = {
            'Access-Control-Allow-Origin': '*',
        }
        r.headers.update(cors_header)
        return Response(r)
