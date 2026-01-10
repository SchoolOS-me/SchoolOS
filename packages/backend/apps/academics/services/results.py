from apps.academics.models import StudentMark, StudentResult
from apps.academics.models import StudentMark

def generate_student_result(student_exam):
    marks_qs = StudentMark.objects.filter(
        student_exam=student_exam,
        marks_obtained__isnull=False
    ).select_related("exam_subject")

    total = 0
    max_total = 0
    is_pass = True

    for mark in marks_qs:
        total += mark.marks_obtained
        max_total += mark.exam_subject.max_marks

        if mark.marks_obtained < mark.exam_subject.pass_marks:
            is_pass = False

    percentage = (total / max_total) * 100 if max_total else 0

    result, _ = StudentResult.objects.update_or_create(
        student_exam=student_exam,
        defaults={
            "total_marks": total,
            "max_marks": max_total,
            "percentage": percentage,
            "is_pass": is_pass,
        },
    )

    return result




def compute_student_result(student_exam):
    """
    Compute raw result data for a single student in a single exam.
    This does NOT save anything to DB.
    """

    marks = StudentMark.objects.filter(
        student_exam=student_exam,
        marks_obtained__isnull=False
    ).select_related("exam_subject")

    total = sum(m.marks_obtained for m in marks)
    max_total = sum(m.exam_subject.max_marks for m in marks)

    is_pass = all(
        m.marks_obtained >= m.exam_subject.pass_marks
        for m in marks
    )

    percentage = (total / max_total) * 100 if max_total else 0

    return {
        "total_marks": total,
        "max_marks": max_total,
        "percentage": percentage,
        "is_pass": is_pass,
    }