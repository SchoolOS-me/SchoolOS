from django.db.models import Count, Q
from apps.attendance.models import AttendanceSession, StudentAttendance
from apps.academics.models import Student


def get_student_attendance_summary(
    *,
    student,
    start_date,
    end_date,
):
    total_sessions = AttendanceSession.objects.filter(
        date__range=(start_date, end_date),
        school_class=student.school_class,
        section=student.section,
        tenant=student.tenant,
    ).count()

    present_count = StudentAttendance.objects.filter(
        student=student,
        session__date__range=(start_date, end_date),
        is_present=True,
    ).count()

    percentage = (
        (present_count / total_sessions) * 100
        if total_sessions > 0
        else 0
    )

    return {
        "student_uuid": str(student.uuid),
        "student_name": student.full_name,
        "total_days": total_sessions,
        "present_days": present_count,
        "percentage": round(percentage, 2),
    }


def get_section_attendance_report(
    *,
    school_class_uuid,
    section_uuid,
    start_date,
    end_date,
):
    students = Student.objects.filter(
        school_class__uuid=school_class_uuid,
        section__uuid=section_uuid,
        is_active=True,
    )

    return [
        get_student_attendance_summary(
            student=student,
            start_date=start_date,
            end_date=end_date,
        )
        for student in students
    ]


def get_attendance_defaulters(
    *,
    school_class_uuid,
    section_uuid,
    start_date,
    end_date,
    threshold_percentage=75,
):
    report = get_section_attendance_report(
        school_class_uuid=school_class_uuid,
        section_uuid=section_uuid,
        start_date=start_date,
        end_date=end_date,
    )

    return [
        r for r in report
        if r["percentage"] < threshold_percentage
    ]
