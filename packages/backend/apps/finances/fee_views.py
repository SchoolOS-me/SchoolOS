from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import is_school_admin
from .fee_serializers import FeePaymentCreateSerializer, FeePaymentSerializer
from .models import FeePayment


class SchoolAdminFinanceMixin:
    def get_school(self, request):
        if not is_school_admin(request.user):
            raise PermissionDenied("Not allowed")
        school = request.user.school
        if not school or not school.tenant:
            raise PermissionDenied("School tenant is not configured.")
        return school

    def get_queryset(self):
        school = self.get_school(self.request)
        return (
            FeePayment.objects.select_related(
                "student",
                "student__school_class",
                "student__section",
                "received_by",
            )
            .filter(tenant=school.tenant)
            .order_by("-paid_on", "-id")
        )


class FeePaymentListCreateAPI(SchoolAdminFinanceMixin, generics.ListCreateAPIView):
    def get_serializer_class(self):
        return FeePaymentSerializer if self.request.method == "GET" else FeePaymentCreateSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["school"] = self.get_school(self.request)
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        payment = serializer.save()
        return Response(FeePaymentSerializer(payment).data, status=status.HTTP_201_CREATED)


class FeePaymentDetailAPI(SchoolAdminFinanceMixin, generics.RetrieveAPIView):
    serializer_class = FeePaymentSerializer
    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"


class FeeReportAPI(SchoolAdminFinanceMixin, APIView):
    def get(self, request):
        school = self.get_school(request)
        payments = FeePayment.objects.filter(tenant=school.tenant)
        total = payments.aggregate(total=Sum("amount"))["total"] or 0
        latest = (
            payments.select_related("student", "student__school_class", "student__section", "received_by")
            .order_by("-paid_on", "-id")[:8]
        )
        return Response(
            {
                "total_collected": total,
                "payment_count": payments.count(),
                "cash_collected": total,
                "latest_payments": FeePaymentSerializer(latest, many=True).data,
            }
        )
