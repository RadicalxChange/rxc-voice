from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin
from guardian.shortcuts import assign_perm
import uuid

from .models import (Vote, Stage, Election, Proposal, Delegate, Profile, Process, Conversation, Delegation, Transfer, MatchPayment)
from .signals import send_register_mail


class StageChildAdmin(PolymorphicChildModelAdmin):
    # base admin class for all child models
    base_model = Stage


class StageParentAdmin(PolymorphicParentModelAdmin):
    # parent model base admin
    base_model = Stage
    child_models = (Delegation, Conversation, Election)


class DelegationAdmin(StageChildAdmin):
    base_model = Delegation
    list_display = ['id', 'title', 'start_date', 'end_date', 'process', 'position', 'matching_pool', 'allow_transfers', 'allow_invites', 'num_credits']


class ConversationAdmin(StageChildAdmin):
    base_model = Conversation
    list_display = ['id', 'title', 'start_date', 'end_date', 'process', 'position', 'show_report', 'report_id']


class ElectionAdmin(StageChildAdmin):
    base_model = Election
    list_display = ['id', 'title', 'start_date', 'end_date', 'process', 'position', 'negative_votes']


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['id','user','public_username','is_verified']


class DelegateAdmin(admin.ModelAdmin):
    list_display = ['id','profile','credit_balance','invited_by']


class TransferAdmin(admin.ModelAdmin):
    list_display = ['id','sender','recipient','amount','date','status', 'delegation']


class ProcessAdmin(admin.ModelAdmin):
    list_display = ['id','title','start_date','end_date']


class ProposalAdmin(admin.ModelAdmin):
    list_display = ['id','title','ballot_ratification','election']


class MatchPaymentAdmin(admin.ModelAdmin):
    list_display = ['id','recipient','amount','date','delegation']


admin.site.register(Stage, StageChildAdmin)
admin.site.register(Delegation, DelegationAdmin)
admin.site.register(Election, ElectionAdmin)
admin.site.register(Vote)
admin.site.register(Proposal, ProposalAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Delegate, DelegateAdmin)
admin.site.register(Process, ProcessAdmin)
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Transfer, TransferAdmin)
admin.site.register(MatchPayment, MatchPaymentAdmin)
