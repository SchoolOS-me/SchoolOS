from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_parent
from apps.academics.permissions import parent_can_access_student
from apps.academics.models import StudentExam
from apps.academics.services.report_card import generate_report_card


class ParentResultsAPI(APIView):

    def get(self, request):
        if not is_parent(request.user):
            return Response({"detail": "Not allowed"}, status=403)

        student_uuid = request.query_params.get("student_uuid")

        if not student_uuid:
            return Response({"detail": "student_uuid is required"}, status=status.HTTP_400_BAD_REQUEST)

        if not parent_can_access_student(request.user, student_uuid):
            return Response({"detail": "Not allowed"}, status=403)

        exams = StudentExam.objects.filter(
            student__uuid=student_uuid,
            exam__is_published=True,
        ).select_related("exam")

        data = [
            generate_report_card(se)
            for se in exams
        ]

        return Response(data)
