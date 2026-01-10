from django.utils.timezone import now
from django.db.models import Count, Q

from apps.academics.models import Student, Teacher, SchoolClass, Section
from apps.attendance.models import AttendanceSession, StudentAttendance
from apps.academics.models import Exam, StudentResult


def get_admin_dashboard_summary(tenant):
    today = now().date()

    # Academics
    total_students = Student.objects.filter(
        tenant=tenant,
        is_active=True,
    ).count()

    total_teachers = Teacher.objects.filter(
        tenant=tenant,
        is_active=True,
    ).count()

    total_classes = SchoolClass.objects.filter(
        tenant=tenant,
    ).count()

    total_sections = Section.objects.filter(
        tenant=tenant,
    ).count()

    # Attendance (today)
    sessions_today = AttendanceSession.objects.filter(
        tenant=tenant,
        date=today,
        status=AttendanceSession.STATUS_SUBMITTED,
    )

    total_attendance_records = StudentAttendance.objects.filter(
        session__in=sessions_today,
    ).count()

    present_today = StudentAttendance.objects.filter(
        session__in=sessions_today,
        is_present=True,
    ).count()

    attendance_percentage = (
        (present_today / total_attendance_records) * 100
        if total_attendance_records > 0
        else 0
    )

    # Exams & Results
    total_exams = Exam.objects.filter(
        tenant=tenant,
    ).count()

    published_results = StudentResult.objects.filter(
        student_exam__exam__is_published=True,
    ).count()

    pass_count = StudentResult.objects.filter(
        is_pass=True,
        student_exam__exam__is_published=True,
    ).count()

    pass_percentage = (
        (pass_count / published_results) * 100
        if published_results > 0
        else 0
    )

    return {
        "academics": {
            "students": total_students,
            "teachers": total_teachers,
            "classes": total_classes,
            "sections": total_sections,
        },
        "attendance": {
            "today_percentage": round(attendance_percentage, 2),
        },
        "exams": {
            "total_exams": total_exams,
            "pass_percentage": round(pass_percentage, 2),
        },
    }
