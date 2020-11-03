import json

from rest_framework import generics, mixins, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Election, Vote, Proposal
from .serializers import ElectionSerializer, VoteSerializer, ProposalSerializer


# Create your views here.

class RootView(APIView):
    def get(self, request):
        resp = {
            'title': 'RadicalxChange QV Tool API'
        }
        return Response(json.dumps(resp), status=status.HTTP_201_CREATED)


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

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class VoteListProposal(mixins.CreateModelMixin,
                       mixins.ListModelMixin,
                       generics.GenericAPIView):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    def get(self, request, *args, **kwargs):
        this_proposal = self.kwargs['pk']
        proposal_votes = self.get_queryset().filter(
            proposal__id=this_proposal)
        serialized = self.get_serializer(data=proposal_votes)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


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
        # get election id from url and set it in the request body.
        if 'pk' in self.kwargs:
            election_id = self.kwargs['pk']
            processedData = request.data.copy()
            processedData["election"] = election_id
            serializer = self.get_serializer(data=processedData)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
                headers=headers)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


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
