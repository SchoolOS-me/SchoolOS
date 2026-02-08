from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from apps.accounts.permissions import is_super_admin
from .models import School
from .serializers import SchoolSerializer


class SchoolListCreateAPI(APIView):

    def get(self, request):
        if not is_super_admin(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        schools = School.objects.all().order_by("-created_at")
        serializer = SchoolSerializer(schools, many=True)
        return Response(serializer.data)

    def post(self, request):
        if not is_super_admin(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        serializer = SchoolSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        school = serializer.save()
        return Response(SchoolSerializer(school).data, status=status.HTTP_201_CREATED)


class SchoolDetailAPI(APIView):

    def get(self, request, school_id):
        if not is_super_admin(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        return Response(SchoolSerializer(school).data)

    def patch(self, request, school_id):
        if not is_super_admin(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        school = get_object_or_404(School, id=school_id)
        serializer = SchoolSerializer(school, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        school = serializer.save()
        return Response(SchoolSerializer(school).data)
