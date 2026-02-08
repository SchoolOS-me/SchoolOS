from datetime import timedelta

from django.utils.timezone import now
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from apps.accounts.constants import UserRole
from apps.accounts.models import User
from apps.accounts.permissions import is_super_admin
from apps.schools.models import School


class SuperAdminDashboardAPI(APIView):

    def get(self, request):
        if not is_super_admin(request.user):
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        schools = School.objects.all().order_by("-created_at")
        total_schools = schools.count()
        active_schools = schools.filter(is_active=True).count()

        trial_cutoff = now() - timedelta(days=30)
        trial_schools = schools.filter(is_active=True, created_at__gte=trial_cutoff).count()
        expired_schools = schools.filter(is_active=False).count()

        active_subscriptions = active_schools
        expired_subscriptions = expired_schools
        trial_subscriptions = trial_schools

        try:
            from djstripe import models as djstripe_models

            active_subscriptions = djstripe_models.Subscription.objects.filter(status="active").count()
            trial_subscriptions = djstripe_models.Subscription.objects.filter(status="trialing").count()
            expired_subscriptions = djstripe_models.Subscription.objects.filter(
                status__in=["canceled", "unpaid", "incomplete_expired"]
            ).count()
        except Exception:
            pass

        admin_users = User.objects.filter(
            role=UserRole.SCHOOL_ADMIN,
            school__in=schools,
        ).select_related("school")

        admin_map = {}
        for admin in admin_users:
            if admin.school_id not in admin_map:
                admin_map[admin.school_id] = admin

        school_rows = []
        for school in schools:
            admin = admin_map.get(school.id)
            if not school.is_active:
                subscription_status = "expired"
            elif school.created_at >= trial_cutoff:
                subscription_status = "trial"
            else:
                subscription_status = "active"

            school_rows.append(
                {
                    "id": school.id,
                    "name": school.name,
                    "admin_name": admin.email.split("@")[0] if admin else None,
                    "admin_email": admin.email if admin else None,
                    "subscription_status": subscription_status,
                }
            )

        return Response(
            {
                "stats": {
                    "total_schools": total_schools,
                    "active_subscriptions": active_subscriptions,
                    "expired_subscriptions": expired_subscriptions,
                    "trial_schools": trial_schools,
                },
                "schools": school_rows,
            }
        )
