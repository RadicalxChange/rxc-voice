from django.contrib import admin
from guardian.shortcuts import assign_perm

from .models import (Election, Proposal, Delegate, Process, Conversation)

# Register your models here.

class ElectionAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        groups = obj.groups.all()
        for group in groups:
            assign_perm('can_vote', group, obj)
        super().save_model(request, obj, form, change)

admin.site.register(Election, ElectionAdmin)
admin.site.register(Proposal)
admin.site.register(Delegate)
admin.site.register(Process)
admin.site.register(Conversation)
