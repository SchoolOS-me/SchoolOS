from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.permissions import is_school_admin, is_super_admin
from apps.dashboard.admin import get_admin_dashboard_summary
from apps.dashboard.utils import get_user_tenant



class AdminDashboardAPI(APIView):

    def get(self, request):
        if not (is_school_admin(request.user) or is_super_admin(request.user)):
            return Response(
                {"detail": "Not allowed"},
                status=status.HTTP_403_FORBIDDEN,
            )

        tenant = get_user_tenant(request.user)
        data = get_admin_dashboard_summary(tenant)

        return Response(data)
