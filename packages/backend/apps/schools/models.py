from django.db import models
from apps.multitenancy.models import Tenant
from common.models.base_model import BaseModel
from common.storages import UniqueFilePathGenerator


class School(BaseModel):
    THEME_MODE_LIGHT = "light"
    THEME_MODE_DARK = "dark"
    THEME_MODE_SYSTEM = "system"
    THEME_MODE_CHOICES = [
        (THEME_MODE_LIGHT, "Light"),
        (THEME_MODE_DARK, "Dark"),
        (THEME_MODE_SYSTEM, "System"),
    ]

    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="schools",
    )
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    contact_email = models.EmailField(blank=True)
    contact_phone = models.CharField(max_length=30, blank=True)
    address = models.TextField(blank=True)
    logo = models.ImageField(upload_to=UniqueFilePathGenerator("schools/logos"), null=True, blank=True)
    theme_mode = models.CharField(max_length=16, choices=THEME_MODE_CHOICES, default=THEME_MODE_SYSTEM)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
