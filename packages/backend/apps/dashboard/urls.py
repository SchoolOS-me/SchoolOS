from django.urls import path

from apps.dashboard.views.admin import AdminDashboardAPI
from apps.dashboard.views.teacher import TeacherDashboardAPI
from apps.dashboard.views.student import StudentDashboardAPI
from apps.dashboard.views.parent import ParentDashboardAPI
from apps.dashboard.views.super_admin import SuperAdminDashboardAPI


urlpatterns = [
    path("admin/summary/", AdminDashboardAPI.as_view()),
    path("teacher/summary/", TeacherDashboardAPI.as_view()),
    path("student/summary/", StudentDashboardAPI.as_view()),
    path("parent/summary/", ParentDashboardAPI.as_view()),
    path("super-admin/summary/", SuperAdminDashboardAPI.as_view()),
]
