from django.contrib import admin
from guardian.shortcuts import assign_perm
import uuid

from .models import (Election, Proposal, Delegate, Process, Conversation, Transfer, MatchPayment)
from .signals import send_register_mail

class ElectionAdmin(admin.ModelAdmin):
    list_display = ['id','title','start_date','end_date']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super(ElectionAdmin, self).save_related(request, form, formsets, change)
        for group in form.instance.groups.all():
            assign_perm('can_vote', group, form.instance)


class ConversationAdmin(admin.ModelAdmin):
    list_display = ['id','title','start_date','end_date']

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        if not change:
            form.instance.uuid = str(uuid.uuid1())
        form.instance.save()


class DelegateAdmin(admin.ModelAdmin):
    list_display = ['id','user','public_username','is_verified','credit_balance','invited_by']


class TransferAdmin(admin.ModelAdmin):
    list_display = ['id','sender','recipient','amount','date','status','process']


class ProcessAdmin(admin.ModelAdmin):
    list_display = ['id','title','start_date','end_date','matching_pool','status']


class ProposalAdmin(admin.ModelAdmin):
    list_display = ['id','title','ballot_ratification','election']


class MatchPaymentAdmin(admin.ModelAdmin):
    list_display = ['id','recipient','amount','date','process']


admin.site.register(Election, ElectionAdmin)
admin.site.register(Proposal, ProposalAdmin)
admin.site.register(Delegate, DelegateAdmin)
admin.site.register(Process, ProcessAdmin)
admin.site.register(Conversation, ConversationAdmin)
admin.site.register(Transfer, TransferAdmin)
admin.site.register(MatchPayment, MatchPaymentAdmin)
