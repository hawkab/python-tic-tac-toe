from django import forms
from django.db import models
from .models import Human


class SignUpForm(forms.ModelForm):

    class Meta:
        model = Human
        exclude = ()
