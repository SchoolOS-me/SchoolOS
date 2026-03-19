from datetime import timedelta

from django.db.models import Avg
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_student
from apps.academics.models import Exam, SectionSubject, StudentResult, StudentMark
from apps.attendance.models import StudentAttendance


class StudentDashboardAPI(APIView):

    def get(self, request):
        if not is_student(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        student = getattr(request.user, "student_profile", None)
        if student is None:
            return Response(
                {"detail": "Student profile not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        results_qs = StudentResult.objects.filter(
            student_exam__student=student,
            student_exam__exam__is_published=True,
        )
        latest_result = results_qs.select_related(
            "student_exam",
            "student_exam__exam",
        ).order_by("-generated_at").first()
        avg_percentage = results_qs.aggregate(avg=Avg("percentage"))["avg"]
        gpa = round((avg_percentage / 25), 2) if avg_percentage is not None else None

        today = now().date()
        start_date = today - timedelta(days=29)
        attendance_qs = StudentAttendance.objects.filter(
            student=student,
            session__date__range=(start_date, today),
        )
        total_records = attendance_qs.count()
        present_records = attendance_qs.filter(is_present=True).count()
        attendance_percentage = (
            round((present_records / total_records) * 100, 2)
            if total_records > 0
            else 0
        )

        active_courses = SectionSubject.objects.filter(
            section=student.section
        ).count()

        passed_exams = results_qs.filter(is_pass=True).count()
        total_exams = results_qs.count()

        marks = StudentMark.objects.filter(
            student_exam__student=student,
            marks_obtained__isnull=False,
        ).select_related(
            "exam_subject",
            "exam_subject__subject",
            "student_exam",
            "student_exam__exam",
        ).order_by(
            "-student_exam__exam__start_date",
            "-id",
        )[:5]

        grades = [
            {
                "id": mark.id,
                "subject": mark.exam_subject.subject.name,
                "course": mark.student_exam.exam.name,
                "score": f"{mark.marks_obtained}/{mark.exam_subject.max_marks}",
            }
            for mark in marks
        ]

        announcements = []
        if latest_result is not None:
            announcements.append(
                {
                    "id": f"result-{latest_result.id}",
                    "title": f"{latest_result.student_exam.exam.name} result published",
                    "time": latest_result.generated_at.strftime("%b %d"),
                    "description": (
                        f"Your latest published result is "
                        f"{latest_result.percentage:.2f}%."
                    ),
                    "tag": "Results",
                }
            )

        if attendance_percentage < 90:
            announcements.append(
                {
                    "id": "attendance-alert",
                    "title": "Attendance needs attention",
                    "time": today.strftime("%b %d"),
                    "description": (
                        f"Your attendance in the last 30 days is "
                        f"{attendance_percentage:.2f}%."
                    ),
                    "tag": "Attendance",
                }
            )

        upcoming_exams = Exam.objects.filter(
            academic_year=student.school_class.academic_year,
            start_date__gte=today,
        ).order_by("start_date")[:4]

        deadlines = [
            {
                "id": f"exam-{exam.id}",
                "date": exam.start_date.strftime("%b %d"),
                "title": exam.name,
                "subtitle": f"{student.school_class.name} {student.section.name}",
            }
            for exam in upcoming_exams
        ]

        return Response(
            {
                "student": {
                    "name": student.full_name,
                    "class": student.school_class.name,
                    "section": student.section.name,
                    "school_name": request.user.school.name if request.user.school else None,
                    "academic_year": student.school_class.academic_year.name,
                },
                "stats": {
                    "gpa": gpa,
                    "attendance_percentage": attendance_percentage,
                    "credits_earned": passed_exams,
                    "credits_total": total_exams,
                    "active_courses": active_courses,
                },
                "grades": grades,
                "announcements": announcements,
                "deadlines": deadlines,
            }
        )
