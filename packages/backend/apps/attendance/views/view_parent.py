from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_parent
from apps.academics.permissions import parent_can_access_student
from apps.attendance.sevices.reports import get_student_attendance_summary


class ParentAttendanceAPI(APIView):

    def get(self, request):
        if not is_parent(request.user):
            return Response({"detail": "Not allowed"}, status=403)

        student_id = request.query_params.get("student")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not parent_can_access_student(request.user, student_id):
            return Response({"detail": "Not allowed"}, status=403)

        summary = get_student_attendance_summary(
            student_id=student_id,
            start_date=start_date,
            end_date=end_date,
        )

        return Response(summary)
