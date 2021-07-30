import traceback
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework import generics, mixins, status
import oauth2 as oauth
from urllib import parse
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
import json
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from .utils import get_mail_body, account_activation_token, add_to_delegation
from .services import send_mail


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
        serializer.create(serializer.validated_data, set_unusable_password=True)
        # serializer.save()
        # headers = self.get_success_headers(serializer.data)
        return Response(status=status.HTTP_201_CREATED)

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
        serializer = self.serializer_class(data=request.data['user'],
                                           context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            # the following line currently throws an error for superusers
            delegate = Delegate.objects.get(user=token.user)
            # claim transfers if necessary
            if request.data['creds']['uidb64'] and request.data['creds']['token']:
                print("claiming credits...")
                try:
                    uid = force_text(urlsafe_base64_decode(request.data['creds']['uidb64']))
                    standin_delegate = Delegate.objects.get(pk=uid)
                except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
                    standin_delegate = None
                if standin_delegate == delegate:
                    print("standard login")
                    standin_delegate = None
                if standin_delegate is not None and account_activation_token.check_token(standin_delegate, request.data['creds']['token']):
                    transfers = Transfer.objects.filter(recipient_object=standin_delegate)
                    for transfer in transfers:
                        # don't allow user to claim a transfer they sent themselves
                        if transfer.sender != delegate:
                            transfer.recipient = delegate.public_username
                            transfer.recipient_object = delegate
                        else:
                            transfer.status='C'
                        transfer.save()
                    standin_delegate.user.delete()
            return Response({
                'token': token.key,
                'id': delegate.pk,
                'user_id': delegate.user.id,
                'is_verified': delegate.is_verified,
                'username': token.user.username,
                'email': token.user.email,
                'public_username': delegate.public_username,
                # 'phone_number': token.user.phone_number,
                'first_name': token.user.first_name,
                'last_name': token.user.last_name,
                'profile_pic': delegate.profile_pic,
                # 'invited_by': token.user.invited_by,
                # 'credit_balance': delegate.credit_balance,
            })


class ForgotPassword(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        try:
            delegate = Delegate.objects.get(user__email=request.data['email'])
        except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
            delegate = None
        if delegate is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            uid = urlsafe_base64_encode(force_bytes(delegate.pk))
            token = account_activation_token.make_token(delegate)
            params = {
                'delegate_first_name': delegate.user.first_name,
                'uid': uid,
                'token': token,
                'delegate': delegate,
            }
            subject = "Reset Password"

            try:
                mail_body = get_mail_body('reset_password', params)
                send_mail(delegate.user.email, subject, mail_body)
            except Exception as e:
                print(e)
            return Response(status=status.HTTP_200_OK)


class ResetPassword(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(request.data['uidb64']))
            delegate = Delegate.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
            delegate = None
        if delegate is not None and account_activation_token.check_token(delegate, request.data["token"]):
            delegate.user.set_password(request.data['password'])
            delegate.user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class ValidateAuthToken(ObtainAuthToken):
    # serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        try:
            uid = force_text(urlsafe_base64_decode(request.data["uidb64"]))
            delegate = Delegate.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
            delegate = None
        if delegate is not None and account_activation_token.check_token(delegate, request.data["token"]):
            delegate.user.is_active = True
            delegate.user.save()
            token, created = Token.objects.get_or_create(user=delegate.user)
            return Response({
                'token': token.key,
                'id': delegate.pk,
                'is_verified': delegate.is_verified,
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


class GetGithubUser(generics.GenericAPIView):
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
        # request an access token from Github Oauth2 application
        token_msg = requests.post(
            'https://github.com/login/oauth/access_token',
            headers=headers,
            data=json.dumps(data)
        )
        token_data = token_msg.json()
        # use the access token to obtain user data
        if 'access_token' in token_data:
            headers = {
                'Authorization': 'token ' + token_data['access_token']
            }
            data_msg = requests.get(
                'https://api.github.com/user',
                headers=headers
            )
            github_data = data_msg.json()
            # update the delegate with data from their github profile
            if 'login' in github_data:
                try:
                    delegate = Delegate.objects.filter(user__id=request.user.id).first()
                except(Delegate.DoesNotExist):
                    delegate = None
                if delegate:
                    delegate.oauth_provider = "git"
                    delegate.public_username = github_data["login"]
                    delegate.oauth_token = token_data['access_token']
                    # profile pic available at github_data['avatar_url']
                    delegate.is_verified = True
                    delegate.save()
                    try:
                        add_to_delegation(delegate)
                    except:
                        print(traceback.format_exc())
                    cors_header = {
                        'Access-Control-Allow-Origin': '*',
                    }
                    data_msg.headers.update(cors_header)
                    return Response(data_msg, status=status.HTTP_200_OK)
                else:
                    error = {
                        'error': 'permission_denied',
                        'error_description': 'The activation token is invalid or expired'
                    }
                    return Response(error, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response(github_data, status=status.HTTP_401_UNAUTHORIZED)
        else:
            return Response(token_data, status=status.HTTP_401_UNAUTHORIZED)


class GetTwitterToken(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        consumer_key = settings.TWITTER_CONSUMER_KEY
        consumer_secret = settings.TWITTER_CONSUMER_SECRET
        request_token_url = 'https://api.twitter.com/oauth/request_token'

        consumer = oauth.Consumer(consumer_key, consumer_secret)
        client = oauth.Client(consumer)

        # Step 1: Get a request token. This is a temporary token that is used for
        # having the user authorize an access token and to sign the request to obtain
        # said access token.

        resp, content = client.request(request_token_url, "GET")
        if resp['status'] != '200':
            raise Exception("Invalid response %s." % resp['status'])

        return Response(
            dict(parse.parse_qsl(content.decode("utf-8"))),
            status=resp['status']
        )

    def post(self, request, *args, **kwargs):
        consumer_key = settings.TWITTER_CONSUMER_KEY
        consumer_secret = settings.TWITTER_CONSUMER_SECRET
        access_token_url = 'https://api.twitter.com/oauth/access_token'

        token = oauth.Token(request.data["oauth_token"],
            request.data["oauth_secret"])
        token.set_verifier(request.data["oauth_verifier"])

        consumer = oauth.Consumer(consumer_key, consumer_secret)
        client = oauth.Client(consumer, token)

        resp, content = client.request(access_token_url, "POST")
        twitter_data = dict(parse.parse_qsl(content.decode("utf-8")))
        if resp['status'] == '200':
            delegate = Delegate.objects.filter(user__id=request.user.id).first()
            if delegate:
                delegate.oauth_provider = "twt"
                delegate.public_username = twitter_data["screen_name"]
                delegate.oauth_token = twitter_data["oauth_token"]
                delegate.oauth_token_secret = twitter_data["oauth_token_secret"]
                delegate.is_verified = True
                # get profile pic
                delegate.save()
                try:
                    add_to_delegation(delegate)
                except:
                    print(traceback.format_exc())

        return Response(
            twitter_data,
            status=resp['status']
        )


class EmailApplication(generics.GenericAPIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request, *args, **kwargs):
        try:
            delegate = Delegate.objects.get(user=request.user)
        except(TypeError, ValueError, OverflowError, Delegate.DoesNotExist):
            delegate = None
        if delegate is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            params = {
                'delegate_email': delegate.user.email,
                'delegate_first_name': delegate.user.first_name,
            }
            subject = "Verify your Account"

            try:
                mail_body = get_mail_body('email_application', params)
                send_mail(delegate.user.email, subject, mail_body)
            except Exception as e:
                print(e)

            return Response(status=status.HTTP_200_OK)
