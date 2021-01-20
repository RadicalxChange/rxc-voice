from django.contrib import admin
from guardian.shortcuts import assign_perm

from .models import (Election, Proposal, Delegate, Process, Conversation, Transfer)
from .signals import send_register_mail

class ElectionAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

    def save_related(self, request, form, formsets, change):
        super(ElectionAdmin, self).save_related(request, form, formsets, change)
        for group in form.instance.groups.all():
            assign_perm('can_vote', group, form.instance)


class DelegateAdmin(admin.ModelAdmin):

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        send_register_mail(self, instance=obj, created=True)


admin.site.register(Election, ElectionAdmin)
admin.site.register(Proposal)
admin.site.register(Delegate, DelegateAdmin)
admin.site.register(Process)
admin.site.register(Conversation)
admin.site.register(Transfer)
