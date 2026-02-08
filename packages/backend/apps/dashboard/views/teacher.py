from datetime import timedelta

from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_teacher
from apps.academics.models import TeachingAssignment, Student, StudentMark
from apps.attendance.models import AttendanceSession, StudentAttendance


class TeacherDashboardAPI(APIView):

    def get(self, request):
        if not is_teacher(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        teacher = getattr(request.user, "teacher_profile", None)
        if teacher is None:
            return Response(
                {"detail": "Teacher profile not found"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assignments = TeachingAssignment.objects.filter(
            teacher=teacher
        ).select_related(
            "section",
            "section__school_class",
            "subject",
        )

        class_map = {}
        section_ids = set()

        for assignment in assignments:
            section_ids.add(assignment.section_id)
            key = assignment.section_id

            if key not in class_map:
                class_map[key] = {
                    "section_id": assignment.section_id,
                    "class": assignment.section.school_class.name,
                    "section": assignment.section.name,
                    "subjects": [],
                }

            class_map[key]["subjects"].append(assignment.subject.name)

        classes = list(class_map.values())
        active_classes = len(classes)

        students_count = (
            Student.objects.filter(
                section_id__in=section_ids,
                is_active=True,
            ).count()
            if section_ids
            else 0
        )

        pending_marks = (
            StudentMark.objects.filter(
                marks_obtained__isnull=True,
                student_exam__student__section_id__in=section_ids,
            ).count()
            if section_ids
            else 0
        )

        today = now().date()
        week_start = today - timedelta(days=6)

        sessions = AttendanceSession.objects.filter(
            teacher=teacher,
            date__range=(week_start, today),
            status=AttendanceSession.STATUS_SUBMITTED,
        )

        total_records = StudentAttendance.objects.filter(
            session__in=sessions
        ).count()

        present_records = StudentAttendance.objects.filter(
            session__in=sessions,
            is_present=True,
        ).count()

        avg_attendance = (
            round((present_records / total_records) * 100, 2)
            if total_records > 0
            else 0
        )

        today_sessions = AttendanceSession.objects.filter(
            teacher=teacher,
            date=today,
        ).select_related(
            "school_class",
            "section",
        )

        today_sessions_data = [
            {
                "id": session.id,
                "date": session.date,
                "class": session.school_class.name,
                "section": session.section.name,
                "status": session.status,
            }
            for session in today_sessions
        ]

        return Response(
            {
                "stats": {
                    "active_classes": active_classes,
                    "students_today": students_count,
                    "pending_marks": pending_marks,
                    "avg_attendance": avg_attendance,
                },
                "classes": classes,
                "today_sessions": today_sessions_data,
            }
        )
