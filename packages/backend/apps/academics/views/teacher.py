from rest_framework.views import APIView
from rest_framework.response import Response
from apps.accounts.permissions import is_teacher
from apps.academics.models import TeachingAssignment


class TeacherClassesAPI(APIView):

    def get(self, request):
        if not is_teacher(request.user):
            raise PermissionError("Not a teacher")

        assignments = TeachingAssignment.objects.filter(
            teacher__user=request.user
        ).select_related(
            "section",
            "section__school_class",
            "subject",
        )

        data = {}

        for a in assignments:
            key = str(a.section.id)

            if key not in data:
                data[key] = {
                    "class": a.section.school_class.name,
                    "section": a.section.name,
                    "subjects": [],
                }

            data[key]["subjects"].append(a.subject.name)

        return Response(list(data.values()))
