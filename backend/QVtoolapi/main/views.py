import json

from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token

from .models import User, AnonVoter, Election, Vote, Proposal
from .serializers import (UserSerializer, ElectionSerializer, VoteSerializer,
                          ProposalSerializer, AnonVoterSerializer,
                          CustomAuthTokenSerializer)
from .permissions import ElectionPermission
# from .authentication import TokenAuthentication


# Create your views here.

class RootView(APIView):
    def get(self, request):
        resp = {
            'title': 'RadicalxChange QV Tool API'
        }
        return Response(json.dumps(resp), status=status.HTTP_201_CREATED)


class UserList(mixins.CreateModelMixin,
               mixins.ListModelMixin,
               generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


class UserDetail(mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin,
                 generics.GenericAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class AnonList(mixins.CreateModelMixin,
               mixins.ListModelMixin,
               generics.GenericAPIView):
    queryset = AnonVoter.objects.all()
    serializer_class = AnonVoterSerializer

    def get(self, request, *args, **kwargs):
        election_id = self.kwargs['pk']
        election_voters = self.get_queryset().filter(
            election__id=election_id)
        page = self.paginate_queryset(election_voters)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(election_voters, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


class AnonDetail(mixins.RetrieveModelMixin,
                 mixins.UpdateModelMixin,
                 generics.GenericAPIView):
    queryset = AnonVoter.objects.all()
    serializer_class = AnonVoterSerializer

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class CustomAuthToken(ObtainAuthToken):
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'id': token.user.pk,
                'email': token.user.email,
                'phone_number': token.user.phone_number,
                'first_name': token.user.first_name,
                'last_name': token.user.last_name,
                'profile_pic': token.user.profile_pic,
                'credit_balance': token.user.credit_balance,
                'election': token.user.election.id,
            })


class ElectionList(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   generics.GenericAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    # Deletes ALL elections. For testing only.
    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ElectionDetail(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):

    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    permission_classes = (ElectionPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class VoteList(mixins.CreateModelMixin,
               mixins.ListModelMixin,
               generics.GenericAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    def get(self, request, *args, **kwargs):
        election_id = self.kwargs['pk']
        votes = self.get_queryset().filter(
            proposal__election=election_id)
        page = self.paginate_queryset(votes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


class ProposalList(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   generics.GenericAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    def get(self, request, *args, **kwargs):
        election_id = self.kwargs['pk']
        election_proposals = self.get_queryset().filter(
            election__id=election_id)
        page = self.paginate_queryset(election_proposals)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(election_proposals, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


# Stub for proposal list detail view. Note: no one should be able to edit a
# proposal once an election has started. However, we could eventually allow
# election edmins to edit elections *up until the start date*
# class ProposalDetail(mixins.RetrieveModelMixin,
#                      mixins.UpdateModelMixin,
#                      mixins.DestroyModelMixin,
#                      generics.GenericAPIView):
#
#     queryset = Proposal.objects.all()
#     serializer_class = ProposalSerializer
#
#     def get(self, request, *args, **kwargs):
#         return self.retrieve(request, *args, **kwargs)
#
#     def put(self, request, *args, **kwargs):
#         return self.update(request, *args, **kwargs)
#
#     def delete(self, request, *args, **kwargs):
#         return self.destroy(request, *args, **kwargs)


# for testing only.
class ProposalListAll(mixins.CreateModelMixin,
                      mixins.ListModelMixin,
                      generics.GenericAPIView):

    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# for testing only.
class VoteListAll(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  generics.GenericAPIView):

    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# for testing only.


class AnonVoterListAll(mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       generics.GenericAPIView):

    queryset = AnonVoter.objects.all()
    serializer_class = AnonVoterSerializer

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
