from apps.accounts.permissions import is_teacher, is_school_admin
from apps.multitenancy.features import is_feature_enabled


def check_attendance_access(user):
    tenant = user.school.tenant

    if not is_feature_enabled(tenant, "attendance"):
        raise PermissionError("Attendance feature not enabled")

    if not (is_teacher(user) or is_school_admin(user)):
        raise PermissionError("Not allowed")
