
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_teacher
from apps.academics.permissions import teacher_can_enter_marks
from apps.academics.models import (
    Student,
    StudentExam,
    StudentMark,
    Exam,
    ExamSubject,
)


class TeacherMarksEntryAPI(APIView):

    def post(self, request):
        # 1️⃣ Role check
        if not is_teacher(request.user):
            return Response(
                {"detail": "Not a teacher"},
                status=status.HTTP_403_FORBIDDEN,
            )

        data = request.data
        exam_id = data.get("exam")
        section_id = data.get("section")
        subject_id = data.get("subject")
        marks = data.get("marks")  # [{student_id, marks_obtained}]

        if not all([exam_id, section_id, subject_id, marks]):
            return Response(
                {"detail": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2️⃣ Teaching assignment check (MOST IMPORTANT)
        if not teacher_can_enter_marks(request.user, section_id, subject_id):
            return Response(
                {"detail": "Not assigned to this subject/section"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 3️⃣ Validate exam & subject mapping
        try:
            exam = Exam.objects.get(id=exam_id)
            exam_subject = ExamSubject.objects.get(
                exam=exam,
                subject_id=subject_id,
            )
        except (Exam.DoesNotExist, ExamSubject.DoesNotExist):
            return Response(
                {"detail": "Invalid exam or subject"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4️⃣ Save marks
        for item in marks:
            student_id = item.get("student_id")
            marks_obtained = item.get("marks_obtained")

            try:
                student = Student.objects.get(
                    id=student_id,
                    section_id=section_id,
                )
            except Student.DoesNotExist:
                continue  # skip invalid students safely

            student_exam, _ = StudentExam.objects.get_or_create(
                student=student,
                exam=exam,
            )

            StudentMark.objects.update_or_create(
                student_exam=student_exam,
                exam_subject=exam_subject,
                defaults={"marks_obtained": marks_obtained},
            )

        return Response(
            {"detail": "Marks saved successfully"},
            status=status.HTTP_200_OK,
        )

