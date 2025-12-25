from django.shortcuts import render
from django.views.generic import ListView
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Alerts, Endpoints, MaliciousActivity


def home_view(request):
    return render(request, "web/index.html")


def login_page(request):
    return render(request, "web/login.html")


def signup_page(request):
    return render(request, "web/signup.html")


# Dashboard sections (static for now)


@login_required
def dashboard_overview(request):
    return render(request, "web/dashboard_overview.html", {"section": "overview"})


# def dashboard_alerts(request):
#     return render(request, "web/dashboard_alerts.html", {"section": "alerts"})


# def dashboard_endpoints(request):
#     return render(request, "web/dashboard_endpoints.html", {"section": "endpoints"})


# def dashboard_rules(request):
#     return render(request, "web/dashboard_rules.html", {"section": "rules"})


@login_required
def dashboard_users(request):
    return render(request, "web/dashboard_users.html", {"section": "users"})


# Changing to classes
class AlertsListView(LoginRequiredMixin, ListView):
    model = Alerts
    template_name = "alerts_list.html"


class EndpointsListView(LoginRequiredMixin, ListView):
    model = Endpoints
    template_name = "endpoints_list.html"


class MaliciousActiviyListView(LoginRequiredMixin, ListView):
    model = MaliciousActivity
    template_name = "maliciousactivity_list.html"
