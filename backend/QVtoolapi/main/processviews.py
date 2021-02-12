from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, mixins, status
from django.db.models import Q
from .serializers import ProcessSerializer, TransferSerializer
from .permissions import ProcessPermission, TransferPermission
from .models import Process, Transfer, Delegate, MatchPayment
from guardian.shortcuts import assign_perm
from django.core.exceptions import ValidationError
from django.utils import timezone
from .services import match_transfers


class ProcessList(mixins.CreateModelMixin,
                  mixins.ListModelMixin,
                  generics.GenericAPIView):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer

    permission_classes = (ProcessPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        processes = []
        for process in self.get_queryset():
            groups = process.groups.all()
            for group in groups:
                assign_perm('can_view', group, process)
            if request.user.has_perm('can_view', process):
                processes.append(process)
        page = self.paginate_queryset(processes)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(processes, many=True)
        response = Response(serializer.data)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        process_id = serializer.data.get('id')
        process_object = Process.objects.get(pk=process_id)
        headers = self.get_success_headers(serializer.data)
        # assign can_view permission to any groups the process belongs to.
        groups = process_object.groups.all()
        for group in groups:
            assign_perm('can_view', group, process_object)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)

    def delete(self, request, *args, **kwargs):
        for instance in self.get_queryset():
            instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProcessDetail(mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin,
                    mixins.DestroyModelMixin,
                    generics.GenericAPIView):
    queryset = Process.objects.all()
    serializer_class = ProcessSerializer

    permission_classes = (ProcessPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        # eventually need a better way to do this to avoid async problems
        if (timezone.now() > instance.conversation.start_date) and (instance.matching_pool != 0):
            match_transfers(instance, instance.matching_pool)
            if timezone.now() > instance.election.start_date:
                instance.status = 'Election'
            else:
                instance.status = 'Deliberation'
        else:
            instance.status = 'Delegation'
        instance.save()
        election_object = instance.election
        serializer = self.get_serializer(instance)
        response_election = {
            'show_results': request.user.has_perm('can_view_results', election_object)
            }
        response_election.update(serializer.data['election'])
        result = serializer.data
        result['election'] = response_election
        return Response(result)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)




class TransferList(mixins.CreateModelMixin,
           mixins.ListModelMixin,
           generics.GenericAPIView):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer

    permission_classes = (TransferPermission,)
    authentication_classes = [TokenAuthentication]

    def get(self, request, *args, **kwargs):
        process = self.kwargs['pk']
        transfers = self.get_queryset().filter(Q(process__id=process), Q(recipient_object__user=request.user) | Q(sender__user=request.user))
        print(transfers)
        page = self.paginate_queryset(transfers)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(transfers, many=True)
        result_transfers = []
        for transfer in serializer.data:
            t = {
                'user_is_sender': (transfer["sender"]["user"]["id"] == request.user.id)
                }
            print(transfer["sender"]["user"]["id"] == request.user.id)
            t.update(transfer)
            t.pop("sender")
            result_transfers.append(t)
        match = MatchPayment.objects.all().filter(Q(recipient__user=request.user), Q(process__id=process))
        result = {}
        result["transfers"] = result_transfers
        result["match"] = match.amount if match else 0
        return Response(result)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
            )
        sender_object = Delegate.objects.all().filter(pk=request.data.get('sender')).first()
        if not sender_object:
            raise ValidationError("Invalid sender: delegate not found.")
        if int(request.data.get('amount')) > sender_object.credit_balance:
            # delete recipient user if autogenerated
            raise ValidationError("Invalid amount: insufficient credits.")
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


# for testing only.
# class TransferListAll(mixins.CreateModelMixin,
#                       mixins.ListModelMixin,
#                       generics.GenericAPIView):
#
#     queryset = Transfer.objects.all()
#     serializer_class = TransferSerializer
#
#     def get(self, request, *args, **kwargs):
#         return self.list(request, *args, **kwargs)
#
#     def post(self, request, *args, **kwargs):
#         return self.create(request, *args, **kwargs)
#
#     def delete(self, request, *args, **kwargs):
#         for instance in self.get_queryset():
#             instance.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)
