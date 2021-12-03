from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework.authentication import TokenAuthentication
from rest_framework import generics, mixins, status
from django.db.models import Q
from .serializers import ProfileSerializer, ProcessSerializer, TransferSerializer, DelegateSerializer, StageSerializer, DelegationSerializer, ConversationSerializer, ElectionSerializer
from .permissions import ProcessPermission, TransferPermission
from .models import Process, Transfer, MatchPayment, Stage, Delegate, Profile, Proposal
from django.contrib.auth.models import Group, User
from guardian.shortcuts import assign_perm
from django.utils import timezone
from .services import estimate_match
from .utils import advance_stage


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
            # can probably move this?
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
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        # create process object
        serializer = self.get_serializer(data=request.data['process'])
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        process_id = serializer.data.get('id')
        process_object = Process.objects.get(pk=process_id)
        # create stages
        stages = request.data['stages']
        for stage in stages:
            stage['process'] = process_id
            if stage['type'] == Stage.DELEGATION:
                stage_serializer = DelegationSerializer(data=stage)
                stage_serializer.is_valid(raise_exception=True)
                DelegationSerializer.create(
                    DelegationSerializer(),
                    validated_data=stage_serializer.validated_data,
                    )
            elif stage['type'] == Stage.CONVERSATION:
                stage_serializer = ConversationSerializer(data=stage)
                stage_serializer.is_valid(raise_exception=True)
                ConversationSerializer.create(
                    ConversationSerializer(),
                    validated_data=stage_serializer.validated_data,
                    )
            elif stage['type'] == Stage.ELECTION:
                stage_serializer = ElectionSerializer(data=stage)
                stage_serializer.is_valid(raise_exception=True)
                new_election = ElectionSerializer.create(
                    ElectionSerializer(),
                    validated_data=stage_serializer.validated_data,
                    )
                Proposal.objects.create(
                    title="Ballot Ratification",
                    ballot_ratification=True,
                    election=new_election,
                    credits_received=0,
                    votes_received=0,
                    )
            else:
                stage_serializer = StageSerializer(data=stage)
                stage_serializer.is_valid(raise_exception=True)
                StageSerializer.create(
                    StageSerializer(),
                    validated_data=stage_serializer.validated_data,
                    )
        # create new group if necessary
        group_data = request.data['group']
        if group_data['create']:
            new_group = Group.objects.create(name=group_data['name'])
            new_group.save()
            process_object.groups.add(new_group)
            request.user.groups.add(new_group)
        # create new delegates if necessary
        existing_groups = process_object.groups.all()
        for existing_group in existing_groups:
            assign_perm('can_view', existing_group, process_object)
            for user in existing_group.user_set.all():
                Delegate.objects.create(
                    profile=user.profile,
                    process=process_object,
                    credit_balance=request.data['stages'][0]['num_credits'],
                    invited_by=request.user.profile,
                )
        invites = request.data['invites']
        if invites:
            for delegate in invites:
                delegate['process'] = process_id
                if group_data['create']:
                    delegate['profile']['user']['groups'].append(new_group.id)
                for existing_group in existing_groups:
                    delegate['profile']['user']['groups'].append(existing_group.id)
                try:
                    profile_data = delegate['profile']
                    try:
                        existing_user = User.objects.get(email=profile_data['user']['email'])
                    except:
                        existing_user = None
                    if existing_user is not None:
                        profile = Profile.objects.get(user=existing_user)
                    else:
                        profile_serializer = ProfileSerializer(data=profile_data)
                        profile_serializer.is_valid(raise_exception=True)
                        profile = ProfileSerializer.create(
                            ProfileSerializer(),
                            validated_data=profile_serializer.validated_data,
                            set_unusable_password=True,
                            )
                    Delegate.objects.create(
                        credit_balance=delegate['credit_balance'],
                        profile=profile,
                        process=process_object,
                        invited_by=request.user.profile,
                    )
                except:
                    print("could not create user")
        headers = self.get_success_headers(serializer.data)
        # assign can_view permission to any groups the process belongs to.
        result = {}
        result["process"] = serializer.data
        request_profile = Profile.objects.get(id=request.user.profile.id)
        delegate_serializer = DelegateSerializer(
            Delegate.objects.filter(profile=request_profile),
            many=True,
            )
        request_profile.processes_managed.add(process_object)
        result["user_delegates"] = delegate_serializer.data
        result["ok"] = True
        return Response(
            result,
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
        curr_stage = instance.stages.filter(position=instance.curr_stage).first()
        if curr_stage.end_date < timezone.now():
            advance_stage(instance, curr_stage)
        serializer = self.get_serializer(
            instance,
            context={'request': request}
            )
        return Response(serializer.data)

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
        delegation_id = self.kwargs['delegation_id']
        transfers = self.get_queryset().filter(Q(delegation__id=delegation_id),
            Q(recipient_object__profile__user=request.user) | Q(sender__profile__user=request.user))
        serializer = self.get_serializer(
            transfers,
            many=True,
            context={'request': request}
            )
        match = MatchPayment.objects.all().filter(Q(recipient__profile__user=request.user), Q(delegation__id=delegation_id)).first()
        result = {}
        result["transfers"] = serializer.data
        result["match"] = match.amount if match else 0
        return Response(result)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
            context={'request': request}
            )
        serializer.is_valid(raise_exception=True)
        if not request.user.has_perm('can_view', serializer.validated_data.get('delegation').process):
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers)


class EstimateMatch(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    generics.GenericAPIView):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        match = estimate_match(serializer.validated_data)
        response = {}
        response['estimated_match'] = match
        return JsonResponse({'estimated_match': match})
