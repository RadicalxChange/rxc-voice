from guardian.shortcuts import assign_perm
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import generics, mixins, status
from django.utils import timezone
from .permissions import (ElectionPermission,
                          VotePermission,
                          ProposalPermission
                          )
from .serializers import (ElectionSerializer,
                          VoteSerializer,
                          ProposalSerializer
                          )
from .models import Election, Vote, Proposal, Group, Delegate


class ElectionList(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   generics.GenericAPIView):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    permission_classes = (ElectionPermission,)
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Election.objects.filter(groups__name="RxC QV")

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # if the election does not belong to a pre-existing group,
        # create a new one for it.
        request_groups = serializer.validated_data.get('groups') if not(
            serializer.validated_data.get('groups') is None) else []
        election_id = serializer.data.get('id')
        election_object = Election.objects.get(pk=election_id)
        if len(request_groups) == 0:
            new_group = Group.objects.create(
                name="election " + str(election_id))
            election_object.groups.add(new_group)
        # assign can_vote permission to any groups the election belongs to.
        election_groups = election_object.groups.all()
        for group in election_groups:
            assign_perm('can_vote', group, election_object)
        # pack any new groups into server response.
        result = self.get_serializer(election_object)
        headers = self.get_success_headers(result.data)
        return Response(result.data,
                        status=status.HTTP_201_CREATED,
                        headers=headers)

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
        instance = self.get_object()
        serializer = self.get_serializer(
            instance,
            context={'request': request}
            )
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        election_id = serializer.data.get('id')
        election_object = Election.objects.get(pk=election_id)
        # assign can_vote permission to any groups the election belongs to.
        election_groups = election_object.groups.all()
        for group in election_groups:
            assign_perm('can_vote', group, election_object)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class VoteList(mixins.CreateModelMixin,
               mixins.ListModelMixin,
               generics.GenericAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    permission_classes = (VotePermission,)
    authentication_classes = [TokenAuthentication]

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
        serializer = self.get_serializer(
            data=request.data,
            many=True,
            context={'election_id': self.kwargs['pk']}
            )
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProposalList(mixins.CreateModelMixin,
                   mixins.ListModelMixin,
                   generics.GenericAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    permission_classes = (ProposalPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        election_id = self.kwargs['pk']
        election_proposals = self.get_queryset().filter(
            election__id=election_id)
        serializer = self.get_serializer(
            election_proposals,
            many=True,
            context={
                'election_id': self.kwargs['pk']
                },
            )
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
