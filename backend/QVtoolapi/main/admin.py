from django.contrib import admin
from django.contrib.auth.models import Group

from .models import (Conversation)

# Register your models here.

admin.site.register(Conversation)
