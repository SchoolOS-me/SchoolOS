from django.urls import path

from apps.attendance.views.view_parent import ParentAttendanceAPI

from apps.attendance.views.views import (
    AttendanceSessionCreateAPI,
    AttendanceSessionListAPI,
    MarkAttendanceAPI,  
)

urlpatterns = [
    path("sessions/", AttendanceSessionCreateAPI.as_view()),
    path("sessions/list/", AttendanceSessionListAPI.as_view()),
    path("mark/", MarkAttendanceAPI.as_view()),
]
urlpatterns += [
    path("parent/attendance/", ParentAttendanceAPI.as_view()),
]
