from datetime import date

from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.constants import UserRole
from .models import AcademicYear, SchoolClass, Section, Student, Teacher

User = get_user_model()


def _current_academic_year_label():
    today = date.today()
    start_year = today.year
    end_year = today.year + 1
    return f"{start_year}-{str(end_year)[-2:]}"


class TeacherCreateSerializer(serializers.Serializer):
    employee_id = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        school = self.context["school"]
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role=UserRole.TEACHER,
            school=school,
        )
        return Teacher.objects.create(
            tenant=school.tenant,
            user=user,
            employee_id=validated_data["employee_id"],
            full_name=validated_data["full_name"],
        )


class StudentCreateSerializer(serializers.Serializer):
    admission_number = serializers.CharField(max_length=50)
    full_name = serializers.CharField(max_length=255)
    parent_contact = serializers.CharField(max_length=30, required=False, allow_blank=True)
    school_class_id = serializers.PrimaryKeyRelatedField(
        queryset=SchoolClass.objects.all(), source="school_class"
    )
    section_id = serializers.PrimaryKeyRelatedField(queryset=Section.objects.all(), source="section")

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs["school_class"]
        section = attrs["section"]

        if school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_id": "Class does not belong to your school."})
        if section.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"section_id": "Section does not belong to your school."})
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({"section_id": "Section does not belong to selected class."})
        return attrs

    def create(self, validated_data):
        school = self.context["school"]
        return Student.objects.create(
            tenant=school.tenant,
            admission_number=validated_data["admission_number"],
            full_name=validated_data["full_name"],
            parent_contact=validated_data.get("parent_contact", ""),
            school_class=validated_data["school_class"],
            section=validated_data["section"],
        )


class SchoolClassCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    order = serializers.IntegerField(min_value=0)
    academic_year_id = serializers.PrimaryKeyRelatedField(
        queryset=AcademicYear.objects.all(), source="academic_year", required=False, allow_null=True
    )

    def validate(self, attrs):
        school = self.context["school"]
        academic_year = attrs.get("academic_year")
        if academic_year and academic_year.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"academic_year_id": "Academic year does not belong to your school."})
        return attrs

    def create(self, validated_data):
        school = self.context["school"]
        academic_year = validated_data.get("academic_year")
        if academic_year is None:
            academic_year = AcademicYear.objects.filter(tenant=school.tenant, is_active=True).first()
            if academic_year is None:
                academic_year = AcademicYear.objects.create(
                    tenant=school.tenant,
                    name=_current_academic_year_label(),
                    start_date=date(date.today().year, 1, 1),
                    end_date=date(date.today().year, 12, 31),
                    is_active=True,
                )
        return SchoolClass.objects.create(
            tenant=school.tenant,
            academic_year=academic_year,
            name=validated_data["name"],
            order=validated_data["order"],
        )


class SectionCreateSerializer(serializers.Serializer):
    school_class_id = serializers.PrimaryKeyRelatedField(
        queryset=SchoolClass.objects.all(), source="school_class"
    )
    name = serializers.CharField(max_length=10)

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs["school_class"]
        if school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_id": "Class does not belong to your school."})
        return attrs

    def create(self, validated_data):
        school = self.context["school"]
        return Section.objects.create(
            tenant=school.tenant,
            school_class=validated_data["school_class"],
            name=validated_data["name"],
        )


class TeacherListSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Teacher
        fields = ["id", "full_name", "employee_id", "is_active", "email"]


class StudentListSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source="school_class.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True)

    class Meta:
        model = Student
        fields = [
            "id",
            "full_name",
            "admission_number",
            "is_active",
            "class_name",
            "section_name",
        ]


class SchoolClassListSerializer(serializers.ModelSerializer):
    academic_year = serializers.CharField(source="academic_year.name", read_only=True)

    class Meta:
        model = SchoolClass
        fields = ["id", "name", "order", "academic_year"]


class SectionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ["id", "name", "school_class_id"]
