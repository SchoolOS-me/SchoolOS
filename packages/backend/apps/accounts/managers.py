from django.contrib.auth.base_user import BaseUserManager


class UserManager(BaseUserManager):
    def create_user(self, email=None, password=None, **extra_fields):
        phone_number = extra_fields.get("phone_number")
        if not email and not phone_number:
            raise ValueError("Email or phone number is required")

        email = self.normalize_email(email) if email else None
        if phone_number == "":
            extra_fields["phone_number"] = None
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "SUPER_ADMIN")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("role") != "SUPER_ADMIN":
            raise ValueError("Superuser must have role SUPER_ADMIN")

        return self.create_user(email, password, **extra_fields)
