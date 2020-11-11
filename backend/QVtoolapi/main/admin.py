from django.contrib import admin

from .models import (Election, Proposal, User, AnonVoter)

# Register your models here.

admin.site.register(Election)
admin.site.register(Proposal)
admin.site.register(User)
admin.site.register(AnonVoter)
