from django.urls import path
from .views import (
    AttendanceSessionCreateAPI,
    AttendanceSessionListAPI,
    MarkAttendanceAPI,
)

urlpatterns = [
    path("sessions/", AttendanceSessionCreateAPI.as_view()),
    path("sessions/list/", AttendanceSessionListAPI.as_view()),
    path("mark/", MarkAttendanceAPI.as_view()),
]
