from django.db import models


class UserRole(models.TextChoices):
    SUPER_ADMIN = "SUPER_ADMIN", "Super Admin"
    SCHOOL_ADMIN = "SCHOOL_ADMIN", "School Admin"
    TEACHER = "TEACHER", "Teacher"
    STUDENT = "STUDENT", "Student"
    PARENT = "PARENT", "Parent"
