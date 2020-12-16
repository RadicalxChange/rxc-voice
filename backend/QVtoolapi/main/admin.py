from django.contrib import admin

from .models import (Election, Proposal, Delegate)

# Register your models here.

admin.site.register(Proposal)
