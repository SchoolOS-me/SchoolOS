from django.db import models
from apps.multitenancy.models import Tenant
from apps.accounts.models import User


class AcademicYear(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="academic_years",
    )
    name = models.CharField(max_length=20)  # e.g. 2024–25
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    class Meta:
        unique_together = ("tenant", "name")

    def __str__(self):
        return self.name


class SchoolClass(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="school_classes",
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name="classes",
    )
    name = models.CharField(max_length=50)   # Class 1, X, XII
    order = models.PositiveIntegerField()

    class Meta:
        unique_together = ("tenant", "academic_year", "name")
        ordering = ("order",)

    def __str__(self):
        return self.name


class Section(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    name = models.CharField(max_length=10)  # A, B, C

    class Meta:
        unique_together = ("school_class", "name")

    def __str__(self):
        return f"{self.school_class.name} - {self.name}"


class Subject(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="subjects",
    )
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, blank=True)

    class Meta:
        unique_together = ("tenant", "name")

    def __str__(self):
        return self.name


class SectionSubject(models.Model):
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="section_subjects",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
    )

    class Meta:
        unique_together = ("section", "subject")




class Student(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="students",
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="student_profile",
        null=True,
        blank=True,
    )

    admission_number = models.CharField(max_length=50)
    full_name = models.CharField(max_length=255)
    parent_contact = models.CharField(max_length=30, blank=True)

    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.PROTECT,
        related_name="students",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.PROTECT,
        related_name="students",
    )

    is_active = models.BooleanField(default=True)
    joined_at = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ("tenant", "admission_number")

    def __str__(self):
        return self.full_name

class Teacher(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="teachers",
    )
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="teacher_profile",
    )

    employee_id = models.CharField(max_length=50)
    full_name = models.CharField(max_length=255)

    is_active = models.BooleanField(default=True)
    joined_at = models.DateField(auto_now_add=True)

    class Meta:
        unique_together = ("tenant", "employee_id")

    def __str__(self):
        return self.full_name


class TeachingAssignment(models.Model):
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="assignments",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="teaching_assignments",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
    )

    class Meta:
        unique_together = ("teacher", "section", "subject")

    def __str__(self):
        return f"{self.teacher} - {self.subject}"

class Exam(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="exams",
    )
    academic_year = models.ForeignKey(
        AcademicYear,
        on_delete=models.CASCADE,
        related_name="exams",
    )

    name = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()

    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    published_by = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="published_exams",
    )

    class Meta:
        unique_together = ("tenant", "academic_year", "name")

    def __str__(self):
        return self.name

class ExamSubject(models.Model):
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="exam_subjects",
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
    )

    max_marks = models.PositiveIntegerField()
    pass_marks = models.PositiveIntegerField()

    class Meta:
        unique_together = ("exam", "subject")

    def __str__(self):
        return f"{self.exam.name} - {self.subject.name}"


class StudentExam(models.Model):
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="exam_entries",
    )
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="student_entries",
    )

    is_absent = models.BooleanField(default=False)

    class Meta:
        unique_together = ("student", "exam")

    def __str__(self):
        return f"{self.student} - {self.exam}"


class StudentMark(models.Model):
    student_exam = models.ForeignKey(
        StudentExam,
        on_delete=models.CASCADE,
        related_name="marks",
    )
    exam_subject = models.ForeignKey(
        ExamSubject,
        on_delete=models.CASCADE,
    )

    marks_obtained = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ("student_exam", "exam_subject")

    def __str__(self):
        return f"{self.student_exam} - {self.exam_subject.subject}"


class StudentResult(models.Model):
    student_exam = models.OneToOneField(
        StudentExam,
        on_delete=models.CASCADE,
        related_name="result",
    )

    total_marks = models.FloatField()
    max_marks = models.FloatField()

    percentage = models.FloatField()

    is_pass = models.BooleanField()

    generated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student_exam} - {self.percentage}%"
    
class GradingRule(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="grading_rules",
    )
    min_percentage = models.FloatField()
    grade = models.CharField(max_length=5)

class ClassTeacher(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="class_teachers",
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
        related_name="class_teacher_roles",
    )
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="class_teachers",
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name="class_teachers",
    )

    class Meta:
        unique_together = ("tenant", "school_class", "section")


class ParentStudent(models.Model):
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.CASCADE,
        related_name="parent_students",
    )
    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="children_links",
        limit_choices_to={"role": "PARENT"},
    )
    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="parent_links",
    )

    class Meta:
        unique_together = ("parent", "student")

