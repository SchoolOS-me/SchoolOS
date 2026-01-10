from django.db import models, transaction, IntegrityError
from apps.multitenancy.models import Tenant
from apps.academics.models import SchoolClass, Section, Student, Teacher



class AttendanceSession(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="attendance_sessions",
    )
    date = models.DateField()

    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="attendance_sessions",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="attendance_sessions",
    )

    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.PROTECT,
        related_name="attendance_sessions",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("tenant", "date", "school_class", "section")

    def __str__(self):
        return f"{self.date} - {self.school_class} {self.section}"


class StudentAttendance(models.Model):
    session = models.ForeignKey(
        AttendanceSession,
        on_delete=models.CASCADE,
        related_name="records",
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="attendance_records",
    )

    is_present = models.BooleanField(default=True)
    remarks = models.CharField(max_length=255, blank=True)

    class Meta:
        unique_together = ("session", "student")

    def __str__(self):
        return f"{self.student} - {'P' if self.is_present else 'A'}"

