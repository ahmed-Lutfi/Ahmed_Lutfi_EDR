from django.urls import path
from django.contrib.auth import views as auth_views
from .views import SignUpView
from .forms import UserLoginForm


app_name = "accounts"

urlpatterns = [
    path("signup/", SignUpView.as_view(), name="signup"),
    path(
        "login/",
        auth_views.LoginView.as_view(
            template_name="registration/login.html", authentication_form=UserLoginForm
        ),
        name="login",
    ),
]
