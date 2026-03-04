from apps.academics.models import TeachingAssignment
from apps.academics.models import ParentStudent


def parent_can_access_student(user, student_uuid):
    return ParentStudent.objects.filter(
        parent=user,
        student__uuid=student_uuid,
    ).exists()


def teacher_can_access_section(user, section_uuid):
    return TeachingAssignment.objects.filter(
        teacher__user=user,
        section__uuid=section_uuid,
    ).exists()


def teacher_can_enter_marks(user, section_uuid, subject_uuid):
    return TeachingAssignment.objects.filter(
        teacher__user=user,
        section__uuid=section_uuid,
        subject__uuid=subject_uuid,
    ).exists()




def parent_can_access_student(user, student_uuid):
    return ParentStudent.objects.filter(
        parent=user,
        student__uuid=student_uuid,
    ).exists()
