from rest_framework import serializers
from django.contrib.auth import authenticate
from guardian.shortcuts import assign_perm
from django.utils.translation import gettext_lazy as _
import uuid
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db.models import Q

from .models import Election, Vote, Proposal, Delegate, Profile, Conversation, Process, Transfer
from django.contrib.auth.models import (User, Group, Permission)


class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = '__all__'

    def create(self, validated_data):
        conversation = Conversation.objects.create(
            uuid=str(uuid.uuid1()),
            title=validated_data.get('title'),
            description=validated_data.get('description'),
            start_date=validated_data.get('start_date'),
            end_date=validated_data.get('end_date'),
            )
        conversation.groups.set(validated_data.get('groups', []))
        return conversation


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'

    def create(self, validated_data):
        try:
            existing_vote = Vote.objects.get(Q(proposal=validated_data['proposal'], sender=validated_data['sender']))
        except(Vote.DoesNotExist):
            existing_vote = None
        if existing_vote is not None:
            updated_vote = self.update(existing_vote, validated_data)
            return updated_vote
        else:
            election = Election.objects.get(pk=self.context.get('election_id'))
            sender = Delegate.objects.get(pk=validated_data['sender'].id)
            assign_perm('can_view_results', sender.user, election)

            proposal = Proposal.objects.get(pk=validated_data['proposal'].id)
            amount = int(validated_data['amount'])
            proposal.votes_received = proposal.votes_received + amount
            proposal.credits_received = proposal.credits_received + (amount * amount)
            proposal.save()
            sender.credit_balance -= amount * amount
            sender.save()
            vote = Vote.objects.create(
                sender=sender,
                proposal=validated_data['proposal'],
                amount=validated_data['amount'],
                date=validated_data['date'],
            )
            return vote

    def update(self, instance, validated_data):
        # update Vote object
        old_amount = instance.amount
        new_amount = validated_data.get('amount', instance.amount)
        instance.amount = new_amount
        instance.save()

        # update Delegate and Proposal objects
        sender = Delegate.objects.get(pk=validated_data['sender'].id)
        proposal = Proposal.objects.get(pk=validated_data['proposal'].id)
        proposal.votes_received = proposal.votes_received - old_amount + new_amount
        proposal.credits_received = proposal.credits_received - (old_amount * old_amount) + (new_amount * new_amount)
        proposal.save()
        sender.credit_balance += (old_amount * old_amount)
        sender.credit_balance -= (new_amount * new_amount)
        sender.save()
        return instance


class ProposalSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(ProposalSerializer, self).__init__(*args, **kwargs)
        election = Election.objects.get(id=self.context.get('election_id'))
        if timezone.now() < election.end_date:
            self.fields.pop('votes_received')
            self.fields.pop('credits_received')

    class Meta:
        model = Proposal
        fields = '__all__'


class ElectionSerializer(serializers.ModelSerializer):
    show_results = serializers.SerializerMethodField()

    class Meta:
        model = Election
        fields = '__all__'

    def get_show_results(self, obj):
        return self.context.get('request').user.has_perm('can_view_results', obj)


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)
        allowed_fields = self.context.get('allowed_fields', None)
        if allowed_fields:
            field_names = list(self.fields.keys()).copy()
            for field in field_names:
                if field not in set(allowed_fields):
                    self.fields.pop(field)

    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ('is_active', 'is_staff')
        extra_kwargs = {
            'password': {'write_only': True},
            'username': {'required': False},
            'email': {'required': True},
            }

    def create(self, validated_data, set_unusable_password):
        validated_data['username'] = validated_data.get('email', '')
        user = User(
            username=validated_data.get('username'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            email=validated_data.get('email'),
            is_staff=validated_data.get('is_staff', False),
            is_superuser=validated_data.get('is_superuser', False),
        )
        # if the user was created by an admin, set an unusable password
        if set_unusable_password:
            user.set_unusable_password()
        else:
            user.set_password(validated_data['password'])
        user.save()
        user.groups.set(validated_data.get('groups', []))
        return user

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        if validated_data.get('password', '') != '':
            instance.set_password(validated_data['password'])
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(ProfileSerializer, self).__init__(*args, **kwargs)
        allowed_fields = self.context.get('allowed_fields', None)
        if allowed_fields:
            field_names = list(self.fields.keys()).copy()
            for field in field_names:
                if field not in set(allowed_fields):
                    self.fields.pop(field)
            self.fields['user'] = UserSerializer(
                required=True,
                context={'allowed_fields': ['id', 'first_name', 'last_name', 'is_active']}
                )
        else:
            self.fields['user'] = UserSerializer(required=True)

    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ('is_verified', 'user', 'public_username', 'oauth_provider', 'oauth_token', 'oauth_token_secret')

    def create(self, validated_data, set_unusable_password):
        user_data = validated_data.get('user')
        user = UserSerializer.create(
            UserSerializer(),
            validated_data=user_data,
            set_unusable_password=set_unusable_password)
        profile, created = Profile.objects.update_or_create(
            user=user,
            profile_pic=validated_data.get('profile_pic'),
            )
        return profile

    def update(self, instance, validated_data):
        instance.oauth_provider = validated_data.get('oauth_provider', instance.oauth_provider)
        instance.save()

        user = instance.user
        user.username = validated_data.get('username', user.username)
        user.first_name = validated_data.get('first_name', user.first_name)
        user.last_name = validated_data.get('last_name', user.last_name)
        user.email = validated_data.get('email', user.email)
        if validated_data.get('password', '') != '':
            user.set_password(validated_data['password'])
        user.save()

        return instance


class DelegateSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(DelegateSerializer, self).__init__(*args, **kwargs)
        self.fields['pending_credits'] = serializers.SerializerMethodField()
        allowed_fields = self.context.get('allowed_fields', None)
        # if the object is being loaded without object-level permissions, load public info only
        if allowed_fields:
            field_names = list(self.fields.keys()).copy()
            for field in field_names:
                if field not in set(allowed_fields):
                    self.fields.pop(field)
            self.fields['profile'] = ProfileSerializer(
                required=True,
                context={'allowed_fields': ['id', 'user', 'is_verified', 'public_username', 'oauth_provider']}
                )
        else:
            self.fields['profile'] = ProfileSerializer(required=True)

    class Meta:
        model = Delegate
        fields = '__all__'
        read_only_fields = ('pending_credits', 'profile', 'invited_by')

    def get_pending_credits(self, obj):
        pending_transfers = Transfer.objects.all().filter(Q(recipient_object=obj), Q(status='P'))
        total = 0
        for transfer in pending_transfers:
            total += transfer.amount
        return total

    def create(self, validated_data, set_unusable_password):
        profile_data = validated_data.get('profile')
        existing_user = User.objects.get(email=profile_data.user.email)
        if existing_user is not None:
            profile = Profile.objects.get(user=existing_user)
        else:
            profile = ProfileSerializer.create(
                ProfileSerializer(),
                validated_data=profile_data,
                set_unusable_password=set_unusable_password
                )
        delegate, created = Delegate.objects.update_or_create(
            profile=profile,
            invited_by=validated_data.get('invited_by'),
            process=validated_data.get('process'),
            credit_balance=validated_data.get('credit_balance', 0),
            )
        return delegate


class TransferSerializer(serializers.ModelSerializer):
    user_is_sender = serializers.SerializerMethodField()

    class Meta:
        model = Transfer
        fields = '__all__'
        extra_kwargs = {
            'sender' : {'write_only': True},
            'recipient': {'write_only': True},
            'recipient_object': {'write_only': True},
            'date': {'write_only': True},
            }

    def get_user_is_sender(self, obj):
        return obj.sender.user.id == self.context.get('request').user.id if obj.sender else False

    def create(self, validated_data):
        process = validated_data.get('process')
        if process.conversation.start_date < timezone.now():
            raise ValidationError("Invalid Transfer: Delegation Stage is concluded.")
        recipient = validated_data.get('recipient')
        sender = validated_data.get('sender')
        if not sender:
            raise ValidationError("Invalid sender: delegate not found.")
        if int(self.context.get('request').data['amount']) > sender.credit_balance:
            raise ValidationError("Invalid amount: insufficient credits.")
        recipient_object = Delegate.objects.filter(profile__user__email=recipient).first()
        if not recipient_object:
            recipient_object = Delegate.objects.filter(profile__public_username=recipient).first()
        is_invitation = not recipient_object
        if is_invitation:
            new_delegate = DelegateSerializer.create(
                DelegateSerializer(),
                validated_data={
                'profile': {
                    'user': {
                        'username': recipient,
                        'email': recipient,
                    },
                },
                'process': process,
                'credit_balance': 0,
                'invited_by': sender,
                },
                set_unusable_password=True)
            group = process.groups.first()
            if group is not None:
                new_delegate.profile.user.groups.add(group)
            recipient_object = new_delegate
        elif recipient_object.id == sender.id or self.context.get('request').user.id == recipient_object.id:
            raise ValidationError("Invalid transfer.")
        sender.credit_balance -= validated_data.get('amount')
        sender.save()
        transfer = Transfer.objects.create(
            sender=sender,
            recipient=recipient,
            recipient_object=recipient_object,
            amount=validated_data.get('amount'),
            date=validated_data.get('date'),
            status=('P'),
            process=process,
            )
        return transfer


class CustomAuthTokenSerializer(serializers.Serializer):
    email = serializers.EmailField(
        label=_("Email"),
        write_only=True
        )
    password = serializers.CharField(
        label=_("Password",),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )
    token = serializers.CharField(
        label=_("Token"),
        read_only=True
    )

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'),
                                email=email, password=password)
            """
            The authenticate call simply returns None for is_active=False
            users. (Assuming the default ModelBackend authentication
            backend.)
            """
            if not user:
                msg = _('Unable to log in with provided credentials.')
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs


class ProcessSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(ProcessSerializer, self).__init__(*args, **kwargs)
        self.fields['election'] = ElectionSerializer(context=self.context)
        self.fields['delegates'] = DelegateSerializer(
            many=True,
            context={'allowed_fields': ['id', 'profile', 'invited_by', 'process', 'credit_balance', 'pending_credits']}
            )
        self.fields['conversation'] = ConversationSerializer()

    class Meta:
        model = Process
        fields = '__all__'

    def create(self, validated_data):
        conversation_data = validated_data.get('conversation')
        if conversation_data is not None:
            conversation_data = ConversationSerializer.create(
                ConversationSerializer(),
                validated_data=conversation_data,
                )
        election_data = validated_data.get('election')
        if election_data is not None:
            election_data = ElectionSerializer.create(
                ElectionSerializer(),
                validated_data=election_data,
            )
        process, created = Process.objects.update_or_create(
            title=validated_data.get('title'),
            description=validated_data.get('description'),
            start_date=validated_data.get('start_date'),
            end_date=validated_data.get('end_date'),
            matching_pool=validated_data.get('matching_pool'),
            conversation=conversation_data,
            curation_info=validated_data.get('curation_info'),
            top_posts=validated_data.get('top_posts', []),
            election=election_data,
            )
        process.groups.set(validated_data.get('groups', []))
        process.delegates.set(validated_data.get('delegates', []))
        return process
