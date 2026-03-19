from datetime import timedelta

from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_parent
from apps.academics.models import ParentStudent, StudentResult
from apps.attendance.models import StudentAttendance


class ParentDashboardAPI(APIView):

    def get(self, request):
        if not is_parent(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        links = ParentStudent.objects.filter(
            parent=request.user
        ).select_related(
            "student",
            "student__school_class",
            "student__section",
        )

        today = now().date()
        start_date = today - timedelta(days=29)

        children_data = []
        attendance_percentages = []
        latest_percentages = []
        alerts = []
        latest_message = None
        latest_message_at = None

        for link in links:
            student = link.student

            attendance_qs = StudentAttendance.objects.filter(
                student=student,
                session__date__range=(start_date, today),
            )
            total = attendance_qs.count()
            present = attendance_qs.filter(is_present=True).count()
            attendance_pct = round((present / total) * 100, 2) if total > 0 else 0
            attendance_percentages.append(attendance_pct)

            latest_result = StudentResult.objects.filter(
                student_exam__student=student,
                student_exam__exam__is_published=True,
            ).select_related(
                "student_exam",
                "student_exam__exam",
            ).order_by("-generated_at").first()

            latest_percentage = latest_result.percentage if latest_result else None
            if latest_percentage is not None:
                latest_percentages.append(latest_percentage)

            if latest_result and (
                latest_message_at is None or latest_result.generated_at > latest_message_at
            ):
                latest_message_at = latest_result.generated_at
                latest_message = {
                    "sender": latest_result.student_exam.exam.name,
                    "message": (
                        f"{student.full_name}'s latest published result is "
                        f"{latest_result.percentage:.2f}%."
                    ),
                }

            if attendance_pct < 90:
                alerts.append(
                    {
                        "student_id": student.id,
                        "student_uuid": str(student.uuid),
                        "name": student.full_name,
                        "attendance_percentage": attendance_pct,
                    }
                )

            children_data.append(
                {
                    "id": student.id,
                    "student_uuid": str(student.uuid),
                    "name": student.full_name,
                    "class": student.school_class.name,
                    "section": student.section.name,
                    "attendance_percentage": attendance_pct,
                    "latest_percentage": latest_percentage,
                }
            )

        avg_attendance = (
            round(sum(attendance_percentages) / len(attendance_percentages), 2)
            if attendance_percentages
            else 0
        )

        current_average = (
            round(sum(latest_percentages) / len(latest_percentages), 2)
            if latest_percentages
            else None
        )

        return Response(
            {
                "stats": {
                    "current_average": current_average,
                    "attendance_percentage": avg_attendance,
                    "alerts": len(alerts),
                },
                "fee_status": {"total": 0, "items": []},
                "message": latest_message,
                "attendance": {
                    "value": avg_attendance,
                    "title": "Average Attendance",
                    "detail": f"{len(alerts)} alerts",
                },
                "alerts": alerts,
                "children": children_data,
            }
        )
