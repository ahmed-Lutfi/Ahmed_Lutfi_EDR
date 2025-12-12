from django.urls import path
from .views import (
    home_view,
    login_page,
    signup_page,
    dashboard_overview,
    AlertsListView,
    dashboard_endpoints,
    dashboard_rules,
    dashboard_users,
)

app_name = "web"

urlpatterns = [
    path("", home_view, name="index"),
    path("login/", login_page, name="login"),
    path("signup/", signup_page, name="signup"),
    # Dashboard sections
    path("dashboard/", dashboard_overview, name="dashboard_overview"),
    path("dashboard/alerts/", AlertsListView.as_view(), name="alerts_list"),
    path("dashboard/endpoints/", dashboard_endpoints, name="dashboard_endpoints"),
    path("dashboard/rules/", dashboard_rules, name="dashboard_rules"),
    path("dashboard/users/", dashboard_users, name="dashboard_users"),
]
