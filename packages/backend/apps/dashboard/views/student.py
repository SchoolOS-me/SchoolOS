from datetime import timedelta

from django.db.models import Avg
from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_student
from apps.academics.models import SectionSubject, StudentResult, StudentMark
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

        return Response(
            {
                "stats": {
                    "gpa": gpa,
                    "attendance_percentage": attendance_percentage,
                    "credits_earned": passed_exams,
                    "credits_total": total_exams,
                    "active_courses": active_courses,
                },
                "grades": grades,
                "announcements": [],
                "deadlines": [],
            }
        )
