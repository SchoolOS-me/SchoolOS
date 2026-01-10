from django.urls import path
from apps.dashboard.views import *
from apps.dashboard.views.admin import AdminDashboardAPI


urlpatterns = [
    path("admin/summary/", AdminDashboardAPI.as_view()),
]
