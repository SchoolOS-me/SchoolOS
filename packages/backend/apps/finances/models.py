from djstripe import models as djstripe_models
from django.conf import settings
from django.db import models

from common.models.base_model import BaseModel
from . import managers


class Product(djstripe_models.Product):
    class Meta:
        proxy = True

    objects = managers.ProductManager()


class Price(djstripe_models.Price):
    class Meta:
        proxy = True

    objects = managers.PriceManager()


class FeePayment(BaseModel):
    PAYMENT_MODE_CASH = "cash"
    PAYMENT_MODE_CHOICES = (
        (PAYMENT_MODE_CASH, "Cash"),
    )

    tenant = models.ForeignKey(
        "multitenancy.Tenant",
        on_delete=models.CASCADE,
        related_name="fee_payments",
    )
    student = models.ForeignKey(
        "academics.Student",
        on_delete=models.PROTECT,
        related_name="fee_payments",
    )
    receipt_number = models.CharField(max_length=40, unique=True)
    fee_title = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES, default=PAYMENT_MODE_CASH)
    paid_on = models.DateField()
    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="fee_payments_received",
    )
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-paid_on", "-id")

    def __str__(self):
        return f"{self.receipt_number} - {self.student}"
