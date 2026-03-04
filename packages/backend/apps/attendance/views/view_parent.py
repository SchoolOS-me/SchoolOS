from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_parent
from apps.academics.permissions import parent_can_access_student
from apps.academics.models import Student
from apps.attendance.sevices.reports import get_student_attendance_summary


class ParentAttendanceAPI(APIView):

    def get(self, request):
        if not is_parent(request.user):
            return Response({"detail": "Not allowed"}, status=403)

        student_uuid = request.query_params.get("student_uuid")
        start_date = request.query_params.get("start_date")
        end_date = request.query_params.get("end_date")

        if not student_uuid:
            return Response({"detail": "student_uuid is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not parent_can_access_student(request.user, student_uuid):
            return Response({"detail": "Not allowed"}, status=403)

        try:
            student = Student.objects.get(uuid=student_uuid)
        except Student.DoesNotExist:
            return Response({"detail": "Student not found"}, status=status.HTTP_404_NOT_FOUND)
        summary = get_student_attendance_summary(
            student=student,
            start_date=start_date,
            end_date=end_date,
        )

        return Response(summary)
