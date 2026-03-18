from datetime import date

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from apps.accounts.constants import UserRole
from .models import AcademicYear, ParentStudent, SchoolClass, Section, Student, Teacher

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
    student_email = serializers.EmailField(required=False, allow_blank=True)
    student_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    student_password = serializers.CharField(min_length=8, required=False, allow_blank=True, write_only=True)
    guardian_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    guardian_email = serializers.EmailField(required=False, allow_blank=True)
    guardian_phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    guardian_password = serializers.CharField(min_length=8, required=False, allow_blank=True, write_only=True)
    school_class_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=SchoolClass.objects.all(),
        source="school_class",
    )
    section_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=Section.objects.all(),
        source="section",
    )

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs["school_class"]
        section = attrs["section"]
        student_email = (attrs.get("student_email") or "").strip().lower()
        student_phone = (attrs.get("student_phone") or "").strip()
        student_password = attrs.get("student_password") or ""
        guardian_email = (attrs.get("guardian_email") or "").strip().lower()
        guardian_phone = (attrs.get("guardian_phone") or "").strip()
        guardian_password = attrs.get("guardian_password") or ""

        if school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_uuid": "Class does not belong to your school."})
        if section.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"section_uuid": "Section does not belong to your school."})
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({"section_uuid": "Section does not belong to selected class."})

        if student_password and not (student_email or student_phone):
            raise serializers.ValidationError({"student_password": "Student email or phone number is required."})
        if (student_email or student_phone) and not student_password:
            raise serializers.ValidationError({"student_password": "Student portal password is required."})

        if guardian_password and not (guardian_email or guardian_phone):
            raise serializers.ValidationError({"guardian_password": "Guardian email or phone number is required."})
        if (guardian_email or guardian_phone) and not guardian_password:
            raise serializers.ValidationError({"guardian_password": "Guardian portal password is required."})

        if student_email and User.objects.filter(email__iexact=student_email).exists():
            raise serializers.ValidationError({"student_email": "Email already exists."})
        if student_phone and User.objects.filter(phone_number=student_phone).exists():
            raise serializers.ValidationError({"student_phone": "Phone number already exists."})

        existing_parent = None
        if guardian_email:
            existing_parent = User.objects.filter(email__iexact=guardian_email).first()
        elif guardian_phone:
            existing_parent = User.objects.filter(phone_number=guardian_phone).first()

        if existing_parent and existing_parent.role != UserRole.PARENT:
            raise serializers.ValidationError({"guardian_email": "This email or phone belongs to a non-parent user."})
        if existing_parent and existing_parent.school_id != school.id:
            raise serializers.ValidationError({"guardian_email": "This parent belongs to another school."})
        if guardian_email and not existing_parent and User.objects.filter(email__iexact=guardian_email).exists():
            raise serializers.ValidationError({"guardian_email": "Email already exists."})
        if guardian_phone and not existing_parent and User.objects.filter(phone_number=guardian_phone).exists():
            raise serializers.ValidationError({"guardian_phone": "Phone number already exists."})

        attrs["student_email"] = student_email
        attrs["student_phone"] = student_phone
        attrs["guardian_email"] = guardian_email
        attrs["guardian_phone"] = guardian_phone
        attrs["existing_parent"] = existing_parent
        return attrs

    def create(self, validated_data):
        school = self.context["school"]
        student_email = validated_data.pop("student_email", "")
        student_phone = validated_data.pop("student_phone", "")
        student_password = validated_data.pop("student_password", "")
        validated_data.pop("guardian_name", "")
        guardian_email = validated_data.pop("guardian_email", "")
        guardian_phone = validated_data.pop("guardian_phone", "")
        guardian_password = validated_data.pop("guardian_password", "")
        existing_parent = validated_data.pop("existing_parent", None)

        with transaction.atomic():
            student_user = None
            if student_email or student_phone:
                student_user = User.objects.create_user(
                    email=student_email or None,
                    phone_number=student_phone or None,
                    password=student_password,
                    role=UserRole.STUDENT,
                    school=school,
                )

            student = Student.objects.create(
                tenant=school.tenant,
                user=student_user,
                admission_number=validated_data["admission_number"],
                full_name=validated_data["full_name"],
                parent_contact=validated_data.get("parent_contact", ""),
                school_class=validated_data["school_class"],
                section=validated_data["section"],
            )

            parent_user = existing_parent
            if not parent_user and (guardian_email or guardian_phone):
                parent_user = User.objects.create_user(
                    email=guardian_email or None,
                    phone_number=guardian_phone or None,
                    password=guardian_password,
                    role=UserRole.PARENT,
                    school=school,
                )

            if parent_user:
                ParentStudent.objects.get_or_create(
                    tenant=school.tenant,
                    parent=parent_user,
                    student=student,
                )

            return student


class SchoolClassCreateSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)
    order = serializers.IntegerField(min_value=0)
    academic_year_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=AcademicYear.objects.all(),
        source="academic_year",
        required=False,
        allow_null=True,
    )

    def validate(self, attrs):
        school = self.context["school"]
        academic_year = attrs.get("academic_year")
        if academic_year and academic_year.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"academic_year_uuid": "Academic year does not belong to your school."})
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
    school_class_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=SchoolClass.objects.all(),
        source="school_class",
    )
    name = serializers.CharField(max_length=10)

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs["school_class"]
        if school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_uuid": "Class does not belong to your school."})
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
    uuid = serializers.UUIDField(read_only=True)

    class Meta:
        model = Teacher
        fields = ["uuid", "full_name", "employee_id", "is_active", "email"]


class StudentListSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source="school_class.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True)
    school_class_uuid = serializers.UUIDField(source="school_class.uuid", read_only=True)
    section_uuid = serializers.UUIDField(source="section.uuid", read_only=True)

    class Meta:
        model = Student
        fields = [
            "uuid",
            "full_name",
            "admission_number",
            "is_active",
            "class_name",
            "section_name",
            "school_class_uuid",
            "section_uuid",
        ]


class SchoolClassListSerializer(serializers.ModelSerializer):
    academic_year = serializers.CharField(source="academic_year.name", read_only=True)
    academic_year_uuid = serializers.UUIDField(source="academic_year.uuid", read_only=True)

    class Meta:
        model = SchoolClass
        fields = ["uuid", "name", "order", "academic_year", "academic_year_uuid"]


class SectionListSerializer(serializers.ModelSerializer):
    school_class_uuid = serializers.UUIDField(source="school_class.uuid", read_only=True)

    class Meta:
        model = Section
        fields = ["uuid", "name", "school_class_uuid"]


class TeacherDetailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email")
    uuid = serializers.UUIDField(read_only=True)

    class Meta:
        model = Teacher
        fields = ["uuid", "full_name", "employee_id", "is_active", "email"]

    def validate_email(self, value):
        teacher = self.instance
        if User.objects.filter(email__iexact=value).exclude(id=teacher.user_id).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        email = user_data.get("email")
        if email and instance.user.email != email:
            instance.user.email = email
            instance.user.save(update_fields=["email"])

        return instance


class StudentDetailSerializer(serializers.ModelSerializer):
    school_class_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=SchoolClass.objects.all(),
        source="school_class",
    )
    section_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=Section.objects.all(),
        source="section",
    )
    class_name = serializers.CharField(source="school_class.name", read_only=True)
    section_name = serializers.CharField(source="section.name", read_only=True)

    class Meta:
        model = Student
        fields = [
            "uuid",
            "full_name",
            "admission_number",
            "parent_contact",
            "is_active",
            "school_class_uuid",
            "section_uuid",
            "class_name",
            "section_name",
        ]

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs.get("school_class") or self.instance.school_class
        section = attrs.get("section") or self.instance.section

        if school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_uuid": "Class does not belong to your school."})
        if section.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"section_uuid": "Section does not belong to your school."})
        if section.school_class_id != school_class.id:
            raise serializers.ValidationError({"section_uuid": "Section does not belong to selected class."})
        return attrs


class SchoolClassDetailSerializer(serializers.ModelSerializer):
    academic_year_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=AcademicYear.objects.all(),
        source="academic_year",
        required=False,
    )
    academic_year = serializers.CharField(source="academic_year.name", read_only=True)

    class Meta:
        model = SchoolClass
        fields = ["uuid", "name", "order", "academic_year_uuid", "academic_year"]

    def validate(self, attrs):
        school = self.context["school"]
        academic_year = attrs.get("academic_year")
        if academic_year and academic_year.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"academic_year_uuid": "Academic year does not belong to your school."})
        return attrs


class SectionDetailSerializer(serializers.ModelSerializer):
    school_class_uuid = serializers.SlugRelatedField(
        slug_field="uuid",
        queryset=SchoolClass.objects.all(),
        source="school_class",
        required=False,
    )

    class Meta:
        model = Section
        fields = ["uuid", "name", "school_class_uuid"]

    def validate(self, attrs):
        school = self.context["school"]
        school_class = attrs.get("school_class")
        if school_class and school_class.tenant_id != school.tenant_id:
            raise serializers.ValidationError({"school_class_uuid": "Class does not belong to your school."})
        return attrs
