from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from apps.academics.models import Student
from .models import FeePayment


def generate_receipt_number():
    today = timezone.localdate()
    prefix = f"FEE-{today:%Y%m%d}"
    last_payment = (
        FeePayment.objects.filter(receipt_number__startswith=prefix)
        .order_by("-receipt_number")
        .first()
    )
    if not last_payment:
        return f"{prefix}-0001"
    try:
        sequence = int(last_payment.receipt_number.rsplit("-", 1)[1]) + 1
    except (IndexError, ValueError):
        sequence = 1
    return f"{prefix}-{sequence:04d}"


class FeePaymentSerializer(serializers.ModelSerializer):
    student_uuid = serializers.UUIDField(source="student.uuid", read_only=True)
    student_name = serializers.CharField(source="student.full_name", read_only=True)
    admission_number = serializers.CharField(source="student.admission_number", read_only=True)
    class_name = serializers.CharField(source="student.school_class.name", read_only=True)
    section_name = serializers.CharField(source="student.section.name", read_only=True)
    received_by_email = serializers.EmailField(source="received_by.email", read_only=True, allow_null=True)

    class Meta:
        model = FeePayment
        fields = (
            "uuid",
            "receipt_number",
            "student_uuid",
            "student_name",
            "admission_number",
            "class_name",
            "section_name",
            "fee_title",
            "amount",
            "payment_mode",
            "paid_on",
            "received_by_email",
            "notes",
            "created_at",
        )


class FeePaymentCreateSerializer(serializers.Serializer):
    student_uuid = serializers.UUIDField()
    fee_title = serializers.CharField(max_length=120)
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal("0.01"))
    payment_mode = serializers.ChoiceField(choices=FeePayment.PAYMENT_MODE_CHOICES, default=FeePayment.PAYMENT_MODE_CASH)
    paid_on = serializers.DateField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_student_uuid(self, value):
        school = self.context["school"]
        student = (
            Student.objects.select_related("school_class", "section")
            .filter(uuid=value, tenant=school.tenant)
            .first()
        )
        if student is None:
            raise serializers.ValidationError("Student not found in your school.")
        return student

    def validate_payment_mode(self, value):
        if value != FeePayment.PAYMENT_MODE_CASH:
            raise serializers.ValidationError("Only cash payments are enabled right now.")
        return value

    def create(self, validated_data):
        school = self.context["school"]
        request = self.context.get("request")
        student = validated_data["student_uuid"]
        with transaction.atomic():
            return FeePayment.objects.create(
                tenant=school.tenant,
                student=student,
                receipt_number=generate_receipt_number(),
                fee_title=validated_data["fee_title"],
                amount=validated_data["amount"],
                payment_mode=validated_data["payment_mode"],
                paid_on=validated_data.get("paid_on") or timezone.localdate(),
                received_by=request.user if request and request.user.is_authenticated else None,
                notes=validated_data.get("notes", ""),
            )
