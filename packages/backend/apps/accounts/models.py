from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser

from common.models.base_model import BaseModel
from .managers import UserManager
from .constants import UserRole
from django.core.exceptions import ValidationError


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True, null=True, blank=True)
    phone_number = models.CharField(max_length=30, unique=True, null=True, blank=True)

    role = models.CharField(
        max_length=20,
        choices=UserRole.choices
    )

    school = models.ForeignKey(
        "schools.School",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="users"
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email or self.phone_number or str(self.uuid)
    
    

    def clean(self):
        self.email = self.email or None
        self.phone_number = self.phone_number or None

        if not self.email and not self.phone_number:
            raise ValidationError("User must have either an email or a phone number")

        if self.role == UserRole.SUPER_ADMIN and self.school is not None:
            raise ValidationError("SUPER_ADMIN cannot be associated with a school")

        if self.role != UserRole.SUPER_ADMIN and self.school is None:
            raise ValidationError("Non-super users must be associated with a school")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
