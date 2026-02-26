from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.accounts.constants import UserRole
from apps.finances import constants as finance_constants
from .models import School

User = get_user_model()


class SchoolSerializer(serializers.ModelSerializer):
    admin_email = serializers.SerializerMethodField()

    class Meta:
        model = School
        fields = [
            "id",
            "name",
            "code",
            "contact_email",
            "contact_phone",
            "address",
            "is_active",
            "created_at",
            "admin_email",
        ]
        read_only_fields = ["id", "created_at", "admin_email"]

    def get_admin_email(self, obj):
        admin = obj.users.filter(role=UserRole.SCHOOL_ADMIN).order_by("created_at").first()
        return admin.email if admin else None


class SchoolCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = School
        fields = ["name", "code", "contact_email", "contact_phone", "address"]


class SchoolAdminCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=8, write_only=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        school = self.context["school"]
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            role=UserRole.SCHOOL_ADMIN,
            school=school,
        )


class SchoolSubscriptionAssignSerializer(serializers.Serializer):
    plan = serializers.ChoiceField(
        choices=[
            ("free", "Free"),
            ("monthly", "Monthly"),
            ("yearly", "Yearly"),
            (finance_constants.FREE_PLAN.name, finance_constants.FREE_PLAN.name),
            (finance_constants.MONTHLY_PLAN.name, finance_constants.MONTHLY_PLAN.name),
            (finance_constants.YEARLY_PLAN.name, finance_constants.YEARLY_PLAN.name),
        ]
    )

    def get_plan_config(self):
        plan = self.validated_data["plan"]
        mapping = {
            "free": finance_constants.FREE_PLAN,
            "monthly": finance_constants.MONTHLY_PLAN,
            "yearly": finance_constants.YEARLY_PLAN,
            finance_constants.FREE_PLAN.name: finance_constants.FREE_PLAN,
            finance_constants.MONTHLY_PLAN.name: finance_constants.MONTHLY_PLAN,
            finance_constants.YEARLY_PLAN.name: finance_constants.YEARLY_PLAN,
        }
        return mapping[plan]
