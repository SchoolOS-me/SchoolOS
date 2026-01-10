from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_teacher

from apps.attendance.permissions import check_attendance_access
from apps.attendance.sevices.reports import get_section_attendance_report
from apps.multitenancy.utils import scope_queryset_to_tenant
from apps.academics.models import Teacher
from apps.attendance.models import AttendanceSession, StudentAttendance


class AttendanceSessionCreateAPI(APIView):

    def post(self, request):
        check_attendance_access(request.user)

        data = request.data
        tenant = request.user.school.tenant

        session, created = AttendanceSession.objects.get_or_create(
            tenant=tenant,
            date=data["date"],
            school_class_id=data["school_class"],
            section_id=data["section"],
            defaults={
                "teacher": Teacher.objects.get(user=request.user),
            },
        )

        if not created:
            return Response(
                {"detail": "Attendance already exists for this class today"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"id": session.id, "detail": "Attendance session created"},
            status=status.HTTP_201_CREATED,
        )
    
class MarkAttendanceAPI(APIView):

    def post(self, request):
        check_attendance_access(request.user)

        data = request.data
        session_id = data["session_id"]
        records = data["records"]  # list of {student_id, is_present}

        session = AttendanceSession.objects.get(id=session_id)

        for record in records:
            StudentAttendance.objects.update_or_create(
                session=session,
                student_id=record["student_id"],
                defaults={
                    "is_present": record["is_present"],
                    "remarks": record.get("remarks", ""),
                },
            )

        return Response({"detail": "Attendance saved"})
    
class AttendanceSessionListAPI(APIView):

    def get(self, request):
        check_attendance_access(request.user)

        qs = AttendanceSession.objects.all()
        qs = scope_queryset_to_tenant(qs, request.user)

        # Teachers only see their own sessions
        if is_teacher(request.user):
            qs = qs.filter(teacher__user=request.user)

        data = [
            {
                "id": s.id,
                "date": s.date,
                "class": s.school_class.name,
                "section": s.section.name,
            }
            for s in qs
        ]

        return Response(data)
    





class SectionAttendanceReportAPI(APIView):

    def get(self, request):
        check_attendance_access(request.user)

        data = request.query_params

        report = get_section_attendance_report(
            school_class_id=data["school_class"],
            section_id=data["section"],
            start_date=data["start_date"],
            end_date=data["end_date"],
        )

        return Response(report)



