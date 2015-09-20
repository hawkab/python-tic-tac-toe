
from .models import Human
from django.contrib import admin

class HumanAdmin(admin.ModelAdmin):
    class Meta:
    	model = Human

admin.site.register(Human, HumanAdmin)