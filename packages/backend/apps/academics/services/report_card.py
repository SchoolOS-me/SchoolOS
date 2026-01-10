from apps.academics.models import (
    StudentExam,
    StudentMark,
    StudentResult,
    ExamSubject,
)
from apps.academics.services.results import generate_student_result


def generate_report_card(student_exam: StudentExam) -> dict:
    """
    Returns a structured report card for one student + exam
    """

    # Ensure result exists
    result = generate_student_result(student_exam)

    exam = student_exam.exam
    student = student_exam.student

    exam_subjects = ExamSubject.objects.filter(
        exam=exam
    ).select_related("subject")

    marks_map = {
        m.exam_subject_id: m
        for m in StudentMark.objects.filter(
            student_exam=student_exam
        ).select_related("exam_subject")
    }

    subjects_data = []

    for exam_subject in exam_subjects:
        mark = marks_map.get(exam_subject.id)

        subjects_data.append({
            "subject_name": exam_subject.subject.name,
            "max_marks": exam_subject.max_marks,
            "pass_marks": exam_subject.pass_marks,
            "marks_obtained": (
                None if student_exam.is_absent
                else mark.marks_obtained if mark else None
            ),
            "is_pass": (
                False if student_exam.is_absent
                else mark.marks_obtained >= exam_subject.pass_marks
                if mark and mark.marks_obtained is not None
                else False
            ),
        })

    return {
        "student": {
            "name": student.full_name,
            "admission_number": student.admission_number,
            "class": student.school_class.name,
            "section": student.section.name,
        },
        "exam": {
            "name": exam.name,
            "academic_year": exam.academic_year.name,
        },
        "subjects": subjects_data,
        "summary": {
            "total_marks": result.total_marks,
            "max_marks": result.max_marks,
            "percentage": result.percentage,
            "is_pass": result.is_pass,
        },
    }


def compute_section_rank(student_exam):
    exam = student_exam.exam
    section = student_exam.student.section

    results = StudentResult.objects.filter(
        student_exam__exam=exam,
        student_exam__student__section=section,
        is_pass=True,
    ).order_by("-percentage")

    ranked_ids = [r.student_exam_id for r in results]

    try:
        return ranked_ids.index(student_exam.id) + 1
    except ValueError:
        return None
