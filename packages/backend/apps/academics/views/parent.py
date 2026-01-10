from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_parent
from apps.academics.models import ParentStudent


class ParentChildrenAPI(APIView):

    def get(self, request):
        if not is_parent(request.user):
            return Response(
                {"detail": "Not a parent"},
                status=status.HTTP_403_FORBIDDEN,
            )

        links = ParentStudent.objects.filter(
            parent=request.user
        ).select_related(
            "student",
            "student__school_class",
            "student__section",
        )

        data = [
            {
                "student_id": l.student.id,
                "name": l.student.full_name,
                "class": l.student.school_class.name,
                "section": l.student.section.name,
            }
            for l in links
        ]

        return Response(data)
