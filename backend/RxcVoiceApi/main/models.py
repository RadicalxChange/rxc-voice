from django.db import models
from polymorphic.models import PolymorphicModel
from django.contrib.auth.models import (User, Group)
import uuid


class Process(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    title = models.CharField(max_length=256, blank=False)
    description = models.TextField(blank=True, null=True)
    invitation_message = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)
    groups = models.ManyToManyField(Group, blank=True, default=[])
    curr_stage = models.DecimalField(
        default=0, blank=True, max_digits=2, decimal_places=0)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "processes"
        permissions = [
            ("can_view", "Can view"),
        ]


class Profile(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    # When a user deletes their account, their user object is not deleted.
    # "is_active" field is set to 'False'.
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    GITHUB = 'git'
    TWITTER = 'twt'
    APPLICATION = 'app'
    OAUTH_CHOICES = (
        (GITHUB, 'Github'),
        (TWITTER, 'Twitter'),
        (APPLICATION, 'Application'),
    )
    oauth_provider = models.CharField(max_length=3, choices=OAUTH_CHOICES,
                              default=GITHUB)
    oauth_token = models.CharField(max_length=256, blank=True, null=True)
    oauth_token_secret = models.CharField(max_length=256, blank=True, null=True)
    is_verified = models.BooleanField(default=False, blank=True)
    public_username = models.CharField(max_length=64, blank=True, null=True)
    # Represented by path
    profile_pic = models.TextField(null=True, blank=True)
    groups_managed = models.ManyToManyField(Group, blank=True, default=[])

    def __str__(self):
        return self.user.email


class Delegate(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    profile = models.ForeignKey(
        Profile, related_name='delegates', on_delete=models.CASCADE)
    invited_by = models.ForeignKey(
        Profile, related_name='delegates_invited', blank=True, null=True, on_delete=models.SET_NULL)
    process = models.ForeignKey(Process, related_name='delegates', on_delete=models.CASCADE)
    credit_balance = models.DecimalField(
        default=0, blank=True, max_digits=6, decimal_places=0)  # must be staff to change from default

    def __str__(self):
        return self.profile.user.email


class Stage(PolymorphicModel):
    id = models.AutoField(primary_key=True, editable=False)
    DELEGATION = 'delg'
    CONVERSATION = 'conv'
    ELECTION = 'elec'
    CUSTOM = 'cust'
    STAGE_TYPE_CHOICES = (
        (DELEGATION, 'delegation'),
        (CONVERSATION, 'conversation'),
        (ELECTION, 'election'),
        (CUSTOM, 'custom'),
    )
    type = models.CharField(max_length=4, choices=STAGE_TYPE_CHOICES,
                                    default=CUSTOM, editable=False)
    title = models.CharField(max_length=256, blank=False)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)
    process = models.ForeignKey(Process, related_name='stages', on_delete=models.CASCADE)
    position = models.DecimalField(
                default=0, max_digits=2, decimal_places=0, editable=True)

    def __str__(self):
        return self.title


class Delegation(Stage):
    num_credits = models.DecimalField(
        default=99, max_digits=10, decimal_places=0)
    allow_transfers = models.BooleanField(default=True, blank=True)
    allow_invites = models.BooleanField(default=True, blank=True)
    NONE = 'none'
    DEFAULT = 'default'
    INFINITE = 'infinite'
    MATCHING_POOL_CHOICES = (
        (NONE, 'none'),
        (DEFAULT, 'default'),
        (INFINITE, 'infinite'),
    )
    matching_pool = models.CharField(max_length=8, choices=MATCHING_POOL_CHOICES,
                                    default=DEFAULT)

    def save(self, *args, **kwargs):
        # if transfers are not allowed, there can be no invites or qf matching
        self.type = Stage.DELEGATION
        if not self.allow_transfers:
            self.allow_invites = False
            self.matching_pool = Delegation.NONE
        super(Delegation, self).save(*args, **kwargs)


class Conversation(Stage):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    show_report = models.BooleanField(default=False, blank=True)
    report_id = models.CharField(max_length=256, blank=True)

    class Meta:
        permissions = [
            ("can_view", "Can view"),
        ]

    def save(self, *args, **kwargs):
        self.type = Stage.CONVERSATION
        super(Conversation, self).save(*args, **kwargs)


class Election(Stage):
    negative_votes = models.BooleanField(default=True)

    class Meta:
        permissions = [
            ("can_vote", "Can vote"),
            ("can_view_results", "Can view results"),
        ]

    def save(self, *args, **kwargs):
        self.type = Stage.ELECTION
        super(Election, self).save(*args, **kwargs)


class Proposal(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    title = models.CharField(max_length=256, blank=False)
    description = models.TextField(blank=True)
    ballot_ratification = models.BooleanField(default=False)
    link = models.CharField(max_length=512, blank=True)
    election = models.ForeignKey(Election, on_delete=models.CASCADE,
                                 null=True, blank=False)
    credits_received = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, editable=False)
    votes_received = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, editable=False)

    def __str__(self):
        return self.title


class Vote(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    # When a user deletes their account, their user object is not deleted.
    # "is_active" field is set to 'False'.
    sender = models.ForeignKey(Delegate, null=True, on_delete=models.SET_NULL)
    proposal = models.ForeignKey(Proposal, on_delete=models.SET_NULL,
                                 null=True, blank=False)
    amount = models.DecimalField(
        default=0, max_digits=4, decimal_places=0)
    date = models.DateTimeField(null=True)

    def __str__(self):
        return str(self.sender) + " " + str(self.amount) + " -> " + str(self.proposal)


class Transfer(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    sender = models.ForeignKey(
        Delegate, related_name='transfers_sent', null=True, on_delete=models.SET_NULL)
    recipient = models.CharField(max_length=64, blank=True, null=True)
    recipient_object = models.ForeignKey(
        Delegate, related_name='transfers_received', null=True, blank=True, on_delete=models.SET_NULL)
    amount = models.DecimalField(
        default=0, blank=True, max_digits=6, decimal_places=0)
    date = models.DateTimeField(blank=False)
    PENDING = 'P'
    ACCEPTED = 'A'
    CANCELED = 'C'
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (ACCEPTED, 'Accepted'),
        (CANCELED, 'Canceled'),
    )
    status = models.CharField(max_length=1, choices=STATUS_CHOICES,
                              default=PENDING)
    delegation = models.ForeignKey(Delegation, related_name='transfers', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return str(self.sender) + " " + str(self.amount) + " -> " + self.recipient


class MatchPayment(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    recipient = models.ForeignKey(
        Delegate, null=True, on_delete=models.SET_NULL)
    amount = models.DecimalField(
        default=0, blank=True, max_digits=6, decimal_places=0)
    date = models.DateTimeField(blank=False)
    delegation = models.ForeignKey(Delegation, related_name='match_payments', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return str(self.process) + " " + str(self.amount) + " -> " + str(self.recipient)
