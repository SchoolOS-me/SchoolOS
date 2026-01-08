from django.db import models
from apps.multitenancy.models import Tenant


class SchoolClass(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="school_classes"
    )
    name = models.CharField(max_length=50)   # Class 1, Class 10
    order = models.PositiveIntegerField()    # Used for sorting

    class Meta:
        unique_together = ("tenant", "name")
        ordering = ("order",)

    def __str__(self):
        return self.name


class Section(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="sections"
    )
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="sections"
    )
    name = models.CharField(max_length=10)  # A, B, C

    class Meta:
        unique_together = ("school_class", "name")

    def __str__(self):
        return f"{self.school_class.name} - {self.name}"
    
class School(models.Model):
    tenant = models.OneToOneField(
        Tenant,
        on_delete=models.CASCADE,
        related_name="school"
    )
    name = models.CharField(max_length=255)
    board = models.CharField(max_length=100, blank=True)
    medium = models.CharField(max_length=50, blank=True)
    established_year = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return self.name

class AcademicYear(models.Model):
    school = models.ForeignKey(
        "academics.School",
        on_delete=models.CASCADE,
        related_name="academic_years"
    )
    name = models.CharField(max_length=20)  # e.g. 2024-25
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ("school", "name")

    def __str__(self):
        return f"{self.school.name} ({self.name})"

class Grade(models.Model):
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name="grades"
    )
    name = models.CharField(max_length=50)   # e.g. Class 1, KG, XII
    order = models.PositiveIntegerField()    # for sorting

    class Meta:
        unique_together = ("academic_year", "name")
        ordering = ["order"]

    def __str__(self):
        return self.name

class Subject(models.Model):
    school = models.ForeignKey(
        "academics.School",
        on_delete=models.CASCADE,
        related_name="subjects"
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True)

    class Meta:
        unique_together = ("school", "name")

    def __str__(self):
        return self.name


class SectionSubject(models.Model):
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="section_subjects"
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE
    )

    class Meta:
        unique_together = ("section", "subject")
