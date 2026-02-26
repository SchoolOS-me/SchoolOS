from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import is_school_admin
from apps.academics.models import Teacher, Student
from apps.multitenancy.utils import scope_queryset_to_tenant
from apps.academics.serializers import (
    TeacherCreateSerializer,
    StudentCreateSerializer,
    SchoolClassCreateSerializer,
    SectionCreateSerializer,
    TeacherListSerializer,
    StudentListSerializer,
    SchoolClassListSerializer,
    SectionListSerializer,
)


class SchoolAdminBaseAPI(APIView):
    def get_school(self, request):
        if not is_school_admin(request.user):
            return None, Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        school = request.user.school
        if not school or not school.tenant:
            return None, Response({"detail": "School tenant is not configured."}, status=status.HTTP_400_BAD_REQUEST)
        return school, None


class TeacherCreateAPI(SchoolAdminBaseAPI):
    def post(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        serializer = TeacherCreateSerializer(data=request.data, context={"school": school})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        teacher = serializer.save()
        return Response(TeacherListSerializer(teacher).data, status=status.HTTP_201_CREATED)


class StudentCreateAPI(SchoolAdminBaseAPI):
    def post(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        serializer = StudentCreateSerializer(data=request.data, context={"school": school})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        student = serializer.save()
        return Response(StudentListSerializer(student).data, status=status.HTTP_201_CREATED)


class ClassCreateAPI(SchoolAdminBaseAPI):
    def post(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        serializer = SchoolClassCreateSerializer(data=request.data, context={"school": school})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        school_class = serializer.save()
        return Response(
            {"id": school_class.id, "name": school_class.name, "order": school_class.order},
            status=status.HTTP_201_CREATED,
        )


class SectionCreateAPI(SchoolAdminBaseAPI):
    def post(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        serializer = SectionCreateSerializer(data=request.data, context={"school": school})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        section = serializer.save()
        return Response({"id": section.id, "name": section.name}, status=status.HTTP_201_CREATED)


class TeacherListAPI(SchoolAdminBaseAPI):
    def get(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        qs = Teacher.objects.all()
        qs = scope_queryset_to_tenant(qs, request.user)
        data = TeacherListSerializer(qs, many=True).data
        return Response(data)


class StudentListAPI(SchoolAdminBaseAPI):
    def get(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        qs = Student.objects.select_related("school_class", "section")
        qs = scope_queryset_to_tenant(qs, request.user)
        data = StudentListSerializer(qs, many=True).data
        return Response(data)


class ClassListAPI(SchoolAdminBaseAPI):
    def get(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        qs = scope_queryset_to_tenant(school.tenant.school_classes.all(), request.user)
        data = SchoolClassListSerializer(qs, many=True).data
        return Response(data)


class SectionListAPI(SchoolAdminBaseAPI):
    def get(self, request):
        school, error = self.get_school(request)
        if error:
            return error

        school_class_id = request.query_params.get("school_class_id")
        qs = school.tenant.sections.all()
        if school_class_id:
            qs = qs.filter(school_class_id=school_class_id)
        data = SectionListSerializer(qs, many=True).data
        return Response(data)
