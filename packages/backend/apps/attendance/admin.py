from django.contrib import admin
from .models import AttendanceSession, StudentAttendance

admin.site.register(AttendanceSession)
admin.site.register(StudentAttendance)