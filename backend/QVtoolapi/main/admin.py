from django.contrib import admin

from .models import (Election, Proposal, User)

# Register your models here.

admin.site.register(Election)
admin.site.register(Proposal)
admin.site.register(User)
# admin.site.register(AnonVoter)
