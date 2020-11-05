from django.db import models
from django.contrib.auth.models import (
    AbstractUser
)
from .managers import UserManager

# Create your models here.


class User(AbstractUser):
    username = None
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
        )
    # Represented by path
    profile_pic = models.TextField(blank=False)
    # encrypted
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    oauth_uuid = models.CharField(max_length=256, blank=True, null=True)
    # When a user deletes their account, their user object is not deleted.
    # "is_active" field is set to 'False'.
    invited_by = models.ForeignKey(
        'self', null=True, on_delete=models.SET_NULL)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = UserManager()

    def __str__(self):
        return self.email


class Election(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    title = models.CharField(max_length=256, blank=False)
    description = models.TextField(blank=True)
    start_date = models.DateTimeField(blank=False)
    end_date = models.DateTimeField(blank=False)
    negative_votes = models.BooleanField(default=True)
    matching_fund = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, blank=False)
    # What icon should be used to represent a vote credit. Represented by path.
    vote_token = models.TextField(
        blank=False, default='../../../frontend/public/black-square.png')
    # Number of vote credits each voter will start out with.
    num_tokens = models.DecimalField(
        default=99, blank=False, max_digits=4, decimal_places=0)


class Proposal(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    title = models.CharField(max_length=256, blank=False)
    description = models.TextField(blank=True)
    link = models.CharField(max_length=512, blank=True)
    election = models.ForeignKey(Election, on_delete=models.CASCADE,
                                 null=True, blank=False)
    sum_contributions = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, editable=False)
    current_match = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, editable=False)
    num_contributors = models.DecimalField(
        default=0, max_digits=10, decimal_places=0, editable=False)


class Vote(models.Model):
    id = models.AutoField(primary_key=True, editable=False)
    # When a user deletes their account, their user object is not deleted.
    # "is_active" field is set to 'False'.
    sender = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    proposal = models.ForeignKey(Proposal, on_delete=models.PROTECT,
                                 null=True, blank=False)
    amount = models.DecimalField(
        default=0, max_digits=4, decimal_places=0)
    date = models.DateTimeField(null=True)
