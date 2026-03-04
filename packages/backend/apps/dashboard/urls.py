from django.urls import path

from apps.dashboard.views.admin import AdminDashboardAPI
from apps.dashboard.views.teacher import TeacherDashboardAPI
from apps.dashboard.views.student import StudentDashboardAPI
from apps.dashboard.views.parent import ParentDashboardAPI
from apps.dashboard.views.super_admin import SuperAdminDashboardAPI

urlpatterns = [
    path("super-admin", SuperAdminDashboardAPI.as_view()),
    path("super-admin/", SuperAdminDashboardAPI.as_view()),
    path("admin", AdminDashboardAPI.as_view()),
    path("admin/", AdminDashboardAPI.as_view()),
    path("teacher", TeacherDashboardAPI.as_view()),
    path("teacher/", TeacherDashboardAPI.as_view()),
    path("student", StudentDashboardAPI.as_view()),
    path("student/", StudentDashboardAPI.as_view()),
    path("parent", ParentDashboardAPI.as_view()),
    path("parent/", ParentDashboardAPI.as_view()),  
]
