from django import forms
from django.contrib.auth.forms import (
    UserCreationForm,
    UserChangeForm,
    AuthenticationForm,
)

from .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ("fullname", "username", "email")
        widgets = {
            "fullname": forms.TextInput(
                attrs={
                    "id": "name",
                    "name": "name",
                    "type": "text",
                    "class": "form-input",
                    "placeholder": "Enter your name",
                }
            ),
            "username": forms.TextInput(
                attrs={
                    "id": "username",
                    "name": "username",
                    "type": "text",
                    "class": "form-input",
                    "placeholder": "choose a username",
                }
            ),
            "email": forms.EmailInput(
                attrs={
                    "id": "email",
                    "name": "email",
                    "type": "email",
                    "class": "form-input",
                    "placeholder": "example@email.com",
                }
            ),
        }

    #        labels = {"fullname": "Full Name", "email": "Email", "username": "Username"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["password1"].widget.attrs.update(
            {"class": "form-input", "placeholder": "••••••••"}
        )
        self.fields["password2"].widget.attrs.update(
            {"class": "form-input", "placeholder": "Confirm passowrd"}
        )


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = ("fullname", "username", "email")
        widgets = {
            "fullname": forms.TextInput(
                attrs={
                    "class": "form-input",
                }
            ),
            "username": forms.TextInput(
                attrs={
                    "class": "form-input",
                }
            ),
            "email": forms.EmailInput(
                attrs={
                    "class": "form-input",
                }
            ),
        }


class UserLoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["username"].widget.attrs.update(
            {
                "class": "form-input",
                "placeholder": "Enter your username",
            }
        )
        self.fields["password"].widget.attrs.update(
            {
                "class": "form-input",
                "placeholder": "••••••••",
            }
        )
