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


class ElectionDetail(mixins.RetrieveModelMixin,
                     mixins.UpdateModelMixin,
                     mixins.DestroyModelMixin,
                     generics.GenericAPIView):

    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    def get(self, request, *args, **kwargs):
        print('num elections', len(self.get_queryset()))
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
        this_proposal = kwargs[0]
        proposal_votes = self.get_queryset().filter(
            proposal__id=this_proposal)
        serialized = self.serializer_class(proposal_votes)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class ProposalListElection(mixins.CreateModelMixin,
                           mixins.ListModelMixin,
                           generics.GenericAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalSerializer

    def get(self, request, *args, **kwargs):
        this_election = kwargs[0]
        election_proposals = self.get_queryset().filter(
            election__id=this_election)
        serialized = self.serializer_class(election_proposals)
        return Response(serialized.data, status=status.HTTP_201_CREATED)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)
