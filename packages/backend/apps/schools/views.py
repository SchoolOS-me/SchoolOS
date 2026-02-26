from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.constants import UserRole
from apps.accounts.permissions import is_super_admin
from apps.finances.services import subscriptions
from apps.finances.models import Price
from apps.multitenancy.constants import TenantType
from apps.multitenancy.models import Tenant
from .models import School
from .serializers import (
    SchoolAdminCreateSerializer,
    SchoolCreateSerializer,
    SchoolSerializer,
    SchoolSubscriptionAssignSerializer,
)


def _auth_bypass_enabled():
    permission_classes = settings.REST_FRAMEWORK.get("DEFAULT_PERMISSION_CLASSES", ())
    return "rest_framework.permissions.AllowAny" in permission_classes


def _is_super_admin_or_open(user):
    return _auth_bypass_enabled() or is_super_admin(user)


def _resolve_tenant_creator(request):
    if request.user and request.user.is_authenticated:
        return request.user

    user_model = get_user_model()
    creator = user_model.objects.filter(role=UserRole.SUPER_ADMIN).order_by("id").first()
    if creator:
        return creator
    return user_model.objects.order_by("id").first()


class SchoolListCreateAPI(APIView):

    def get(self, request):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        schools = School.objects.all().order_by("-created_at")
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        serializer = SchoolCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        creator = _resolve_tenant_creator(request)
        if creator is None:
            return Response(
                {"detail": "Create at least one user (preferably SUPER_ADMIN) before creating schools."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            contact_email = serializer.validated_data.get("contact_email") or getattr(creator, "email", "")
            tenant = Tenant.objects.create(
                creator=creator,
                name=serializer.validated_data["name"],
                type=TenantType.ORGANIZATION,
                billing_email=contact_email,
            )
            school = serializer.save(tenant=tenant)

        return Response(SchoolSerializer(school).data, status=status.HTTP_201_CREATED)


class SchoolDetailAPI(APIView):

    def get(self, request, school_id):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        return Response(SchoolSerializer(school).data)

    def patch(self, request, school_id):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        serializer = SchoolCreateSerializer(school, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        school = serializer.save()
        return Response(SchoolSerializer(school).data)


class SchoolAdminCreateAPI(APIView):
    def post(self, request, school_id):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        serializer = SchoolAdminCreateSerializer(data=request.data, context={"school": school})
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        return Response(
            {"id": user.id, "email": user.email, "role": user.role, "school_id": school.id},
            status=status.HTTP_201_CREATED,
        )


class SchoolSubscriptionAssignAPI(APIView):
    def post(self, request, school_id):
        if not _is_super_admin_or_open(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        if not school.tenant:
            return Response({"detail": "School tenant is not configured."}, status=status.HTTP_400_BAD_REQUEST)

        serializer = SchoolSubscriptionAssignSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        plan_config = serializer.get_plan_config()
        price = Price.objects.get_by_plan(plan_config)
        if not price:
            return Response(
                {"detail": "Subscription plan is not initialized."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        schedule = subscriptions.get_schedule(tenant=school.tenant)
        if schedule:
            current_phase = subscriptions.get_current_schedule_phase(schedule)
            current_phase["end_date"] = "now"
            next_phase = {"items": [{"price": price.id}]}
            schedule = subscriptions.update_schedule(
                schedule,
                phases=[current_phase, next_phase],
            )
        else:
            schedule = subscriptions.create_schedule(
                tenant=school.tenant,
                price=price,
            )

        return Response(
            {
                "detail": "Subscription updated.",
                "schedule_id": schedule.id,
                "plan": plan_config.name,
            }
        )
