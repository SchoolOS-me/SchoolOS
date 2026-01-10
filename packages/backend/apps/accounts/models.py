from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser

from .managers import UserManager
from .constants import UserRole
from django.core.exceptions import ValidationError


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)

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

    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    

    def clean(self):
        if self.role == UserRole.SUPER_ADMIN and self.school is not None:
            raise ValidationError("SUPER_ADMIN cannot be associated with a school")

        if self.role != UserRole.SUPER_ADMIN and self.school is None:
            raise ValidationError("Non-super users must be associated with a school")
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

