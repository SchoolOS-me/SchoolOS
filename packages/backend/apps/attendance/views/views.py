from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_teacher

from apps.attendance.permissions import check_attendance_access
from apps.attendance.sevices.reports import get_section_attendance_report
from apps.multitenancy.utils import scope_queryset_to_tenant
from apps.academics.models import Teacher
from apps.attendance.models import AttendanceSession, StudentAttendance
from apps.academics.permissions import teacher_can_access_section



class AttendanceSessionCreateAPI(APIView):

    def post(self, request):
        check_attendance_access(request.user)

        section_uuid = request.data.get("section_uuid")
        school_class_uuid = request.data.get("school_class_uuid")
        date = request.data.get("date")

        if not section_uuid or not school_class_uuid or not date:
            return Response(
                {"detail": "Missing required fields"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not teacher_can_access_section(request.user, section_uuid):
            return Response(
                {"detail": "Not assigned to this section"},
                status=status.HTTP_403_FORBIDDEN,
            )

        session, created = AttendanceSession.objects.get_or_create(
            tenant=request.user.school.tenant,
            date=date,
            school_class__uuid=school_class_uuid,
            section__uuid=section_uuid,
            defaults={
                "teacher_id": request.user.teacher_profile.id,
            },
        )

        if not created:
            return Response(
                {"detail": "Attendance already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {"uuid": str(session.uuid)},
            status=status.HTTP_201_CREATED,
        )

class MarkAttendanceAPI(APIView):

    def post(self, request):
        check_attendance_access(request.user)

        data = request.data
        session_uuid = data["session_uuid"]
        records = data["records"]  # list of {student_uuid, is_present}

        session = AttendanceSession.objects.get(uuid=session_uuid)

        for record in records:
            StudentAttendance.objects.update_or_create(
                session=session,
                student__uuid=record["student_uuid"],
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
                "uuid": str(s.uuid),
                "date": s.date,
                "class": s.school_class.name,
                "class_uuid": str(s.school_class.uuid),
                "section": s.section.name,
                "section_uuid": str(s.section.uuid),
            }
            for s in qs
        ]

        return Response(data)
    





class SectionAttendanceReportAPI(APIView):

    def get(self, request):
        check_attendance_access(request.user)

        data = request.query_params

        report = get_section_attendance_report(
            school_class_uuid=data["school_class_uuid"],
            section_uuid=data["section_uuid"],
            start_date=data["start_date"],
            end_date=data["end_date"],
        )

        return Response(report)


