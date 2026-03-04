
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
        exam_uuid = data.get("exam_uuid")
        section_uuid = data.get("section_uuid")
        subject_uuid = data.get("subject_uuid")
        marks = data.get("marks")  # [{student_uuid, marks_obtained}]

        if not all([exam_uuid, section_uuid, subject_uuid, marks]):
            return Response(
                {"detail": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 2️⃣ Teaching assignment check (MOST IMPORTANT)
        if not teacher_can_enter_marks(request.user, section_uuid, subject_uuid):
            return Response(
                {"detail": "Not assigned to this subject/section"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # 3️⃣ Validate exam & subject mapping
        try:
            exam = Exam.objects.get(uuid=exam_uuid)
            exam_subject = ExamSubject.objects.get(
                exam=exam,
                subject__uuid=subject_uuid,
            )
        except (Exam.DoesNotExist, ExamSubject.DoesNotExist):
            return Response(
                {"detail": "Invalid exam or subject"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 4️⃣ Save marks
        for item in marks:
            student_uuid = item.get("student_uuid")
            marks_obtained = item.get("marks_obtained")

            try:
                student = Student.objects.get(
                    uuid=student_uuid,
                    section__uuid=section_uuid,
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
