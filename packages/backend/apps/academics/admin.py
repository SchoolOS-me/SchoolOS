from django.contrib import admin
from .models import (
    AcademicYear,
    SchoolClass,
    Section,
    Subject,
    SectionSubject,
    Student,
    Teacher,
    TeachingAssignment,
    Exam,
    ExamSubject,
    StudentExam,
    StudentMark,
    StudentResult,
    GradingRule,

)

admin.site.register(AcademicYear)
admin.site.register(SchoolClass)
admin.site.register(Section)
admin.site.register(Subject)
admin.site.register(SectionSubject)
admin.site.register(Student)
admin.site.register(Teacher)
admin.site.register(TeachingAssignment)
admin.site.register(Exam)
admin.site.register(ExamSubject)
admin.site.register(StudentExam)
admin.site.register(StudentMark)
admin.site.register(StudentResult)
admin.site.register(GradingRule)

