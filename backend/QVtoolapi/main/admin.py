from django.contrib import admin

from .models import (Election, Proposal, Delegate, Process, Conversation)

# Register your models here.

admin.site.register(Election)
admin.site.register(Proposal)
admin.site.register(Delegate)
admin.site.register(Process)
admin.site.register(Conversation)
