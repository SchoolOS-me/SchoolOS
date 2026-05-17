from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("academics", "0008_parentstudent"),
        ("finances", "0001_initial"),
        ("multitenancy", "0004_tenant_features"),
    ]

    operations = [
        migrations.CreateModel(
            name="FeePayment",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("uuid", models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, unique=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("receipt_number", models.CharField(max_length=40, unique=True)),
                ("fee_title", models.CharField(max_length=120)),
                ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("payment_mode", models.CharField(choices=[("cash", "Cash")], default="cash", max_length=20)),
                ("paid_on", models.DateField()),
                ("notes", models.TextField(blank=True)),
                (
                    "received_by",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="fee_payments_received",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="fee_payments",
                        to="academics.student",
                    ),
                ),
                (
                    "tenant",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="fee_payments",
                        to="multitenancy.tenant",
                    ),
                ),
            ],
            options={
                "ordering": ("-paid_on", "-id"),
            },
        ),
    ]
