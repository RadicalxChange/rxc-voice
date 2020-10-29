from django.contrib import admin

from .models import (Election, Proposal)

# Register your models here.

admin.site.register(Election)
admin.site.register(Proposal)
