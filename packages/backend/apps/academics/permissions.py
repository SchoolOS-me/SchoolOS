from apps.academics.models import TeachingAssignment
from apps.academics.models import ParentStudent


def parent_can_access_student(user, student_id):
    return ParentStudent.objects.filter(
        parent=user,
        student_id=student_id,
    ).exists()


def teacher_can_access_section(user, section_id):
    return TeachingAssignment.objects.filter(
        teacher__user=user,
        section_id=section_id,
    ).exists()


def teacher_can_enter_marks(user, section_id, subject_id):
    return TeachingAssignment.objects.filter(
        teacher__user=user,
        section_id=section_id,
        subject_id=subject_id,
    ).exists()




def parent_can_access_student(user, student_id):
    return ParentStudent.objects.filter(
        parent=user,
        student_id=student_id,
    ).exists()
