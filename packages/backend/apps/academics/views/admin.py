from rest_framework import generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_school_admin
from apps.academics.models import SchoolClass, Section, Student, Teacher
from apps.multitenancy.utils import scope_queryset_to_tenant
from apps.academics.serializers import (
    SchoolClassCreateSerializer,
    SchoolClassDetailSerializer,
    SchoolClassListSerializer,
    SectionCreateSerializer,
    SectionDetailSerializer,
    SectionListSerializer,
    TeacherCreateSerializer,
    TeacherDetailSerializer,
    StudentCreateSerializer,
    TeacherListSerializer,
    StudentDetailSerializer,
    StudentListSerializer,
)


class SchoolAdminTenantMixin:
    def get_school(self, request):
        if not is_school_admin(request.user):
            raise PermissionDenied("Not allowed")
        school = request.user.school
        if not school or not school.tenant:
            raise PermissionDenied("School tenant is not configured.")
        return school

    def get_school_or_tenant_queryset(self, queryset):
        school = self.get_school(self.request)
        return scope_queryset_to_tenant(queryset, self.request.user).filter(tenant=school.tenant)


class TeacherListCreateAPI(SchoolAdminTenantMixin, generics.ListCreateAPIView):
    def get_queryset(self):
        return self.get_school_or_tenant_queryset(Teacher.objects.select_related("user").all()).order_by("id")

    def get_serializer_class(self):
        return TeacherListSerializer if self.request.method == "GET" else TeacherCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        teacher = serializer.save()
        return Response(TeacherListSerializer(teacher).data, status=status.HTTP_201_CREATED)


class TeacherDetailAPI(SchoolAdminTenantMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TeacherDetailSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        return self.get_school_or_tenant_queryset(Teacher.objects.select_related("user").all())

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context


class StudentListCreateAPI(SchoolAdminTenantMixin, generics.ListCreateAPIView):
    def get_queryset(self):
        queryset = Student.objects.select_related("school_class", "section")
        return self.get_school_or_tenant_queryset(queryset).order_by("id")

    def get_serializer_class(self):
        return StudentListSerializer if self.request.method == "GET" else StudentCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response(StudentListSerializer(student).data, status=status.HTTP_201_CREATED)


class StudentDetailAPI(SchoolAdminTenantMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentDetailSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        queryset = Student.objects.select_related("school_class", "section")
        return self.get_school_or_tenant_queryset(queryset)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context


class ClassListCreateAPI(SchoolAdminTenantMixin, generics.ListCreateAPIView):
    def get_queryset(self):
        queryset = SchoolClass.objects.select_related("academic_year")
        return self.get_school_or_tenant_queryset(queryset).order_by("order", "id")

    def get_serializer_class(self):
        return SchoolClassListSerializer if self.request.method == "GET" else SchoolClassCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        school_class = serializer.save()
        return Response(SchoolClassListSerializer(school_class).data, status=status.HTTP_201_CREATED)


class ClassDetailAPI(SchoolAdminTenantMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SchoolClassDetailSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        queryset = SchoolClass.objects.select_related("academic_year")
        return self.get_school_or_tenant_queryset(queryset)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context


class SectionListCreateAPI(SchoolAdminTenantMixin, generics.ListCreateAPIView):
    def get_queryset(self):
        school = self.get_school(self.request)
        queryset = Section.objects.select_related("school_class").filter(tenant=school.tenant)
        school_class_uuid = self.request.query_params.get("school_class_uuid")
        if school_class_uuid:
            queryset = queryset.filter(school_class__uuid=school_class_uuid)
        return queryset.order_by("school_class_id", "name", "id")

    def get_serializer_class(self):
        return SectionListSerializer if self.request.method == "GET" else SectionCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        section = serializer.save()
        return Response(SectionListSerializer(section).data, status=status.HTTP_201_CREATED)


class SectionDetailAPI(SchoolAdminTenantMixin, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SectionDetailSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_queryset(self):
        school = self.get_school(self.request)
        return Section.objects.select_related("school_class").filter(tenant=school.tenant)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context
