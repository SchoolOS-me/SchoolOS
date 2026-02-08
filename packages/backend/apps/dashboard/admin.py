from django.utils.timezone import now
from django.db.models import Count, Q

from apps.academics.models import Student, Teacher, SchoolClass, Section
from apps.attendance.models import AttendanceSession, StudentAttendance
from apps.academics.models import Exam, StudentResult
from apps.dashboard.utils import filter_by_tenant


def get_admin_dashboard_summary(tenant):
    today = now().date()

    # Academics
    students_qs = Student.objects.filter(is_active=True)
    students_qs = filter_by_tenant(students_qs, tenant)
    total_students = students_qs.count()

    teachers_qs = Teacher.objects.filter(is_active=True)
    teachers_qs = filter_by_tenant(teachers_qs, tenant)
    total_teachers = teachers_qs.count()

    classes_qs = SchoolClass.objects.all()
    classes_qs = filter_by_tenant(classes_qs, tenant)
    total_classes = classes_qs.count()

    sections_qs = Section.objects.all()
    sections_qs = filter_by_tenant(sections_qs, tenant)
    total_sections = sections_qs.count()

    # Attendance (today)
    sessions_today = AttendanceSession.objects.filter(
        date=today,
        status=AttendanceSession.STATUS_SUBMITTED,
    )
    sessions_today = filter_by_tenant(sessions_today, tenant)

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
    exams_qs = Exam.objects.all()
    exams_qs = filter_by_tenant(exams_qs, tenant)
    total_exams = exams_qs.count()

    results_qs = StudentResult.objects.filter(
        student_exam__exam__is_published=True,
    )
    if tenant is not None:
        results_qs = results_qs.filter(student_exam__exam__tenant=tenant)
    published_results = results_qs.count()

    pass_qs = StudentResult.objects.filter(
        is_pass=True,
        student_exam__exam__is_published=True,
    )
    if tenant is not None:
        pass_qs = pass_qs.filter(student_exam__exam__tenant=tenant)
    pass_count = pass_qs.count()

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
